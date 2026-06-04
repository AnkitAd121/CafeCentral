# CafeCentral — PRD

## Original Problem Statement
A curated cafe discovery guide for Guwahati, Assam — warm, editorial, magazine-like web app. Spec asked for Vite + TanStack + Supabase; adapted (user-approved) to the platform stack: React (CRA) + FastAPI + MongoDB, with Emergent-managed Google OAuth and DB-persisted reviews.

## Architecture
- Frontend: React 19 (CRA/craco), react-router-dom 7, Tailwind v3, shadcn/ui, sonner, lucide-react. Fonts: Fraunces (headings) + Inter (body).
- Backend: FastAPI + Motor (MongoDB). All routes under /api.
- Auth: Emergent Google OAuth. session_id exchanged at POST /api/auth/session -> session_token httpOnly cookie (7d). get_current_user checks cookie then Bearer.
- Data: 6 cafes hardcoded in /app/frontend/src/data/cafes.js. Reviews + saved_cafes persisted in MongoDB.

## User Personas
- The remote worker (needs wifi/outlets/quiet), the aesthete (golden hour/views), the rainy-day reader (monsoon mode), the community reviewer.

## Core Requirements (static)
- Pages: Home (day/night ambiance toggle, Golden Hour + Monsoon Mode sections), Directory (search + filter chips + floating hover info card), Cafe Detail (gallery, must-try, ambiance, sticky sidebar, map iframe, save toggle), Login (Google), Dashboard ("Your Vault", protected), Community (review form + persisted feed).
- Warm editorial design system with custom HSL tokens, dark "night" mode, fade-up animations.

## Implemented (2026-06-04)
- Full 6-page app, navbar with mobile menu + theme toggle, all routes.
- Emergent Google Auth (session exchange, /auth/me, logout, protected dashboard).
- Saved cafes CRUD (idempotent) + DB-persisted community reviews (4 seeded mocks).
- Verified: testing agent 100% backend (9 pytest) + 100% frontend.

## Backlog / Next
- P1: Validate review cafe_id against known cafes; min/max review length.
- P2: Reviews aggregation per cafe (avg rating, count) on detail page.
- P2: Share buttons for cafe detail; star-glyph contrast polish on review cards.
- P2: User-uploaded custom cafe images (user said they'll add images later).
