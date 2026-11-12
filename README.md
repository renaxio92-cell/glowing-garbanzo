# glowing-garbanzo

A Next.js video-page scaffold with sample-only records. Production readiness still requires approved provider/domain configuration and successful local or CI checks.

## Stack and setup

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Zod
- Node.js 24+

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set only approved configuration in `.env.local`; never commit credentials.

## Validation

Run `npm run typecheck`, `npm run lint`, and `npm run build`. These checks have not been executed in the GitHub-only environment used to prepare this branch.

## Required configuration before production

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin. SEO canonical URLs, sitemap URLs, and robots sitemap links remain absent until set.
- `RECAPTCHA_ENABLED=true`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, and `RECAPTCHA_SECRET_KEY`: all are required for playback. The route fails closed if CAPTCHA is disabled or misconfigured. A server-signed, short-lived HttpOnly session cookie is required before the iframe is rendered.
- Ads/tracking remain disabled by default. Vendor scripts are not injected from arbitrary environment-provided HTML. Add a reviewed provider integration and CSP allowlist before enabling these services.

## Sample data and scope

The JSON data files contain synthetic sample entries only; the `vski.cc` sample URLs have not been verified to resolve. Metadata values are illustrative, not provider statistics. Replace these with owner-approved records before production use.

Like is browser-local only; Share uses the native share API or clipboard where available. No backend likes, downloadable media, verified provider integration, ad network, or analytics tracker is included.

## Deployment

No merge or deployment has been performed. Production readiness is unconfirmed until the real provider/domain configuration is supplied, checks pass, and browser smoke tests are completed.
