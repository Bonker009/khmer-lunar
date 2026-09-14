<div align="center">

# ប្រតិទិនចន្ទគតិ · Khmer Lunar Calendar

A fast, accurate Khmer lunar calendar (ចន្ទគតិ / Chhankitek) — a website, a free JSON API, and a dependency-free TypeScript engine.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tested with Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[Features](#features) · [Getting started](#getting-started) · [API](#rest-api) · [Contributing](#contributing)

</div>

---

## Features

- **Gregorian ⇄ Khmer lunar conversion** for any date from 1900 to 2100, including Buddhist Era (ពុទ្ធសករាជ), animal year and sak.
- **Monthly calendar** with lunar day, moon phase and Buddhist holy days (ថ្ងៃសីល) on every cell.
- **Khmer New Year (មហាសង្ក្រាន្ត)** — date and exact arrival time, calculated astronomically.
- **Public holidays and observances** in Cambodia, including lunar-based festivals such as Pchum Ben, Visak Bochea and the Water Festival.
- **Day tools** — count days between dates (with weekends/holidays excluded), add or subtract days, and countdowns to upcoming events.
- **Bilingual** — Khmer (default) and English, with Khmer numerals.
- **Free public JSON API** with CORS enabled and CDN caching.
- **SEO-ready** — sitemap, `hreflang`, structured data and generated Open Graph images.

## Tech stack

| Area       | Tools                                                      |
| ---------- | ---------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router), React 19    |
| Language   | TypeScript                                                 |
| Styling    | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com), Base UI |
| Testing    | [Vitest](https://vitest.dev)                               |
| Icons      | lucide-react                                               |

## Getting started

### Prerequisites

- Node.js **20.9** or newer
- npm (or pnpm / yarn / bun)

### Install and run

```bash
git clone https://github.com/Bonker009/khmer-lunar.git
cd khmer-lunar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Add `?lang=en` to any page for English.

### Scripts

| Command            | Description                     |
| ------------------ | ------------------------------- |
| `npm run dev`      | Start the development server    |
| `npm run build`    | Build for production            |
| `npm run start`    | Serve the production build      |
| `npm run lint`     | Run ESLint                      |
| `npx vitest run`   | Run the calendar engine tests   |

### Environment variables

All variables are optional. To set them, copy the example file:

```bash
cp .env.example .env.local
```

| Variable                   | Description                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Canonical site origin used for metadata, sitemap and structured data (e.g. `https://khmerlunar.com`). Falls back to the Vercel production URL, then `http://localhost:3000`. |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification token.                                   |

## REST API

Base path: `/api/v1`. All endpoints are `GET`, return JSON, allow cross-origin requests, and accept an optional `lang=km|en` parameter for text fields. Interactive documentation with a playground is available at [`/docs`](http://localhost:3000/docs).

| Endpoint                   | Description                                         | Required params                  |
| -------------------------- | --------------------------------------------------- | -------------------------------- |
| `/api/v1/today`            | Today's lunar date (Phnom Penh time)                | —                                |
| `/api/v1/convert`          | Gregorian → Khmer lunar                             | `date` (YYYY-MM-DD)              |
| `/api/v1/convert/reverse`  | Khmer lunar → Gregorian                             | `be`, `month` (0–13), `day` (1–15), `phase` (`kert`/`roech`) |
| `/api/v1/calendar`         | Month grid with lunar info for every day            | `year`, `month` (1–12); optional `weekStart` |
| `/api/v1/count`            | Days between two dates                              | `from`, `to`; optional `exclude`, `weekend`, `includeEnd` |
| `/api/v1/add`              | Add or subtract days from a date                    | `date`, `days`                   |
| `/api/v1/countdown`        | Days until upcoming festivals and moon phases       | optional `date`                  |
| `/api/v1/holidays`         | Public holidays and observances for a year          | `year`; optional `type`          |
| `/api/v1/holy-days`        | Buddhist holy days (8 & 15 waxing, 8 waning, last day) | `year`; optional `month`      |
| `/api/v1/new-year`         | Khmer New Year date and exact arrival time          | `year`                           |
| `/api/v1/year`             | Astronomical values and leap info for a year        | `year`                           |

Years must be between **1900 and 2100**.

### Example

```bash
curl "http://localhost:3000/api/v1/convert?date=2026-04-14&lang=en"
```

Successful responses are wrapped in `data` and `meta`:

```json
{ "data": { "...": "..." }, "meta": { "version": "v1" } }
```

Errors return an HTTP status and a machine-readable code:

```json
{ "error": { "code": "invalid_parameter", "message": "..." } }
```

## Accuracy

Conversions follow the traditional Chhankitek rules (aharkun, kromthupul, avoman, bodithey) and are tested against dates from published Cambodian calendars — see [`lib/khmer/__tests__/engine.test.ts`](lib/khmer/__tests__/engine.test.ts).

Holiday lists are a reference only. The Royal Government of Cambodia may change public holidays each year, so check official announcements for legal or payroll purposes.

## Contributing

Contributions are welcome — bug reports, date corrections, translations and code.

1. Fork the repository and create a branch: `git checkout -b feat/my-change`
2. Make your changes. If you touch `lib/khmer`, add or update tests.
3. Make sure these pass:
   ```bash
   npm run lint
   npx vitest run
   npm run build
   ```
4. Commit with a clear message and open a pull request describing what changed and why.

**Reporting a wrong date?** Please [open an issue](https://github.com/Bonker009/khmer-lunar/issues) with the Gregorian date, the expected lunar date, and a source (for example, a printed Cambodian calendar).

## Acknowledgements

- [Dangrek](https://fonts.google.com/specimen/Dangrek) font, licensed under the [SIL Open Font License 1.1](assets/fonts/OFL.txt).
- [shadcn/ui](https://ui.shadcn.com) and [lucide](https://lucide.dev) for UI components and icons.

## License

[MIT](LICENSE) © 2026 Penh Seyha. The bundled Dangrek font is licensed separately under the SIL Open Font License 1.1.
