# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `cv-portfolio/` directory.

- `npm run dev` — start dev server (Next.js + Turbopack) on http://localhost:3000
- `npm run build` — production build (Turbopack)
- `npm start` — serve production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

There is no test runner configured.

## Architecture

Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS v4. The app is a bilingual (EN/ES) CV site with a lightweight admin panel. There is no database — content lives in JSON files on the filesystem and is read/written through API routes.

### Data flow

- Content source of truth: `data/cv-en.json` and `data/cv-es.json`, shaped by the interfaces in `types/cv.ts` (`CVData`: personalInfo, experience, projects, education, languages, skills).
- `app/api/cv/[lang]/route.ts` reads the JSON via `fs` on GET, and on POST validates a keyword against `data/admin-password.json` before overwriting the file with `fs.writeFileSync`. Because it writes to the working directory, **the admin save flow only works in environments with a writable filesystem (local dev, custom Node host) — it will not work on a read-only serverless deployment like Vercel.** Keep this in mind before suggesting deployment changes.
- `app/api/auth/route.ts` handles keyword verification for the admin UI.
- `app/page.tsx` is the public CV page with language switcher and a technology-filter feature (clicking a tech badge filters experiences).
- `app/admin/page.tsx` is the keyword-gated editor that POSTs back to `/api/cv/[lang]`.

### Auth model

Keyword-based, plaintext, stored in `data/admin-password.json` (default `admin123`). This is intentional for a personal site; do not invest in hardening it unless the user asks.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`). Global styles in `app/globals.css`. There is **no `tailwind.config.ts`** — theming is done inline/in CSS per v4 conventions, despite what the README says.

## Notes for edits

- When adding a new content section, update `types/cv.ts`, both `cv-en.json` and `cv-es.json` (keep them structurally parallel), and both the public page and admin editor.
- API route params are `Promise`-wrapped (Next 15): `{ params }: { params: Promise<{ lang: string }> }` — always `await params`.
