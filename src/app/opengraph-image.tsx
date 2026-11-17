import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/profile";

export const dynamic = "force-static";
export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const clash = await readFile(join(process.cwd(), "src/fonts/ClashDisplay-Bold.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "radial-gradient(80% 90% at 75% 110%, rgba(61,107,255,.55), #050506 60%)",
        color: "#f2f3f5",
        fontFamily: "Clash",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, color: "#8b8f98" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            border: "2px solid rgba(255,255,255,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f2f3f5",
            fontSize: 22,
          }}
        >
          NK
        </div>
        OPEN TO OPPORTUNITIES
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 116,
            lineHeight: 0.9,
            letterSpacing: -4,
            backgroundImage: "linear-gradient(100deg, #c9d3ff, #ffffff 45%, #9fb4ff)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Muhammed</span>
          <span>Nabeel KK</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 38, color: "#f2f3f5" }}>{profile.title}</div>
        <div style={{ marginTop: 12, fontSize: 26, color: "#8b8f98" }}>{profile.coreStack.join(" · ")}</div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Clash", data: clash, weight: 700, style: "normal" }] },
  );
}
