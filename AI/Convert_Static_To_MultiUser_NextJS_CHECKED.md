# Convert Static Survivor Draft App -> Multi-User (Progress)

## 0) Target Architecture
- [x] Framework: Next.js (App Router)
- [x] Database: Neon Postgres (connected)
- [x] ORM: Prisma (installed/configured)
- [x] Auth: NextAuth.js (credentials flow wired)
- [ ] Deployment: Vercel + env vars

## 1) Pre-flight Checklist
- [x] Node/npm verified (`node v23.0.0`, `npm 10.9.0`)
- [x] Repo on GitHub (assumed from prior context)
- [x] Neon project confirmed in this repo config
- [x] Legacy static app preserved under `/legacy`
- [x] Replace static root with Next.js app

## 2) Create Next.js App in This Repo
- [x] Next.js app scaffolded with TS + ESLint + App Router + `src/`
- [x] `package.json` exists at repo root
- [x] Local production build succeeds (`npm run build`)

## 3) Move Existing Assets Into Next.js
- [x] `legacy/photos` copied to `public/photos`
- [x] `legacy/players.json` copied to `src/data/players.json`
- [x] `legacy/styles.css` moved to `src/app/globals.css`
- [x] Existing app logic moved to Next runtime via `public/legacy-app.js` + `src/app/page.tsx`
- [x] Photos load from `/photos/...` path

## 4) Prisma + Neon Setup
- [x] Installed `prisma` + `@prisma/client`
- [x] `npx prisma init` completed
- [x] Prisma schema created for:
  - User
  - League
  - Team
  - Membership (role + teamId)
  - DraftState (assignment + elimination JSON)
- [x] Added `DIRECT_URL` support to datasource
- [x] `npx prisma validate` passes
- [x] `npx prisma generate` passes
- [x] `npx prisma migrate dev --name init` (schema synced; no pending changes)
- [ ] `npx prisma studio` with real database

## 5) Auth (NextAuth) Setup
- [x] Installed `next-auth`
- [x] Added route: `src/app/api/auth/[...nextauth]/route.ts`
- [x] Added auth options: `src/lib/auth.ts`
- [x] Added Prisma client helper: `src/lib/prisma.ts`
- [x] Switched `/login` flow to NextAuth session
- [x] Server-side route protection using session checks (`/leagues`, `/league/[leagueId]`)

## 6) Required Pages
- [x] Existing UI migrated into Next root page (`src/app/page.tsx`)
- [x] Proper App Router pages split by path:
  - `/login`
  - `/leagues`
  - `/league/[leagueId]`
- [ ] Server-backed mutations for create/join/assign/reset
: `create/join` done; `assign/reset` still pending migration from legacy script.

## 7) Player Data Strategy
- [x] Option A in progress: keep players JSON in repo
- [ ] Option B (DB seed) not started

## 8) Deploy to Vercel
- [ ] Not started

## 9) Security & Reliability Must-Dos
- [x] `.env*` ignored by git
- [x] Permission logic exists in client migration script
- [ ] Move permission enforcement fully server-side with DB mutations
- [x] Add DB transactions for team-claim race conditions (join flow uses transaction + conditional claim)

## 10) Definition of Done
- [ ] Fully complete

## Immediate Next Actions
1. Migrate draft assignments/reset/elimination from `public/legacy-app.js` into server actions/API on `/league/[leagueId]`.
2. Enforce all role permissions server-side on those mutations.
3. Retire legacy hash-router page (`/`) once `/league/[leagueId]` reaches feature parity.
4. Run Prisma Studio to validate production-like data manually.
