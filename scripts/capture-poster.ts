/**
 * Render the 3D fallback hero and save it as the instant-paint poster.
 *
 *   npm run build && npx serve@14 out -l 4321   (or any static server)
 *   npm run poster -- http://127.0.0.1:4321
 *
 * Writes public/sequence/poster.webp (1920×1080) and poster-mobile.webp (720×1560).
 * Only used for the 3D fallback; scripts/extract-frames.sh writes posters from the video instead.
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:4321";
const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "sequence");
const TMP = join(ROOT, "media", "tmp-poster");
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const shots = [
  { name: "poster", viewport: { width: 1920, height: 1080 }, scale: 1, width: 1920, q: 74 },
  { name: "poster-mobile", viewport: { width: 450, height: 975 }, scale: 2, width: 720, q: 50 },
];
for (const s of shots) {
  const page = await browser.newPage({ viewport: s.viewport, deviceScaleFactor: s.scale });
  page.on("console", (m) => m.type() === "error" && console.warn("console:", m.text()));
  await page.goto(base + "/", { waitUntil: "load" });
  await page.addStyleTag({
    content: `.hero-chapters,.hero-stage [aria-hidden="true"].z-10,.hero-stage .z-30,header,.grain,.hero-poster,.mix-blend-difference{display:none!important}`,
  });
  // The scene loads on first interaction once the page is idle — wait, then nudge the pointer.
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointermove", { clientX: 1, clientY: 1 })));
  await page.mouse.move(s.viewport.width / 2, s.viewport.height / 2);
  await page.waitForSelector(".hero-stage canvas", { timeout: 60_000 });
  await page.waitForTimeout(6000);
  const png = join(TMP, `${s.name}.png`);
  await page.locator(".hero-stage").screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", String(s.q), "-resize", String(s.width), "0", png, "-o", join(OUT, `${s.name}.webp`)]);
  console.log(`✓ ${s.name}.webp`);
  await page.close();
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
