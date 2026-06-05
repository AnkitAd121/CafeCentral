# CafeCentral — PRD

## Original Problem Statement
A curated cafe discovery guide for Guwahati, Assam — warm, editorial, magazine-like web app. Adapted (user-approved) to React (CRA) + FastAPI + MongoDB, Emergent Google OAuth, DB-persisted reviews.

## Architecture
- Frontend: React 19 (CRA/craco), react-router-dom 7, Tailwind v3, shadcn/ui, sonner, lucide-react. Fonts: Fraunces + Inter.
- Backend: FastAPI + Motor (MongoDB). Routes under /api.
- Auth: Emergent Google OAuth (session_token httpOnly cookie, 7d).
- Data: 6 cafes in /app/frontend/src/data/cafes.js (each with vibe + priceRange). Reviews, saved_cafes, event_signups in MongoDB.

## Implemented
- 2026-06-04: 6-page app (Home, Directory, Cafe Detail, Login, Dashboard, Community), Google auth, saved vault, DB reviews. Testing agent 100% pass.
- 2026-06-04: Redesign — dark-espresso top / beige bottom "barista" theme, Apple-minimal. Home hero with search + neighborhood chips. Golden Hour & Monsoon Mode relocated to minimal cards below hero. Cafe cards: photo → split-gallery hover flip revealing location + price badge (₹–₹₹₹₹) + amber title. Added `vibe` per cafe.
- 2026-06-05: Code-quality fixes (memoized context values, logout error logging, stable React keys).
- 2026-06-05: NEW FEATURES:
  - Surprise Me random picker (SurpriseMe.js) — open-now detection via hours parsing (cafeUtils.isOpenNow), spin/reveal dialog, Near-me/Any toggle, re-roll, visit CTA.
  - Featured Cafe (FeaturedCafe.js) — deterministic weekly rotation (cafeUtils.getWeeklyFeatured), blurb + stats + CTA banner.
  - Events page (/events) — coming-soon with teaser cards + email capture. Backend POST /api/events/notify (upsert event_signups, email validated).

## Backlog / Next
- P1: Validate review cafe_id against known cafes; min/max review length.
- P2: Per-cafe rating aggregation (avg + count) on cards/detail from community reviews.
- P2: Monetization — paid "Featured Spot" management for cafes; real events CMS when launched.
- P2: User-uploaded custom cafe images (user will provide later).
