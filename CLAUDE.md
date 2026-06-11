# CafeCentral — Project Context for Claude Code

## What this is
CafeCentral is a cafe listing and discovery platform for Guwahati, Assam, India.
Two-person team: Ankit owns the website + technical side; a friend manages Instagram content.
Strict zero-budget philosophy (₹0 wherever possible).

## How Ankit works (IMPORTANT)
- Ankit does NOT write code. He describes changes in plain English.
- Your job: make the change directly in the repo, edit the files yourself, then commit and push.
- Always explain what you changed in plain, non-technical English after doing it.
- Never ask Ankit to paste code or edit files manually unless there is no other option.
- After pushing, Vercel auto-deploys the frontend. Mention when a change will go live.

## Tech stack
- Frontend: React (Create React App). Hosted on Vercel → cafe-central-tawny.vercel.app
- Backend: FastAPI (Python). Hosted on Railway → cafecentral-production-f5f2.up.railway.app
  - Railway is on a 30-day trial. When it expires, migrate to Render (free, sleep-on-inactivity is acceptable).
- Database: MongoDB Atlas (cluster: cafecentral, user: ankitadmin)
- Auth: migrating to Google OAuth via Google Identity Services (replacing old Emergent auth)
- Planned: Cloudflare (CDN/security), Brevo (email list), PostHog (analytics)
- Domain target: cafecentral.in (Namecheap → Cloudflare → Vercel)
- Repo: github.com/AnkitAd121/CafeCentral

## Hard rules — never break these
- NEVER commit secrets. `.env` files stay local and must be in `.gitignore`.
- The repo should be private. Do not paste API keys, client secrets, or DB credentials into any committed file.
- CORS: `allow_credentials=True` does NOT work with wildcard origins. Always hardcode the
  specific Vercel frontend URL in FastAPI's CORSMiddleware.
- Railway/Render need explicit port binding: uvicorn startup in server.py must read PORT from
  environment variables.
- Do NOT reintroduce `emergentintegrations` or any Emergent-tied package. It caused build failures.

## Conventions
- Keep changes small and explained. One logical change at a time.
- Prefer free-tier solutions. Flag clearly if something would cost money before doing it.
- When unsure about current state of a deployed service, ask before assuming.

## Cleanup backlog (junk to remove if still present)
.emergent/, memory/, test_reports/, tests/, auth_testing.md, test_result.md, railway.json

## Roadmap (for context, not to build unprompted)
Phase 2: Submit-Your-Cafe form, Brevo signup, Random Cafe Picker, Featured Cafe, Events+RSVP,
Vibe Tags, Community Photo Wall, Mood Quiz, Save-for-Later.
Phase 3+: Razorpay/Stripe bookings, owner dashboards, admin panel, multi-city scaling, mobile app.
