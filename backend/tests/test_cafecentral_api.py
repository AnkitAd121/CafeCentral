"""CafeCentral backend API tests.

Covers:
- Public endpoints (root, reviews list)
- Auth (me with/without token)
- Saved cafes CRUD + idempotency
- Reviews creation (authenticated) + ordering
"""
import os
import time
import uuid
import subprocess
import json
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


def _mongo_seed_user():
    ts = int(time.time() * 1000)
    user_id = f"test-user-{ts}-{uuid.uuid4().hex[:6]}"
    token = f"test_session_{ts}_{uuid.uuid4().hex[:8]}"
    email = f"test.user.{ts}@example.com"
    js = f"""
    use('test_database');
    db.users.insertOne({{ user_id: '{user_id}', email: '{email}', name: 'Test User', picture: 'https://via.placeholder.com/150', created_at: new Date() }});
    db.user_sessions.insertOne({{ user_id: '{user_id}', session_token: '{token}', expires_at: new Date(Date.now()+7*24*60*60*1000), created_at: new Date() }});
    """
    subprocess.run(["mongosh", "--quiet", "--eval", js], check=True, capture_output=True)
    return user_id, token, email


@pytest.fixture(scope="session")
def auth():
    user_id, token, email = _mongo_seed_user()
    yield {"user_id": user_id, "token": token, "email": email}
    # cleanup
    js = f"""
    use('test_database');
    db.users.deleteOne({{user_id: '{user_id}'}});
    db.user_sessions.deleteMany({{user_id: '{user_id}'}});
    db.saved_cafes.deleteMany({{user_id: '{user_id}'}});
    db.reviews.deleteMany({{user_email: '{email}'}});
    """
    subprocess.run(["mongosh", "--quiet", "--eval", js], capture_output=True)


@pytest.fixture
def headers(auth):
    return {"Authorization": f"Bearer {auth['token']}", "Content-Type": "application/json"}


# ---------- Public ----------
class TestPublic:
    def test_root(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("message") == "CafeCentral API"

    def test_reviews_seeded(self):
        r = requests.get(f"{API}/reviews", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        # validate shape
        for rv in data[:4]:
            for k in ("id", "cafe_id", "user_name", "rating", "text", "created_at"):
                assert k in rv


# ---------- Auth ----------
class TestAuth:
    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, headers, auth):
        r = requests.get(f"{API}/auth/me", headers=headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user_id"] == auth["user_id"]
        assert data["email"] == auth["email"]

    def test_me_invalid_token(self):
        r = requests.get(
            f"{API}/auth/me",
            headers={"Authorization": "Bearer not_a_real_token"},
            timeout=15,
        )
        assert r.status_code == 401


# ---------- Saved cafes ----------
class TestSavedCafes:
    def test_saved_requires_auth(self):
        assert requests.get(f"{API}/saved", timeout=15).status_code == 401
        assert requests.post(f"{API}/saved", json={"cafe_id": "x"}, timeout=15).status_code == 401

    def test_add_get_idempotent_delete(self, headers):
        cafe_id = "dyu-art-cafe"
        # add
        r = requests.post(f"{API}/saved", headers=headers, json={"cafe_id": cafe_id}, timeout=15)
        assert r.status_code == 200, r.text
        # add again - idempotent
        r = requests.post(f"{API}/saved", headers=headers, json={"cafe_id": cafe_id}, timeout=15)
        assert r.status_code == 200
        # get
        r = requests.get(f"{API}/saved", headers=headers, timeout=15)
        assert r.status_code == 200
        lst = r.json()
        assert lst.count(cafe_id) == 1, f"Expected idempotent single entry, got {lst}"
        # delete
        r = requests.delete(f"{API}/saved/{cafe_id}", headers=headers, timeout=15)
        assert r.status_code == 200
        r = requests.get(f"{API}/saved", headers=headers, timeout=15)
        assert cafe_id not in r.json()


# ---------- Reviews ----------
class TestReviews:
    def test_post_review_requires_auth(self):
        r = requests.post(
            f"{API}/reviews",
            json={"cafe_id": "dyu-art-cafe", "rating": 5, "text": "x"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_post_review_and_appears_at_top(self, headers, auth):
        unique = uuid.uuid4().hex[:8]
        payload = {"cafe_id": "the-quiet-cup", "rating": 4, "text": f"TEST_REVIEW_{unique}"}
        r = requests.post(f"{API}/reviews", headers=headers, json=payload, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["cafe_id"] == payload["cafe_id"]
        assert body["rating"] == 4
        assert body["text"] == payload["text"]
        assert body["user_email"] == auth["email"]
        # GET reviews - should be at top (sorted desc by created_at)
        r = requests.get(f"{API}/reviews", timeout=15)
        assert r.status_code == 200
        feed = r.json()
        assert feed[0]["id"] == body["id"], "New review should be at top of feed"
