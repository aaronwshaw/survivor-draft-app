# Survivor Draft App (Next.js Migration)

This repository has been migrated from a static app to a Next.js app shell.

## Current Status
- Next.js App Router scaffold is in place.
- Existing UI/features were moved into the Next.js page and still run client-side.
- Prisma + NextAuth skeleton is set up for the database-backed phase.
- Legacy static version is preserved in `legacy/`.

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Set environment variables in `.env`:
```env
DATABASE_URL=...
DIRECT_URL=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```
3. Generate Prisma client:
```bash
npx prisma generate
```
4. Run dev server:
```bash
npm run dev
```
5. Open `http://localhost:3000`.

## Database Next Steps
1. Set real Neon `DATABASE_URL` and `DIRECT_URL`.
2. Run migration:
```bash
npx prisma migrate dev --name init
```
3. Open Prisma Studio:
```bash
npx prisma studio
```

## Key Paths
- App page: `src/app/page.tsx`
- Legacy script used during migration: `public/legacy-app.js`
- Global styles: `src/app/globals.css`
- Prisma schema: `prisma/schema.prisma`
- NextAuth route: `src/app/api/auth/[...nextauth]/route.ts`
