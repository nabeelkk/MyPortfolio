# Content guide

Every word, number, link and image path on the site comes from `src/data/`. You never need to touch a component to update content.

After any edit, run `npm run build` to check it, then commit.

---

## Profile — `src/data/profile.ts`

Name, title, location, availability, email, phone, WhatsApp, LinkedIn, GitHub, the summary paragraph, the statement that lights up on scroll, and the **stats**:

```ts
stats: [
  { value: 4, suffix: "+", label: "Years of experience" },
  …
]
```

The counters animate from 0 to `value`.

To replace the **CV**, overwrite `public/Muhammed_Nabeel_KK_Resume.pdf` and keep the same file name.

To replace the **photo**, overwrite `public/images/nabeel.webp`. If the dimensions change, update `photo.width` and `photo.height`.

## Experience — `src/data/experience.ts`

Roles are listed newest first. Each role has a `title`, `company`, `location`, optional `period`, `points` and an optional `stack`.

- **Dates:** set `period: "Mar 2025 – Present"`. **Leave `period` out entirely to hide it**; the UI never shows a placeholder.
- `projects: ["architecture-erp", …]` adds the expandable "projects built in this role" list. Use slugs from `projects.ts` that have a case study.

## Projects — `src/data/projects.ts`

### Featured case studies (`featuredProjects`)

These render in order as the large stacked cards, and each one gets a page at `/projects/<slug>/`.

| Field | Notes |
| --- | --- |
| `slug` | URL and folder name, e.g. `remora` |
| `type` | Neutral label: "Enterprise ERP", "SaaS / EdTech", "Mobile App", "Native Android", "E-commerce", "Real-time", "Client Website", "Personal Project" |
| `status` | `"live"` or `"in-development"` (shows the badge) |
| `links` | `{ live?, github? }`. Omit a link to hide its button. |
| `cover` | Main landscape image (in the browser frame) |
| `phone` | Optional portrait single-screen image (in the phone frame) |
| `secondary` | Optional multi-screen sheet (in a glass panel) |
| `concept: true` | On any image, adds the "Design concept" caption |
| `employer` | Shows "Built during my role at …" on the case-study page only |
| `caseStudy` | `overview`, `problem`, `built[]`, `decisions[]`, optional `builtSoFar[]` / `planned[]` / `statusNote`, and `architecture` for the diagram |

The **architecture diagram** is generated from:

```ts
architecture: {
  clients: ["Next.js web ERP", "Client portal"],
  api: "NestJS API · JWT + permission guards",
  services: ["PostgreSQL · Prisma", "Object storage"],
}
```

Keep the labels short (about 36 characters at most).

### Live client websites (`clientSites`)

Each site has a `name`, `description`, `url`, `cover` and an optional tall `full` screenshot (1200 × 4500), which auto-scrolls inside the frame on hover.

### More work (`moreWork`)

The filterable grid shows the featured projects first, then these. Set `categories` to any of `"full-stack" | "frontend" | "mobile"`. Filters with no items still show, with a count of 0.

## Skills — `src/data/skills.ts`

`skillGroups` holds the bento tiles. `orbTech` lists the logos on the 3D orb and the marquee. To add a logo:

1. Add the name to `orbTech`.
2. Map it to an icon in `src/components/ui/TechIcon.tsx` (any `react-icons` icon).

## Education — `src/data/education.ts`

Each entry has a `degree`, `school`, optional `location` and `period`.

---

## Images

- Put images in `public/projects/<slug>/`, preferably as WebP. Always set `width` and `height` to the file's real pixel size.
- **Missing or broken images never show as broken.** The site renders a generated cover (grid, name, stack chips, cobalt glow) instead.
- To capture screenshots of live sites, edit `TARGETS` in `scripts/capture-screenshots.ts`, then run `npm run screenshots`. You can also pass slugs: `npm run screenshots -- blend-clothing`.
  - `cover` = 1440×900, `mobile` = 390×844 @2x, `full` = full page cropped to 1200×4500.

---

## Hero video → scroll frames

The hero scrubs a sequence of WebP frames on a `<canvas>` as you scroll. **Until you add a video, it shows the 3D fallback scene** (a React Three Fiber "glass-circuit city").

### Use your own video

1. Export a 16:9 clip of 8–10 seconds at 1080p or higher, with no text, people or logos. Save it as `media/source/hero.mp4`.
   You can add a 9:16 version as `media/source/hero-mobile.mp4`. Without one, the desktop clip is centre-cropped.
2. Run:

   ```bash
   npm run frames
   # or: bash scripts/extract-frames.sh path/to/desktop.mp4 path/to/mobile.mp4
   ```

   This:
   - extracts about 135 desktop frames (1920 px wide) and about 90 mobile frames (900 px wide) as WebP;
   - lowers the quality or frame count automatically until the sets fit within **6 MB desktop / 3 MB mobile**;
   - writes `public/sequence/poster.webp`, `poster-mobile.webp` and `first.webp`;
   - sets `"enabled": true` in `src/data/sequence.json`, which switches the hero from the 3D scene to the frame sequence.

   Tuning: `DESKTOP_FRAMES=150 MOBILE_FRAMES=80 DESKTOP_Q=65 npm run frames`.

   The script needs `ffmpeg` (`brew install ffmpeg`). If your ffmpeg has no WebP encoder, it uses `cwebp` instead (`brew install webp`).
3. `npm run build`, check the result, then commit `public/sequence/**` and `src/data/sequence.json`.
   **Never commit the raw video.** `media/source` is gitignored.

To go back to the 3D scene, set `"enabled": false` in `src/data/sequence.json`, delete `public/sequence/desktop` and `public/sequence/mobile`, then run `npm run build`. Re-render its poster with `npm run poster -- http://127.0.0.1:3000` while `npm start` is running.

### Hero text chapters

The chapter copy is in `src/components/hero/Hero.tsx`. Its scroll ranges (0–20%, 25–45%, 50–70%, 75–100%) are in `src/components/hero/HeroController.tsx`.

---

## Contact form

The form uses EmailJS. Your template must use the variables `{{from_name}}`, `{{email_id}}` and `{{message}}`. The keys are read from `NEXT_PUBLIC_EMAILJS_*` (see `.env.example`).
