# Muhammed Nabeel KK — Developer Portfolio

A cinematic, scroll-driven portfolio for job applications. It's a static Next.js site with a scroll-scrubbed hero, case-study pages and a working contact form.

## Stack

- **Next.js 16** (App Router, `output: "export"`), **TypeScript** (strict), **Tailwind CSS v4** with CSS-variable tokens
- **GSAP + ScrollTrigger** for the hero scroll timeline, and **Lenis** smooth scroll synced to the GSAP ticker
- **Framer Motion** (via `LazyMotion`) for reveals, layout animation and micro-interactions
- **React Three Fiber + drei** for the 3D fallback hero and the skills orb. Both are lazy-loaded.
- **EmailJS** for the contact form, **lucide-react** and **react-icons** for icons
- Fonts: Clash Display (self-hosted), Inter and Geist Mono (via `next/font`)

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Static export to `out/` |
| `npm start` | Serve `out/` locally (http://localhost:3000) |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run frames` | Turn `media/source/hero.mp4` into the scroll frame sequence (see CONTENT_GUIDE.md) |
| `npm run poster -- <url>` | Re-render the 3D hero poster from a running build |
| `npm run screenshots` | Capture project screenshots with Playwright |

## Run locally

```bash
npm install
cp .env.example .env.local   # EmailJS keys are already filled in
npm run dev
```

Node ≥ 20.9 is required.

## Deploy

### Vercel (recommended)

1. Push the repo to GitHub and import it in Vercel. No configuration is needed; Vercel detects Next.js and serves the static export.
2. In **Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` = `UJx8gJNpH7ooCb-9H`
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID` = `service_39u03hg`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` = `template_ajtete9`
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://nabeelkk.store`). This is used for canonical URLs, the sitemap and Open Graph.
3. Deploy. Add your custom domain under **Settings → Domains**.

### GitHub Pages (alternative)

`.github/workflows/pages.yml` builds and deploys on every push to `main`.

1. **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → Variables**: add the three `NEXT_PUBLIC_EMAILJS_*` values and `NEXT_PUBLIC_SITE_URL`.
3. With a custom domain (or a `<user>.github.io` repo), leave `BASE_PATH` unset. For a project site such as `https://<user>.github.io/nabeel-dev`, set the variable `BASE_PATH` to `/nabeel-dev`.

## Project structure

```
src/app/            layout, page, not-found, projects/[slug], sitemap, robots, opengraph-image, template (page wipe)
src/components/     layout/   Nav, Footer, SmoothScroll, Cursor, Grain, Clock, Providers
                    hero/     Hero (server markup), HeroController (scroll timeline), ScrollSequence (canvas)
                    sections/ About, Work, ClientSites, Experience, Skills, MoreWork, Education, Contact
                    case/     ArchitectureDiagram, Gallery (lightbox)
                    ui/       Button, MagneticButton, TiltCard, SplitText, Counter, BrowserFrame, PhoneFrame, StatusBadge, …
                    three/    FallbackHeroScene, SkillsOrb
src/data/           profile, experience, projects, skills, education, sequence.json
public/             sequence/, projects/, images/, Muhammed_Nabeel_KK_Resume.pdf
scripts/            extract-frames.sh, capture-screenshots.ts, capture-poster.ts
```

All content lives in `src/data`. See **CONTENT_GUIDE.md** for how to edit it.
