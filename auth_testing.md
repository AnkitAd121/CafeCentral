# Auth-Gated App Testing Playbook (Emergent Google OAuth)

DB: test_database. Backend prefix: /api. Cookie OR Bearer token both accepted.

## Step 1: Create Test User & Session in MongoDB
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({ user_id: userId, email: 'test.user.'+Date.now()+'@example.com', name: 'Test User', picture: 'https://via.placeholder.com/150', created_at: new Date() });
db.user_sessions.insertOne({ user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now()+7*24*60*60*1000), created_at: new Date() });
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Backend API
- GET /api/auth/me  (Authorization: Bearer <token>) -> user json
- GET /api/saved -> [] of cafe_ids
- POST /api/saved {"cafe_id":"dyu-art-cafe"} -> ok
- DELETE /api/saved/dyu-art-cafe -> ok
- GET /api/reviews -> public list (4 seeded)
- POST /api/reviews {"cafe_id":"dyu-art-cafe","rating":5,"text":"..."} -> review (auth required)

## Step 3: Browser - set cookie then navigate
```
await page.context.add_cookies([{ "name":"session_token","value":"<TOKEN>","domain":"<host>","path":"/","httpOnly":True,"secure":True,"sameSite":"None" }])
await page.goto("<url>/dashboard")
```

## Success
- /api/auth/me returns user (not 401)
- /dashboard loads (no redirect to /login)
- save/unsave + review CRUD work
