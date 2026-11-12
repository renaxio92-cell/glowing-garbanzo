# glowing-garbanzo

A Next.js video-page scaffold with sample-only records. The project is not production-ready until the owner configures the real domain and provider credentials, verifies the embed provider, and runs all checks in a Node.js 24 environment.

## Stack
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Zod
- Node.js 24+

## Local setup
1. Install Node.js 24+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set approved values. Never commit secrets.
4. Run `npm run dev`.

## Checks
Run `npm run typecheck`, `npm run lint`, and `npm run build`. These checks have not been executed in the GitHub-only environment used to prepare this branch.

## Runtime configuration
- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin before enabling SEO URLs.
- Playback is fail-closed: set `RECAPTCHA_ENABLED=true` and provide a matching Google reCAPTCHA v2 site key and server-only secret key. Without both, the video page displays an unavailable message and does not render the player.
- The CAPTCHA verification endpoint issues a short-lived HttpOnly cookie only after provider verification; the server checks that cookie before rendering the iframe.
- Ads and tracking remain disabled by default. Do not paste untrusted third-party JavaScript into the app. Integrate approved vendor code via a reviewed, provider-specific implementation and appropriate CSP.

## Sample data and scope
`data/videos.json`, `data/simulation-pool.json`, and `data/video-display-metadata.json` contain synthetic scaffolding examples only. Embed URLs have not been verified to resolve. Metadata values are illustrative, not actual provider statistics. Replace them with owner-approved data before production.

Like is browser-local only. Share uses the native share API or clipboard where available. No backend likes, downloads, ad network, analytics tracker, or verified provider integration is included.

## Deployment status
No merge or deployment has been performed. Production readiness is unconfirmed until credentials/domain are supplied and typecheck, lint, build, and browser smoke tests pass.
