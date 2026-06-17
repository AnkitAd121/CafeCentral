CLAUDE.md — CafeCentral


Standing instructions for any Claude (Cowork, Claude Code, or chat) working on this project.
Read this fully before making changes. It exists so you don't re-learn the project or repeat past wrong assumptions every session.




What this project is

CafeCentral is a cafe discovery and listing platform for Guwahati, Assam, India. Goal: a single trustworthy place to discover cafes, read community reviews, and (eventually) book. Long-term vision is a marketplace that scales to other cities.


Team: Ankit (website/product) + a friend (Instagram content, @cafecentralguwahati). Budget: ₹0 / free tiers.
Working style: Ankit is non-technical and does NOT write code by hand. The pattern is: Ankit describes a change in plain English → Claude produces the change → it goes into GitHub → Vercel auto-deploys. Explain why, not just what, in plain language. Avoid jargon or define it.
Business identity: cafecentral.team@gmail.com (cc.team). Personal Gmail is used for some tools (see Login Map).



⚠️ Read this before assuming anything (hard-won corrections)

These are real mistakes that have been made before. Do not repeat them.


This project does NOT use Supabase. Many vibe-coding tutorials do, so it's a tempting assumption. It is wrong. The stack is below.
Cafes are currently HARDCODED in the FRONTEND, not stored in MongoDB. server.py has NO cafe collection and NO cafe endpoint — it only handles auth, reviews, saved cafes, and event signups. Reviews reference cafes by string ID (e.g. dyu-art-cafe), but the cafe records themselves live in a React data file. So adding or editing cafes = a frontend code change + commit, not a database insert. (Migrating cafes into a real cafes collection + API is a planned future task, not yet done.)
Do not invent factual data about real businesses. For real cafes, never fabricate exact addresses, hours, menu prices, or ratings. Write only name/area/vibe/description from public facts and mark unknown factual fields as VERIFY for Ankit to fill from real cafe surveys. Fabricated details destroy the trust the site exists to build.
Do not copy text or images from Zomato / Tripadvisor / cafes' own pages. Copyright + it reads as generic. Write original descriptions.



The stack (source of truth)

LayerToolNotesCodeGitHubgithub.com/AnkitAd121/CafeCentral. Browser editor is Ankit's main IDE.FrontendReact on Vercelcafe-central-tawny.vercel.app. Auto-deploys on push to the repo. Hobby/free tier (single-person; commercial use is grey-area).BackendPython FastAPICurrently on Railway (cafecentral-production-f5f2.up.railway.app). Migrating to Koyeb (~late June 2026) before the Railway trial expires.DatabaseMongoDB AtlasCluster cafecentral, db user ankitadmin. Free M0 tier auto-pauses after 30 days idle (warning email 7 days prior). Resume = one click in Atlas.AuthGoogle OAuthGoogle Identity Services. Google Cloud project cafecentral-498915. Client ID is in server.py / env.DNS/CDNCloudflare (planned)For cafecentral.in, not set up yet.DomainNamecheap (planned)cafecentral.in, deferred to Phase 1.EmailBrevo (planned)List signup + transactional.AnalyticsPostHog (planned)Free tier.

Data flow

user → Vercel (frontend) → FastAPI (Railway/Koyeb) → MongoDB Atlas, with Google OAuth verifying logins. Frontend never talks to the database directly — always through the backend. Cafes are the exception: they're served from frontend code, not the API (see correction #2).


Backend facts (from server.py)


API is mounted under the /api prefix.
MongoDB collections actually in use: users, user_sessions, saved_cafes, reviews, event_signups. (No cafes collection.)
Auth model: Google access token → verified via Google userinfo endpoint → user upserted → a session_token (7-day expiry) is created and returned in the response body; frontend stores it in localStorage and sends it as Authorization: Bearer <token>. Cookie fallback exists for backwards-compat.
Reviews are public to read; only authenticated users can post. Ratings are clamped 1–5.
Mock reviews are seeded on startup only if the reviews collection is empty (see MOCK_REVIEWS). The seeded cafe IDs (pages-and-pour, dyu-art-cafe, the-quiet-cup, rooftop-ritual) must match the cafe IDs used in the frontend, or reviews won't attach to the right cafe.
CORS lives in server.py in ALLOWED_ORIGIN_PATTERNS (a regex list). This is critical and easy to break:

When the backend moves to Koyeb, the backend URL changes → update the frontend's backend URL reference.
When the domain cafecentral.in goes live or the Vercel preview URL changes, add/confirm the matching origin pattern here, or the frontend will get CORS-blocked.






Login Map (which account / method per tool)

Each tool remembers ONE signup method. Using the wrong one looks like a lockout but isn't.


MongoDB Atlas — Sign in with Google (personal Gmail). NOT GitHub. cc.team has also been granted Organization Owner access.
Google Cloud / OAuth — Sign in with cc.team. Project cafecentral-498915.
GitHub — username AnkitAd121 + password (not a Google login).
Vercel — Sign in with GitHub (tied to AnkitAd121). Free tier can't add members.
Railway — (confirm method; being retired for Koyeb.)
Koyeb / Cloudflare / Brevo / Namecheap — create under cc.team when set up.


If locked out: confirm the login method first; if truly stuck, use "Forgot password" — whichever email gets a reset link owns that account.


How to work in this repo (rules for Claude)


Don't push straight to production. Vercel auto-deploys from the repo, and the site has (or soon will have) real users. Make changes on a branch or a pull request so Ankit can review before it goes live. Do not commit directly to the main/production branch without explicit say-so.
Sync before editing. Work from the latest repo state, not a stale snapshot.
Full files, not diffs, when handing code to Ankit in chat. He pastes whole files into the GitHub browser editor. (Inside Cowork with repo access, normal edits/commits-on-a-branch are fine.)
Match existing patterns. Before adding cafes or features, read the existing frontend cafe data file and mirror its exact field names and shape. Don't invent a new schema.
Touch CORS carefully. Any change to URLs/domains/hosts means checking ALLOWED_ORIGIN_PATTERNS in server.py.
Flag anything destructive (deleting data, changing auth, editing access/permissions) and get explicit confirmation first. Never remove Ankit's existing account access from a tool until replacement access is confirmed working.
Keep costs at zero. Prefer free-tier solutions. Call out anything that would incur a charge before doing it.



Current priorities (as of June 2026)


Add ~10 real Guwahati cafes to the frontend cafe data (for trust/proof). Real names + areas + original descriptions; VERIFY markers on address/hours/prices/rating; real or licensed photos only. NOTE: the existing sample "Dyu Art Cafe" is mislabelled (it's a Bangalore cafe shown as "Koramangala, Guwahati") — replace/fix it.
Migrate backend Railway → Koyeb (~late June 2026, before trial expiry). Create Koyeb under cc.team. After: update frontend backend URL + CORS origins.
Clean up Emergent/scaffold junk files in the repo.
Build Submit Your Cafe form (pairs naturally with moving cafes into a real cafes collection + API).
Add Brevo email signup.
Buy cafecentral.in (Namecheap) + connect via Cloudflare.


Feature pipeline (later)

Digital Menu QR + Cafe Announcement Board (strongest cafe-owner incentive) · AI Review Reply Suggester · Random Cafe Picker · Featured Cafe (weekly → paid placement) · Phase 2: Events/RSVP, Vibe Tags, Photo Wall, Mood Quiz, wishlists · Phase 3: leaderboards, real-time busyness, bookings (Razorpay/Stripe), admin panel · Phase 4: multi-city, mobile app.


Glossary for plain-English collaboration


Frontend = the website people see (React on Vercel).
Backend = the program that does the logic (FastAPI on Railway/Koyeb).
Database = where data is stored (MongoDB Atlas).
CORS = the backend's list of which websites are allowed to talk to it. Wrong list = frontend can't load data.
Branch / PR = a safe draft copy of changes that can be reviewed before going live.
