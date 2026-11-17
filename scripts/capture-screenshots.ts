/**
 * Capture project screenshots with Playwright and convert them to WebP.
 *
 *   npm run screenshots                 # capture everything in TARGETS
 *   npm run screenshots -- blend-clothing   # capture one slug
 *
 * Outputs to public/projects/<slug>/{cover,mobile,full}.webp.
 * Requires `cwebp` (brew install webp). Sites that fail or render blank are skipped —
 * the UI falls back to a generated cover for missing images.
 */
import { chromium, type Browser } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

type Shot = "cover" | "mobile" | "full";
interface Target {
  slug: string;
  url: string;
  shots: Shot[];
}

const TARGETS: Target[] = [
  { slug: "blend-clothing", url: "https://blendfashion.vercel.app/", shots: ["cover", "mobile"] },
  { slug: "3d-viewer", url: "https://3-d-viewer-website.vercel.app/", shots: ["cover"] },
  { slug: "weathernow", url: "https://nabeelkk.github.io/Weather-App/", shots: ["cover"] },
  { slug: "pinet-chatbot", url: "https://chatbotapp-nu.vercel.app/", shots: ["cover"] },
  { slug: "coredotr", url: "https://coredotr.in/", shots: ["full"] },
];

const ROOT = join(import.meta.dirname, "..");
const TMP = join(ROOT, "media", "tmp-shots");

async function capture(browser: Browser, t: Target, shot: Shot) {
  const mobile = shot === "mobile";
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  try {
    const res = await page.goto(t.url, { waitUntil: "networkidle", timeout: 45_000 });
    if (!res || res.status() >= 400) throw new Error(`HTTP ${res?.status()}`);
    await page.waitForTimeout(2500);
    if (shot === "full") {
      // Scroll through once so lazy content and scroll-reveals render.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
    }
    const png = join(TMP, `${t.slug}-${shot}.png`);
    if (shot === "full") {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.screenshot({ path: png, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: Math.min(h, 5400) } });
    } else {
      await page.screenshot({ path: png });
    }
    if (statSync(png).size < 15_000) throw new Error("screenshot looks blank");
    const outDir = join(ROOT, "public", "projects", t.slug);
    mkdirSync(outDir, { recursive: true });
    const out = join(outDir, `${shot}.webp`);
    const resize = shot === "full" ? ["-resize", "1200", "0"] : [];
    execFileSync("cwebp", ["-quiet", "-q", "72", ...resize, png, "-o", out]);
    console.log(`✓ ${t.slug} ${shot}`);
  } catch (err) {
    console.warn(`✗ ${t.slug} ${shot}: ${(err as Error).message}`);
  } finally {
    await ctx.close();
  }
}

const only = process.argv.slice(2);
mkdirSync(TMP, { recursive: true });
const browser = await chromium.launch();
for (const t of TARGETS.filter((x) => only.length === 0 || only.includes(x.slug))) {
  for (const shot of t.shots) await capture(browser, t, shot);
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
