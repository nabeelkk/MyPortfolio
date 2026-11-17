"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { orbTech } from "@/data/skills";
import { techIcons } from "@/components/ui/TechIcon";

const RADIUS = 2.1;
/** Drag inertia state, mutated by pointer handlers and the frame loop (single orb per page). */
const drag = { vx: 0, vy: 0, down: false, x: 0, y: 0 };
const world = new THREE.Vector3();

/** Even points on a sphere. */
function fibonacciSphere(n: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(RADIUS));
  }
  return pts;
}

/** Rasterise the rendered SVG icons into textures. */
async function svgToTexture(svg: SVGSVGElement): Promise<THREE.Texture> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", "128");
  clone.setAttribute("height", "128");
  clone.setAttribute("fill", "#f2f3f5");
  clone.style.color = "#f2f3f5";
  const markup = new XMLSerializer().serializeToString(clone).replaceAll("currentColor", "#f2f3f5");
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = 160;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 16, 16, 128, 128);
  URL.revokeObjectURL(url);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Orb({ textures }: { textures: THREE.Texture[] }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(textures.length), [textures.length]);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const wire = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(RADIUS * 0.96, 2)), []);

  useFrame((_, delta) => {
    const g = group.current;
    const d = drag;
    if (!g) return;
    if (!d.down) {
      d.vx *= 0.95;
      d.vy *= 0.95;
    }
    g.rotation.y += d.vx + delta * 0.12;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy, -0.9, 0.9);
    // fade icons on the far side
    sprites.current.forEach((s) => {
      if (!s) return;
      s.getWorldPosition(world);
      const front = THREE.MathUtils.smoothstep(world.z, -RADIUS, RADIUS);
      (s.material as THREE.SpriteMaterial).opacity = 0.15 + front * 0.85;
      const sc = 0.42 + front * 0.18;
      s.scale.set(sc, sc, 1);
    });
  });

  return (
    <group ref={group}>
      <lineSegments geometry={wire}>
        <lineBasicMaterial color="#3d6bff" transparent opacity={0.16} />
      </lineSegments>
      {points.map((p, i) => (
        <sprite
          key={i}
          position={p}
          ref={(el) => {
            sprites.current[i] = el;
          }}
        >
          <spriteMaterial map={textures[i]} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

export default function SkillsOrb() {
  const icons = useRef<HTMLDivElement>(null);
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);

  useEffect(() => {
    const svgs = icons.current?.querySelectorAll("svg");
    if (!svgs) return;
    let alive = true;
    Promise.all(Array.from(svgs).map((s) => svgToTexture(s))).then((t) => {
      if (alive) setTextures(t);
    });
    return () => {
      alive = false;
    };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    drag.down = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag;
    if (!d.down) return;
    d.vx = (e.clientX - d.x) * 0.004;
    d.vy = (e.clientY - d.y) * 0.004;
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const onUp = () => {
    drag.down = false;
  };

  return (
    <div
      className="absolute inset-0 touch-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label={`Interactive sphere of technologies: ${orbTech.join(", ")}`}
    >
      <div ref={icons} className="hidden" aria-hidden="true">
        {orbTech.map((t) => {
          const Icon = techIcons[t];
          return <Icon key={t} />;
        })}
      </div>
      {textures && (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Orb textures={textures} />
        </Canvas>
      )}
    </div>
  );
}
