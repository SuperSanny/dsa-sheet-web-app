# DSA Sheet

DSA Sheet is a full-stack practice tracker implemented as a Next.js (App Router) application with server-side API routes and MongoDB for persistence. It provides topic-based problem lists, per-user progress tracking, and basic JWT authentication.

## Tech stack

Frontend & backend (same repo): Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Axios, React Hook Form, Mongoose, JWT

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Create environment variables (example below)

3. Run development server

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Environment variables

Create a `.env.local` file in the project root with the values you need. The app expects at least:

- `MONGODB_URI` (or `MONGO_URI`) — MongoDB connection string
- `JWT_SECRET` — secret used to sign JWT tokens
- `NEXT_PUBLIC_API_URL` — (optional) API base URL for client-side calls. For local dev with Next API routes you can set this to `http://localhost:3000/api` or omit it and the client will use the configured default.

Example `.env.local`:

```
MONGODB_URI=mongodb://localhost:27017/dsa-sheet
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Notes:

- The server-side API routes live under `src/app/api/*` and use the same Next.js process.
- The app's MongoDB connection logic reads `MONGODB_URI` (see [src/lib/mongoose.ts](src/lib/mongoose.ts#L1)).

## Scripts

- `npm run dev` — start Next dev server (port 3000)
- `npm run build` — build for production
- `npm start` — start Next in production mode
- `npm run lint` — run linter

## Project layout (important folders)

```
src/
    app/          # Next.js App Router pages and API routes
    components/   # UI components (dashboard, topic cards, etc.)
    context/      # Auth context
    lib/          # helpers (mongoose, auth helpers, axios)
    models/       # Mongoose models
    services/     # client-side API wrapper functions
    types/        # shared TS types
```

## API (overview)

The project exposes the following Next API routes under `/api` (see `src/app/api`):

- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — login and receive JWT
- `GET /api/auth/me` — get current user (requires Bearer token)
- `GET /api/topics` — list topics
- `GET /api/topics/[slug]` — topic + problems
- `GET /api/progress` — user's completed problem IDs
- `GET /api/progress/summary` — completed counts grouped by topic
- `PUT /api/progress/[problemId]` — toggle completion for a problem

## Notes & tips

- The client stores the JWT token in `localStorage` and attaches it to requests (see `src/lib/axios.ts`).
- For production, consider using httpOnly cookies for tokens and tightening CORS and CSP settings.
- There is no separate Express server in this repository — backend functionality is implemented with Next.js API routes.

If you'd like, I can also:

- add a minimal `.env.local.example` file, or
- add a small script to seed demo topics/problems.
