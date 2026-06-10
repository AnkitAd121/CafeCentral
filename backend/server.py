from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Header
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import re
import requests as http_requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '882647879694-5ot12g2al7l1lf84mf7pbcoeegsg2anr.apps.googleusercontent.com')
SESSION_DAYS = 7

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------------- CORS ----------------
ALLOWED_ORIGIN_PATTERNS = [
    r"^https://cafe-central-[a-z0-9-]+-ankit-ad-s-projects\.vercel\.app$",
    r"^https://cafe-central-tawny\.vercel\.app$",
    r"^https://cafecentral\.in$",
    r"^https://www\.cafecentral\.in$",
    r"^http://localhost:\d+$",
]

def is_allowed_origin(origin: str) -> bool:
    return any(re.match(p, origin) for p in ALLOWED_ORIGIN_PATTERNS)


from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.datastructures import Headers
from starlette.responses import Response as StarletteResponse

class RegexCORSMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            headers = Headers(scope=scope)
            origin = headers.get("origin", "")

            async def send_with_cors(message):
                if message["type"] == "http.response.start" and origin and is_allowed_origin(origin):
                    headers_list = list(message.get("headers", []))
                    headers_list += [
                        (b"access-control-allow-origin", origin.encode()),
                        (b"access-control-allow-credentials", b"true"),
                        (b"access-control-allow-methods", b"GET, POST, PUT, DELETE, OPTIONS, PATCH"),
                        (b"access-control-allow-headers", b"*"),
                        (b"vary", b"Origin"),
                    ]
                    message = dict(message)
                    message["headers"] = headers_list
                await send(message)

            if scope["method"] == "OPTIONS" and origin and is_allowed_origin(origin):
                response = StarletteResponse(
                    status_code=204,
                    headers={
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                        "Access-Control-Allow-Headers": "*",
                        "Vary": "Origin",
                    },
                )
                await response(scope, receive, send)
                return

            await self.app(scope, receive, send_with_cors)
        else:
            await self.app(scope, receive, send)


app.add_middleware(RegexCORSMiddleware)


# ---------------- Models ----------------
class GoogleAuthInput(BaseModel):
    access_token: str

class SaveCafeInput(BaseModel):
    cafe_id: str

class ReviewInput(BaseModel):
    cafe_id: str
    rating: int
    text: str

class Review(BaseModel):
    id: str
    cafe_id: str
    user_name: str
    user_email: str
    rating: int
    text: str
    created_at: str


# ---------------- Auth helpers ----------------
async def get_current_user(request: Request) -> dict:
    token = None
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
    # Cookie fallback (for backwards compat)
    if not token:
        token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "CafeCentral API"}


@api_router.post("/auth/google")
async def auth_google(input: GoogleAuthInput, response: Response):
    """Verify Google access token, upsert user, create session."""
    try:
        userinfo_resp = http_requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {input.access_token}"},
            timeout=10,
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        userinfo = userinfo_resp.json()
        email = userinfo.get("email")
        name = userinfo.get("name", email.split("@")[0] if email else "User")
        picture = userinfo.get("picture")

        if not email:
            raise HTTPException(status_code=401, detail="No email in Google token")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

    # Upsert user
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    # Create session token
    session_token = uuid.uuid4().hex
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    # Return token in body so frontend can store in localStorage
    return {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": picture,
        "session_token": session_token,
    }


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await get_current_user(request)
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture"),
    }


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = None
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}


# ---------------- Saved cafes ----------------
@api_router.get("/saved")
async def get_saved(request: Request):
    user = await get_current_user(request)
    rows = await db.saved_cafes.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(1000)
    return [r["cafe_id"] for r in rows]


@api_router.post("/saved")
async def add_saved(input: SaveCafeInput, request: Request):
    user = await get_current_user(request)
    existing = await db.saved_cafes.find_one(
        {"user_id": user["user_id"], "cafe_id": input.cafe_id}, {"_id": 0}
    )
    if not existing:
        await db.saved_cafes.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": user["user_id"],
            "cafe_id": input.cafe_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    return {"ok": True, "cafe_id": input.cafe_id}


@api_router.delete("/saved/{cafe_id}")
async def remove_saved(cafe_id: str, request: Request):
    user = await get_current_user(request)
    await db.saved_cafes.delete_one({"user_id": user["user_id"], "cafe_id": cafe_id})
    return {"ok": True, "cafe_id": cafe_id}


# ---------------- Reviews ----------------
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    rows = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return rows


@api_router.post("/reviews", response_model=Review)
async def create_review(input: ReviewInput, request: Request):
    user = await get_current_user(request)
    rating = max(1, min(5, input.rating))
    review = {
        "id": str(uuid.uuid4()),
        "cafe_id": input.cafe_id,
        "user_name": user["name"],
        "user_email": user["email"],
        "rating": rating,
        "text": input.text.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(dict(review))
    return review


# ---------------- Events notify ----------------
class EventNotifyInput(BaseModel):
    email: str


@api_router.post("/events/notify")
async def events_notify(input: EventNotifyInput):
    email = input.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
    await db.event_signups.update_one(
        {"email": email},
        {"$setOnInsert": {"email": email, "created_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


# ---------------- Seed mock reviews ----------------
MOCK_REVIEWS = [
    {
        "cafe_id": "pages-and-pour",
        "user_name": "Ananya",
        "user_email": "ananya@guwahati.in",
        "rating": 5,
        "text": "Spent a whole rainy Sunday here with a borrowed Murakami and a filter coffee float. The lamp at my table, the river outside the window — I didn't want to leave. This is the soul of Uzan Bazaar.",
    },
    {
        "cafe_id": "dyu-art-cafe",
        "user_name": "Rishav",
        "user_email": "rishav.k@gmail.com",
        "rating": 5,
        "text": "The mango tree courtyard at golden hour is unreal. The Assam Estate pour-over had this honeyed, almost floral finish. Came for the art, stayed three hours for the light.",
    },
    {
        "cafe_id": "the-quiet-cup",
        "user_name": "Meghna",
        "user_email": "meghna.deka@outlook.com",
        "rating": 4,
        "text": "Finally a place where nobody takes a call. The enforced quiet sounds intense but it's pure bliss for getting work done. The oat milk cortado is my new ritual.",
    },
    {
        "cafe_id": "rooftop-ritual",
        "user_name": "Karan",
        "user_email": "karan.b@gmail.com",
        "rating": 5,
        "text": "Watched the sun melt into the Brahmaputra with a Sunset cocktail in hand. They only open at 3PM and now I understand why — this place is built entirely for the evening.",
    },
]


@app.on_event("startup")
async def seed_reviews():
    count = await db.reviews.count_documents({})
    if count == 0:
        base = datetime.now(timezone.utc)
        docs = []
        for i, r in enumerate(MOCK_REVIEWS):
            d = dict(r)
            d["id"] = str(uuid.uuid4())
            d["created_at"] = (base - timedelta(days=i + 1, hours=i * 3)).isoformat()
            docs.append(d)
        await db.reviews.insert_many(docs)


app.include_router(api_router)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
