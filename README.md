# Jawara Video

A Next.js video player experience for Jawara Video. The player uses configured video records, presents an access verification gate, and keeps playback focused across desktop and mobile layouts.

## Stack and setup

- Next.js App Router, React, TypeScript, Tailwind CSS, Zod
- Node.js 24+

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set only approved configuration in `.env.local`; never commit credentials.

## Validation

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment. Also complete a browser smoke test on the deployed preview.

## Configuration

- `NEXT_PUBLIC_SITE_URL`: canonical site origin. The intended production domain is `https://jawvid.web.id`.
- `RECAPTCHA_ENABLED=true`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, and `RECAPTCHA_SECRET_KEY`: all are required for video playback. Register the actual production hostname in the CAPTCHA provider console. Keep the secret key server-side.
- `NEXT_PUBLIC_ADS_ENABLED` and `NEXT_PUBLIC_TRACKING_ENABLED` must remain `false`: ad and analytics providers are not integrated yet. Setting either to `true` does not connect a vendor and is not recommended.

## Video records

The JSON files under `data/` are intentionally left unchanged. Confirm that each configured embed URL is authorized, resolves correctly, and is suitable for your production use before enabling public playback.
