# glowing-garbanzo

Foundation for the personal video playback website specified in the project Master Prompt.

## Technology

- Next.js 16.x App Router (Turbopack is the default bundler)
- Node.js 24.x
- React 19.2+
- TypeScript
- Tailwind CSS 3
- Zod
- Lucide React (available for UI icons)

## Local setup

1. Use Node.js 24.x.
2. Install dependencies with `npm install` (this will create the npm lockfile).
3. Copy `.env.example` to `.env.local` and fill in only values you have configured. Never commit `.env.local` or secrets.
4. Start the development server with `npm run dev`.

## Validation

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run these checks after installing dependencies. Automated checks have not yet been run in the current GitHub-only environment.

## Data and current scope

- The JSON files currently contain **synthetic sample data for scaffolding only**. Sample IDs, embed URLs, and metadata values are not owner-provided production data; the sample embed URLs have not been verified to resolve to playable videos.
- `data/videos.json` records contain only `id` and `embedUrl`. The sample IDs do not define or constrain the final ID format.
- `data/simulation-pool.json` lists sample combinations not currently assigned in `data/video-display-metadata.json`; all values are illustrative, not actual provider statistics.
- The `/v/[id]` route returns the not-found page for IDs that do not match a record.
- Provider playback, CAPTCHA, ads, tracking, final branding, social preview assets, and the permanent metadata assignment script are not implemented in this foundation stage.

## Environment variables

`.env.example` contains variable names and empty placeholders only. Set actual values in local environment configuration or Vercel settings; do not commit secrets.

## Deployment

The project targets Vercel with the Next.js framework preset and Node.js 24.x. Configure required environment variables in Vercel when the corresponding integration is implemented. No deployment configuration or deployment has been added in this stage.
