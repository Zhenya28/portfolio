"use client";

/*
  Hero 3D — a single particle sculpture, anchored right of the headline.
  Three procedural shapes — globe / blueprint cube / double helix
  (web presence / application architecture / automation & AI) — morph
  directly into one another in a slow loop. Particles always hold a
  form: signal-green when settled, shifting violet while in flight
  between shapes. No scatter phase, nothing crosses into the text.
  Runs entirely on the GPU via a custom point shader; pauses offscreen,
  freezes for prefers-reduced-motion, falls back to a glow without WebGL.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";

const COUNT = 2000;

/* ── procedural shapes, all roughly the same visual mass ────────── */

function makeGlobe(n: number) {
  const arr = new Float32Array(n * 3);
  const golden = Math.PI * (Math.sqrt(5) - 1);
  const R = 1.3;
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    arr[i * 3] = Math.cos(th) * rad * R;
    arr[i * 3 + 1] = y * R;
    arr[i * 3 + 2] = Math.sin(th) * rad * R;
  }
  return arr;
}

function makeCube(n: number) {
  const arr = new Float32Array(n * 3);
  const s = 0.9;
  const lines = 5;
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1;
    const p = [0, 0, 0];
    if (Math.random() < 0.42) {
      // the 12 edges
      const e = Math.floor(Math.random() * 12);
      const axis = e % 3;
      const a = e & 1 ? s : -s;
      const b = e & 2 ? s : -s;
      const rest = [0, 1, 2].filter((k) => k !== axis);
      p[axis] = u * s;
      p[rest[0]] = a;
      p[rest[1]] = b;
    } else {
      // blueprint grid lines on the faces
      const face = Math.floor(Math.random() * 6);
      const axis = face >> 1;
      const lc = ((Math.floor(Math.random() * lines) / (lines - 1)) * 2 - 1) * s;
      const rest = [0, 1, 2].filter((k) => k !== axis);
      p[axis] = face & 1 ? s : -s;
      if (Math.random() < 0.5) {
        p[rest[0]] = u * s;
        p[rest[1]] = lc;
      } else {
        p[rest[0]] = lc;
        p[rest[1]] = u * s;
      }
    }
    arr[i * 3] = p[0];
    arr[i * 3 + 1] = p[1];
    arr[i * 3 + 2] = p[2];
  }
  return arr;
}

function makeHelix(n: number) {
  const arr = new Float32Array(n * 3);
  const turns = 2.4 * Math.PI;
  const R = 0.62;
  const halfH = 1.35;
  const rungs = 9;
  for (let i = 0; i < n; i++) {
    const roll = Math.random();
    let x: number, y: number, z: number;
    if (roll < 0.8) {
      // the two strands
      const t = Math.random() * turns;
      const phase = roll < 0.4 ? 0 : Math.PI;
      x = Math.cos(t + phase) * R;
      z = Math.sin(t + phase) * R;
      y = (t / turns) * 2 * halfH - halfH;
    } else {
      // rungs between the strands
      const k = Math.floor(Math.random() * rungs);
      const t = ((k + 0.5) / rungs) * turns;
      const u = Math.random() * 2 - 1;
      x = Math.cos(t) * R * u;
      z = Math.sin(t) * R * u;
      y = ((k + 0.5) / rungs) * 2 * halfH - halfH;
    }
    arr[i * 3] = x + (Math.random() - 0.5) * 0.07;
    arr[i * 3 + 1] = y + (Math.random() - 0.5) * 0.07;
    arr[i * 3 + 2] = z + (Math.random() - 0.5) * 0.07;
  }
  return arr;
}

/* ── shaders ────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;
  uniform float uSpin;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  varying float vTransit;
  varying float vSeed;
  varying float vTwinkle;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  void main() {
    // staggered per-particle progress
    float t = clamp(uProgress * 1.35 - aSeed * 0.35, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 pos = mix(aFrom, aTo, t);

    // particles bow outward mid-flight
    float arc = sin(t * 3.14159265);
    pos += vec3(
      sin(aSeed * 78.233),
      cos(aSeed * 43.758),
      sin(aSeed * 12.9898)
    ) * arc * 0.45 * (0.3 + aSeed * 0.7);

    // the whole sculpture turns slowly
    pos = rotY(pos, uSpin);

    // breathing
    pos *= 1.0 + 0.014 * sin(uTime * 1.4 + aSeed * 6.2831);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.6 + aSeed * 0.9) / -mv.z;

    vTransit = arc;
    vSeed = aSeed;
    vTwinkle = 0.78 + 0.22 * sin(uTime * 2.0 + aSeed * 40.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uFlash;
  varying float vTransit;
  varying float vSeed;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.2, d);
    if (alpha < 0.01) discard;

    vec3 violet = vec3(0.553, 0.482, 1.0);          /* #8D7BFF */
    vec3 lime   = vec3(0.624, 0.937, 0.0) * 0.78;   /* #9FEF00, headroom for additive stacking */
    vec3 amber  = vec3(1.0, 0.698, 0.141);          /* #FFB224 */

    // settled particles glow lime; in-flight ones shift violet
    vec3 col = mix(lime, violet, vTransit * 0.85);
    // sparse amber accents
    col = mix(col, amber, step(0.95, fract(vSeed * 7.31)) * (1.0 - vTransit));
    // arrival flash
    col += uFlash * lime * 0.4;

    gl_FragColor = vec4(col, alpha * (0.85 - 0.25 * vTransit) * vTwinkle);
  }
`;

/* ── the particle system ────────────────────────────────────────── */

type Phase = "hold" | "morph";
const DUR: Record<Phase, number> = { hold: 4.2, morph: 2.4 };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Particles({ frozen }: { frozen: boolean }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const viewport = useThree((s) => s.viewport);

  const data = useMemo(() => {
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = Math.random();
    return { shapes: [makeGlobe(COUNT), makeCube(COUNT), makeHelix(COUNT)], seeds };
  }, []);

  // built imperatively: R3F clones a `uniforms` prop, which would break
  // the per-frame mutations below
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 1 },
          uFlash: { value: 0 },
          uSize: { value: 12 },
          uSpin: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );
  const uniforms = material.uniforms;

  // built imperatively too: declarative bufferAttributes would be
  // recreated from their initial arrays on every React re-render,
  // wiping the retargeting done in useFrame
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.shapes[0].slice(), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(data.shapes[0].slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(data.shapes[0].slice(), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
    return g;
  }, [data]);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry]
  );

  useEffect(() => {
    uniforms.uSize.value = size.height * dpr * 0.034;
  }, [size, dpr, uniforms]);

  const anim = useRef({ phase: "hold" as Phase, t: 0, shape: 0, flash: 0, spin: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const retarget = (from: Float32Array, to: Float32Array) => {
    const aFrom = geometry.attributes.aFrom as THREE.BufferAttribute;
    const aTo = geometry.attributes.aTo as THREE.BufferAttribute;
    (aFrom.array as Float32Array).set(from);
    (aTo.array as Float32Array).set(to);
    aFrom.needsUpdate = true;
    aTo.needsUpdate = true;
    uniforms.uProgress.value = 0;
  };

  useFrame((_, rawDelta) => {
    const g = group.current!;
    const wide = viewport.aspect >= 1.05;
    g.position.set(wide ? viewport.width * 0.24 : 0, wide ? 0 : -viewport.height * 0.3, 0);
    const sc = wide ? 1 : 0.6;
    g.scale.set(sc, sc, sc);

    if (frozen) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = anim.current;
    uniforms.uTime.value += delta;
    s.t += delta;

    if (s.phase === "hold") {
      if (s.t >= DUR.hold) {
        const next = (s.shape + 1) % data.shapes.length;
        retarget(data.shapes[s.shape], data.shapes[next]);
        s.shape = next;
        s.phase = "morph";
        s.t = 0;
      }
    } else {
      const p = Math.min(1, s.t / DUR.morph);
      uniforms.uProgress.value = easeInOut(p);
      if (p === 1) {
        s.phase = "hold";
        s.flash = 1;
        s.t = 0;
      }
    }

    s.flash = Math.max(0, s.flash - delta * 0.8);
    uniforms.uFlash.value = s.flash;

    s.spin += delta * 0.16;
    uniforms.uSpin.value = s.spin;

    const k = Math.min(1, delta * 3);
    g.rotation.y += (mouse.current.x * 0.14 - g.rotation.y) * k;
    g.rotation.x += (mouse.current.y * 0.09 - g.rotation.x) * k;
  });

  return (
    <group ref={group} rotation={frozen ? [0.18, -0.5, 0] : [0, 0, 0]}>
      <points frustumCulled={false} geometry={geometry} material={material} />
    </group>
  );
}

/* ── public wrapper: full-bleed canvas + fallbacks ──────────────── */

export default function HeroScene() {
  const reduced = useReducedMotion() ?? false;
  const wrap = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(true);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) setWebgl(false);
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: mounted ? 1 : 0 }}
      aria-hidden
    >
      {webgl ? (
        <Canvas
          frameloop={reduced ? "demand" : visible ? "always" : "never"}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.4], fov: 48 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Particles frozen={reduced} />
        </Canvas>
      ) : (
        <div className="absolute right-[10%] top-1/2 hidden size-[40vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(159,239,0,0.18),rgba(141,123,255,0.12),transparent)] blur-xl lg:block" />
      )}
    </div>
  );
}
