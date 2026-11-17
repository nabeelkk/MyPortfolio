#!/usr/bin/env bash
# Convert the hero video into scroll-scrub WebP frame sequences.
#
#   bash scripts/extract-frames.sh [desktop.mp4] [mobile.mp4]
#
# Defaults: media/source/hero.mp4 (16:9) and media/source/hero-mobile.mp4 (9:16).
# If no mobile video exists, the desktop video is centre-cropped to 9:16.
#
# Env overrides: DESKTOP_FRAMES (135), MOBILE_FRAMES (90), DESKTOP_Q (70), MOBILE_Q (62)
# Needs ffmpeg (brew install ffmpeg) and, if your ffmpeg lacks libwebp, cwebp (brew install webp).
#
# Output:
#   public/sequence/desktop/0001.webp …   (1920px wide)
#   public/sequence/mobile/0001.webp …    (900px wide)
#   public/sequence/poster.webp, poster-mobile.webp, first.webp
#   src/data/sequence.json  (enables the frame-sequence hero instead of the 3D fallback)
set -euo pipefail
cd "$(dirname "$0")/.."

command -v ffmpeg >/dev/null || { echo "ffmpeg not found — run: brew install ffmpeg"; exit 1; }
# Prefer ffmpeg's libwebp encoder; otherwise extract PNGs and encode with cwebp.
if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libwebp; then
  WEBP_MODE=ffmpeg
else
  command -v cwebp >/dev/null || { echo "Need ffmpeg with libwebp, or cwebp — run: brew install webp"; exit 1; }
  WEBP_MODE=cwebp
fi

SRC="${1:-media/source/hero.mp4}"
SRC_M="${2:-media/source/hero-mobile.mp4}"
DF="${DESKTOP_FRAMES:-135}"
MF="${MOBILE_FRAMES:-90}"
DQ="${DESKTOP_Q:-70}"
MQ="${MOBILE_Q:-62}"
DMAX=$((6 * 1024 * 1024))
MMAX=$((3 * 1024 * 1024))

[ -f "$SRC" ] || { echo "Missing $SRC"; exit 1; }

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
size() { du -sk "$1" | awk '{print $1 * 1024}'; }

extract() { # src outdir frames width quality [crop]
  local src="$1" out="$2" n="$3" w="$4" q="$5" crop="${6:-}"
  local d fps vf
  d=$(dur "$src")
  fps=$(awk -v n="$n" -v d="$d" 'BEGIN{printf "%.4f", n/d}')
  vf="fps=${fps}${crop:+,$crop},scale=${w}:-2:flags=lanczos"
  rm -rf "$out" && mkdir -p "$out"
  if [ "$WEBP_MODE" = ffmpeg ]; then
    ffmpeg -v error -i "$src" -vf "$vf" -frames:v "$n" -c:v libwebp -quality "$q" -compression_level 6 "$out/%04d.webp"
  else
    local tmp; tmp=$(mktemp -d)
    ffmpeg -v error -i "$src" -vf "$vf" -frames:v "$n" "$tmp/%04d.png"
    for f in "$tmp"/*.png; do
      cwebp -quiet -q "$q" -m 6 "$f" -o "$out/$(basename "${f%.png}").webp"
    done
    rm -rf "$tmp"
  fi
}

fit() { # src outdir frames width quality max crop
  local src="$1" out="$2" n="$3" w="$4" q="$5" max="$6" crop="${7:-}"
  while :; do
    extract "$src" "$out" "$n" "$w" "$q" "$crop"
    local s; s=$(size "$out")
    echo "  $out: $(ls "$out" | wc -l | tr -d ' ') frames, q=$q, $((s / 1024)) KB"
    [ "$s" -le "$max" ] && break
    if [ "$q" -gt 45 ]; then q=$((q - 8)); else n=$((n * 85 / 100)); fi
  done
}

echo "→ Desktop frames"
fit "$SRC" public/sequence/desktop "$DF" 1920 "$DQ" "$DMAX"

echo "→ Mobile frames"
if [ -f "$SRC_M" ]; then
  fit "$SRC_M" public/sequence/mobile "$MF" 900 "$MQ" "$MMAX"
else
  fit "$SRC" public/sequence/mobile "$MF" 900 "$MQ" "$MMAX" "crop=ih*9/16:ih"
fi

cp public/sequence/desktop/0001.webp public/sequence/first.webp
cp public/sequence/desktop/0001.webp public/sequence/poster.webp
cp public/sequence/mobile/0001.webp public/sequence/poster-mobile.webp

DC=$(ls public/sequence/desktop | wc -l | tr -d ' ')
MC=$(ls public/sequence/mobile | wc -l | tr -d ' ')
dims() { # print "W H" of a WebP file (reads the VP8/VP8L/VP8X header)
  if command -v webpinfo >/dev/null; then
    webpinfo "$1" | awk '/Width:/{w=$2} /Height:/{h=$2} END{print w, h}'
  else
    ffprobe -v error -show_entries stream=width,height -of csv=p=0:s=' ' "$1"
  fi
}
read -r DW DH < <(dims public/sequence/desktop/0001.webp)
read -r MW MH < <(dims public/sequence/mobile/0001.webp)

cat > src/data/sequence.json <<JSON
{
  "enabled": true,
  "desktop": { "count": $DC, "width": $DW, "height": $DH },
  "mobile": { "count": $MC, "width": $MW, "height": $MH }
}
JSON
echo "✓ Done. src/data/sequence.json updated — the hero now uses the frame sequence."
