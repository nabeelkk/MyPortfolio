"use client";

/**
 * Fallback hero visual (used when no video frame sequence exists).
 * A dark obsidian space where glowing filaments assemble a city of glass circuitry.
 * Scroll progress (heroProgress) drives both the assembly and a slow camera dolly.
 */
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

/* ───────────────────────── deterministic random ───────────────────────── */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* ───────────────────────── shared GLSL ───────────────────────── */
const FOG = /* glsl */ `
  float fogFactor(float depth) { return smoothstep(uFogNear, uFogFar, depth); }
`;

const ASSEMBLY = /* glsl */ `
  float assemble(float delay) {
    float t = clamp((uAssemble - delay) / 0.16, 0.0, 1.0);
    return 1.0 - pow(1.0 - t, 3.0);
  }
`;

const towerVertex = /* glsl */ `
  uniform float uAssemble;
  attribute vec3 aOffset;
  attribute vec3 aScale;
  attribute float aDelay;
  attribute float aSeed;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying vec3 vLocal;
  varying float vDepth;
  varying float vSeed;
  varying float vHeight;
  varying float vA;
  ${ASSEMBLY}
  void main() {
    float a = assemble(aDelay);
    vA = a;
    vec3 s = aScale * vec3(1.0, max(a, 0.0001), 1.0);
    vec3 p = position * s + aOffset;
    p.y += (1.0 - a) * 0.8; // lock down into place
    vLocal = position;
    vHeight = aScale.y;
    vSeed = aSeed;
    vNormalW = normal;
    vWorld = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const towerFragment = /* glsl */ `
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uTime;
  uniform vec3 uCobalt;
  uniform vec3 uBg;
  varying vec3 vNormalW;
  varying vec3 vWorld;
  varying vec3 vLocal;
  varying float vDepth;
  varying float vSeed;
  varying float vHeight;
  varying float vA;
  uniform vec3 uFogColor;
  ${FOG}
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    if (vA < 0.02) discard;
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    // obsidian glass: near-black with a cool vertical sheen
    vec3 col = mix(vec3(0.010, 0.012, 0.020), vec3(0.03, 0.04, 0.075), vLocal.y);
    col += uCobalt * fres * 0.8;
    // top faces catch a soft white reflection
    col += vec3(0.6, 0.68, 1.0) * smoothstep(0.9, 1.0, n.y) * 0.08;
    // circuitry windows on the sides
    if (abs(n.y) < 0.5) {
      vec2 g = vec2((n.x != 0.0 ? vLocal.z : vLocal.x) * 6.0, vLocal.y * vHeight * 7.0);
      vec2 cell = floor(g);
      vec2 f = fract(g);
      float lit = step(0.86, hash(cell + vSeed * 31.0));
      float pulse = 0.55 + 0.45 * sin(uTime * 1.5 + hash(cell) * 6.28);
      float win = lit * step(0.25, f.x) * step(f.x, 0.75) * step(0.35, f.y) * step(f.y, 0.65);
      col += mix(uCobalt, vec3(0.85, 0.9, 1.0), hash(cell + 3.0)) * win * pulse * 0.9;
    }
    col = mix(col, uFogColor, fogFactor(vDepth));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const edgeVertex = /* glsl */ `
  uniform float uAssemble;
  attribute vec3 aOffset;
  attribute vec3 aScale;
  attribute float aDelay;
  varying float vDepth;
  varying float vY;
  varying float vFlash;
  varying float vA;
  ${ASSEMBLY}
  void main() {
    float a = assemble(aDelay);
    vec3 p = position * aScale * vec3(1.0, max(a, 0.0001), 1.0) + aOffset;
    p.y += (1.0 - a) * 0.8;
    float d = (uAssemble - aDelay - 0.16) * 14.0;
    vFlash = exp(-d * d) * 2.2;
    vA = a;
    vY = position.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const edgeFragment = /* glsl */ `
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uCobalt;
  varying float vDepth;
  varying float vY;
  varying float vFlash;
  varying float vA;
  ${FOG}
  void main() {
    vec3 col = mix(uCobalt, vec3(0.9, 0.93, 1.0), vY * 0.8);
    float i = (0.5 + vFlash) * vA * (1.0 - fogFactor(vDepth) * 0.85);
    gl_FragColor = vec4(col * i, 1.0);
  }
`;

const traceVertex = /* glsl */ `
  attribute float aDist;
  attribute float aSeed;
  attribute float aDelay;
  varying float vDist;
  varying float vSeed;
  varying float vDelay;
  varying float vDepth;
  void main() {
    vDist = aDist;
    vSeed = aSeed;
    vDelay = aDelay;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const traceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uCobalt;
  uniform float uBeam; // 1 = vertical filament mode
  varying float vDist;
  varying float vSeed;
  varying float vDelay;
  varying float vDepth;
  ${FOG}
  void main() {
    float reveal;
    float base;
    if (uBeam > 0.5) {
      // filaments: visible only around the moment their tower locks
      float d = (uAssemble - vDelay) / 0.16;
      reveal = smoothstep(-0.6, 0.0, d) * (1.0 - smoothstep(0.6, 1.4, d));
      base = 0.35;
    } else {
      reveal = smoothstep(vDelay - 0.05, vDelay + 0.1, uAssemble);
      base = 0.22;
    }
    float speed = uBeam > 0.5 ? 2.2 : 0.35;
    float ph = fract(vDist * (uBeam > 0.5 ? 0.18 : 0.07) - uTime * speed * (0.6 + vSeed) + vSeed * 7.0);
    float pulse = smoothstep(0.82, 1.0, ph) * 1.6;
    vec3 col = mix(uCobalt, vec3(0.92, 0.95, 1.0), pulse * 0.6);
    float i = (base + pulse) * reveal * (1.0 - fogFactor(vDepth));
    gl_FragColor = vec4(col * i, 1.0);
  }
`;

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  varying float vDepth;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    vec4 mv = viewMatrix * w;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const groundFragment = /* glsl */ `
  uniform float uFogNear;
  uniform float uFogFar;
  uniform vec3 uCobalt;
  uniform vec3 uBg;
  uniform float uAssemble;
  uniform vec3 uFogColor;
  varying vec3 vWorld;
  varying float vDepth;
  ${FOG}
  void main() {
    vec2 g = abs(fract(vWorld.xz * 0.5) - 0.5) / fwidth(vWorld.xz * 0.5);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float r = length(vWorld.xz);
    float glow = exp(-r * 0.11) * (0.35 + uAssemble * 0.45);
    vec3 col = vec3(0.012, 0.014, 0.02) + uCobalt * glow * 0.45 + vec3(0.5, 0.6, 1.0) * line * 0.06;
    col = mix(col, uFogColor, fogFactor(vDepth));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += mod(uTime * (0.05 + aSeed * 0.12) + aSeed * 20.0, 14.0) - 2.0;
    p.x += sin(uTime * 0.2 + aSeed * 12.0) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.2 + aSeed * 2.6) * uPixelRatio * (12.0 / -mv.z);
    vAlpha = (0.35 + 0.65 * abs(sin(uTime * 0.8 + aSeed * 40.0))) * smoothstep(45.0, 8.0, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uCobalt;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(mix(uCobalt, vec3(1.0), 0.5) * a, 1.0);
  }
`;

/* ───────────────────────── city generation ───────────────────────── */
interface City {
  towers: {
    offset: Float32Array;
    scale: Float32Array;
    delay: Float32Array;
    seed: Float32Array;
    count: number;
  };
  traces: { position: Float32Array; dist: Float32Array; seed: Float32Array; delay: Float32Array };
  beams: { position: Float32Array; dist: Float32Array; seed: Float32Array; delay: Float32Array };
}

function buildCity(grid: number): City {
  const rand = mulberry32(7);
  const half = grid / 2;
  const maxR = Math.hypot(half, half);
  const offset: number[] = [];
  const scale: number[] = [];
  const delay: number[] = [];
  const seed: number[] = [];
  const beamPos: number[] = [];
  const beamDist: number[] = [];
  const beamSeed: number[] = [];
  const beamDelay: number[] = [];

  const street = (i: number) => i % 5 === 2;

  for (let ix = 0; ix < grid; ix++) {
    for (let iz = 0; iz < grid; iz++) {
      if (street(ix) || street(iz)) continue;
      const x = ix - half + 0.5;
      const z = iz - half + 0.5;
      const r = Math.hypot(x, z) / maxR;
      if (rand() < 0.12 + r * 0.25) continue;
      const centre = Math.max(0, 1 - r * 1.25);
      const h = 0.25 + Math.pow(rand(), 2.2) * 2.4 * (0.3 + centre) + centre * centre * 3.2;
      const w = 0.42 + rand() * 0.4;
      const d = 0.42 + rand() * 0.4;
      const dl = r * 0.85 + rand() * 0.12;
      offset.push(x, 0, z);
      scale.push(w, h, d);
      delay.push(dl);
      seed.push(rand());
      if (rand() < 0.32) {
        // a filament dropping from the sky onto this tower
        const top = 14;
        beamPos.push(x, top, z, x, h, z);
        beamDist.push(0, top - h);
        const s = rand();
        beamSeed.push(s, s);
        beamDelay.push(dl, dl);
      }
    }
  }

  // circuit traces along streets + right-angle branches
  const tPos: number[] = [];
  const tDist: number[] = [];
  const tSeed: number[] = [];
  const tDelay: number[] = [];
  const addLine = (pts: [number, number][]) => {
    const s = rand();
    let dist = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      const seg = Math.hypot(bx - ax, bz - az);
      const ra = Math.hypot(ax, az) / maxR;
      const rb = Math.hypot(bx, bz) / maxR;
      tPos.push(ax, 0.01, az, bx, 0.01, bz);
      tDist.push(dist, dist + seg);
      tSeed.push(s, s);
      tDelay.push(ra * 0.85, rb * 0.85);
      dist += seg;
    }
  };
  for (let i = 0; i < grid; i++) {
    if (!street(i)) continue;
    const c = i - half + 0.5;
    for (const lane of [-0.18, 0.18]) {
      const pts: [number, number][] = [];
      for (let k = -half; k <= half; k += 1) pts.push([c + lane, k]);
      addLine(pts);
      const pts2: [number, number][] = [];
      for (let k = -half; k <= half; k += 1) pts2.push([k, c + lane]);
      addLine(pts2);
    }
  }
  for (let b = 0; b < grid * 2; b++) {
    let x = Math.round((rand() - 0.5) * grid) + 0.5;
    let z = Math.round((rand() - 0.5) * grid) + 0.5;
    const pts: [number, number][] = [[x, z]];
    for (let s = 0; s < 4; s++) {
      if (rand() < 0.5) x += Math.round((rand() - 0.5) * 6);
      else z += Math.round((rand() - 0.5) * 6);
      pts.push([x, z]);
    }
    addLine(pts);
  }

  return {
    towers: {
      offset: new Float32Array(offset),
      scale: new Float32Array(scale),
      delay: new Float32Array(delay),
      seed: new Float32Array(seed),
      count: delay.length,
    },
    traces: {
      position: new Float32Array(tPos),
      dist: new Float32Array(tDist),
      seed: new Float32Array(tSeed),
      delay: new Float32Array(tDelay),
    },
    beams: {
      position: new Float32Array(beamPos),
      dist: new Float32Array(beamDist),
      seed: new Float32Array(beamSeed),
      delay: new Float32Array(beamDelay),
    },
  };
}

function lineGeo(src: City["traces"]) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(src.position, 3));
  g.setAttribute("aDist", new THREE.BufferAttribute(src.dist, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(src.seed, 1));
  g.setAttribute("aDelay", new THREE.BufferAttribute(src.delay, 1));
  return g;
}

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uFogColor;
  varying vec3 vDir;
  void main() {
    float h = max(vDir.y, 0.0);
    vec3 col = mix(uFogColor, uBg, smoothstep(0.0, 0.45, h));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ───────────────────────── scene ───────────────────────── */
const COBALT = new THREE.Color("#3d6bff");
const BG = new THREE.Color("#050506");

/** Shared, frame-mutated uniforms (one hero instance per page). */
const uniforms = {
  uTime: { value: 0 },
  uAssemble: { value: 0 },
  uFogNear: { value: 16 },
  uFogFar: { value: 60 },
  uFogColor: { value: BG.clone().lerp(COBALT, 0.16) },
  uCobalt: { value: COBALT },
  uBg: { value: BG },
  uBeam: { value: 0 },
  uPixelRatio: { value: 1 },
};
const beamUniforms = { ...uniforms, uBeam: { value: 1 } };
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const frame = { smooth: 0, ready: false, px: 0, py: 0 };

/*
 * Materials are built once with the shared uniform objects. (JSX <shaderMaterial uniforms>
 * gets its own copy of the uniforms, which would stop frame-loop updates from reaching the GPU.)
 */
const additive = { blending: THREE.AdditiveBlending, depthWrite: false, transparent: true } as const;
const materials = {
  sky: new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
  }),
  ground: new THREE.ShaderMaterial({ vertexShader: groundVertex, fragmentShader: groundFragment, uniforms }),
  tower: new THREE.ShaderMaterial({ vertexShader: towerVertex, fragmentShader: towerFragment, uniforms }),
  edge: new THREE.ShaderMaterial({
    vertexShader: edgeVertex,
    fragmentShader: edgeFragment,
    uniforms,
    ...additive,
  }),
  trace: new THREE.ShaderMaterial({
    vertexShader: traceVertex,
    fragmentShader: traceFragment,
    uniforms,
    ...additive,
  }),
  beam: new THREE.ShaderMaterial({
    vertexShader: traceVertex,
    fragmentShader: traceFragment,
    uniforms: beamUniforms,
    ...additive,
  }),
  particle: new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms,
    ...additive,
  }),
};

const camPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 8.5, 21),
  new THREE.Vector3(7, 6.2, 15),
  new THREE.Vector3(6.5, 3.6, 9),
  new THREE.Vector3(2.4, 1.7, 4.2),
  new THREE.Vector3(0.35, 0.9, 1.6),
]);
const lookPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.2, 0),
  new THREE.Vector3(0, 1.4, 0),
  new THREE.Vector3(0, 1.8, 0),
  new THREE.Vector3(-0.6, 2.3, -1.5),
  new THREE.Vector3(-0.6, 2.8, -4),
]);

function CityScene({ grid, onReady }: { grid: number; onReady: () => void }) {
  const city = useMemo(() => buildCity(grid), [grid]);

  const towerGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = box.index;
    g.setAttribute("position", box.getAttribute("position"));
    g.setAttribute("normal", box.getAttribute("normal"));
    g.setAttribute("aOffset", new THREE.InstancedBufferAttribute(city.towers.offset, 3));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(city.towers.scale, 3));
    g.setAttribute("aDelay", new THREE.InstancedBufferAttribute(city.towers.delay, 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(city.towers.seed, 1));
    g.instanceCount = city.towers.count;
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), grid * 2);
    return g;
  }, [city, grid]);

  const edgeGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const edges = new THREE.EdgesGeometry(box);
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute("position", edges.getAttribute("position"));
    g.setAttribute("aOffset", new THREE.InstancedBufferAttribute(city.towers.offset, 3));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(city.towers.scale, 3));
    g.setAttribute("aDelay", new THREE.InstancedBufferAttribute(city.towers.delay, 1));
    g.instanceCount = city.towers.count;
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), grid * 2);
    return g;
  }, [city, grid]);

  const traceGeo = useMemo(() => lineGeo(city.traces), [city]);
  const beamGeo = useMemo(() => lineGeo(city.beams), [city]);

  const particleGeo = useMemo(() => {
    const rand = mulberry32(42);
    const n = grid > 20 ? 900 : 450;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rand() - 0.5) * 50;
      pos[i * 3 + 1] = rand() * 2;
      pos[i * 3 + 2] = (rand() - 0.5) * 50;
      seed[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [grid]);

  useEffect(() => {
    frame.smooth = heroProgress.get();
    frame.ready = false;
    const onMove = (e: PointerEvent) => {
      frame.px = (e.clientX / window.innerWidth) * 2 - 1;
      frame.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = heroProgress.get();
    frame.smooth += (target - frame.smooth) * (1 - Math.exp(-dt * 4));
    const p = frame.smooth;
    const t = state.clock.elapsedTime;
    const { camera, gl } = state;

    uniforms.uTime.value = t;
    uniforms.uAssemble.value = 0.42 + p * 0.95;
    uniforms.uPixelRatio.value = gl.getPixelRatio();

    const k = Math.min(p * 1.02, 1);
    camPath.getPoint(k, tmpPos);
    lookPath.getPoint(k, tmpLook);
    tmpPos.x += Math.sin(t * 0.15) * 0.25 + frame.px * 0.5;
    tmpPos.y += Math.cos(t * 0.12) * 0.12 - frame.py * 0.25;
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);

    if (!frame.ready) {
      frame.ready = true;
      // let one frame render before revealing the canvas
      requestAnimationFrame(onReady);
    }
  });

  return (
    <>
      <mesh material={materials.sky}>
        <sphereGeometry args={[120, 32, 16]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.001} material={materials.ground}>
        <planeGeometry args={[400, 400]} />
      </mesh>
      <mesh geometry={towerGeo} material={materials.tower} frustumCulled={false} />
      <lineSegments geometry={edgeGeo} material={materials.edge} frustumCulled={false} />
      <lineSegments geometry={traceGeo} material={materials.trace} frustumCulled={false} />
      <lineSegments geometry={beamGeo} material={materials.beam} frustumCulled={false} />
      <points geometry={particleGeo} material={materials.particle} frustumCulled={false} />
    </>
  );
}

export default function FallbackHeroScene({ onReady }: { onReady: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.6);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={dpr}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(BG, 1)}
        camera={{ fov: mobile ? 62 : 42, near: 0.1, far: 160, position: [0, 8.5, 21] }}
        aria-hidden="true"
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(0.85, d - 0.3))}
          onIncline={() => setDpr((d) => Math.min(mobile ? 1.5 : 2, d + 0.2))}
        />
        <CityScene grid={mobile ? 18 : 28} onReady={onReady} />
      </Canvas>
    </div>
  );
}
