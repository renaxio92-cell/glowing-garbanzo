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
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and fill in only values you have configured. Never commit `.env.local` or secrets.
4. Start the development server with `npm run dev`.

## Validation

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Run these checks after installing dependencies. Automated checks have not yet been run in the current GitHub-only environment.

## Data and current scope

- `data/videos.json` contains a small synthetic sample list for route and layout scaffolding only.
- `data/simulation-pool.json` contains sample metadata values that are not provider statistics.
- `data/video-display-metadata.json` stores the assigned metadata for the current sample records.
- These example values are for implementation scaffolding and must be replaced by owner-approved production data before final production use.
- The `/v/[id]` route displays a sample layout and resolves valid IDs from the sample list.
- Provider playback, CAPTCHA, ads, tracking, final branding, and social preview assets are not implemented in this foundation stage.

## Metadata assignment script

The project includes a data assignment utility at:

`./scripts/assign-video-metadata.ts`

The script does the following:

- reads `data/videos.json`
- reads `data/simulation-pool.json`
- checks which `videos.json` records are missing metadata
- assigns a unique metadata combination without reusing the same complete combination
- writes the result to `data/video-display-metadata.json`
- removes each assigned combination from the remaining pool
- preserves existing assignments so repeated runs do not overwrite prior assignments

This is intended to support the Master Prompt requirement for permanent metadata assignment without replacement.

## Environment variables

`.env.example` contains variable names and empty placeholders only. Set actual values in local environment configuration or Vercel settings; do not commit secrets.

## Deployment

The project targets Vercel with the Next.js framework preset and Node.js 24.x. Configure required environment variables in Vercel when the corresponding integration is implemented. No deployment configuration or deployment has been added in this stage.
