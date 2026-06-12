"use client";

/*
  Hero 3D — "idea → delivery" particle morph.
  A cloud of violet particles (the idea) drifts across the whole hero,
  then assembles into one of three procedural shapes — globe / cube
  lattice / trefoil knot (websites / apps / automations) — anchored to
  the right so the headline stays readable. It lights up signal-green,
  dissolves back into the cloud, repeats. Runs entirely on the GPU via
  a custom point shader; pauses offscreen, freezes for
  prefers-reduced-motion, falls back to a glow without WebGL.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";

const COUNT = 4500;

/* ── procedural targets ─────────────────────────────────────────── */

// gaussian-ish distribution around the shape anchor: dense in the
// middle, fading softly outwards, so the cloud never shows a hard frame
function makeChaos(n: number, sx: number, sy: number) {
  const arr = new Float32Array(n * 3);
  const g = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
  for (let i = 0; i < n; i++) {
    arr[i * 3] = g() * sx;
    arr[i * 3 + 1] = g() * sy;
    arr[i * 3 + 2] = g() * 1.5;
  }
  return arr;
}

function makeGlobe(n: number) {
  const arr = new Float32Array(n * 3);
  const golden = Math.PI * (Math.sqrt(5) - 1);
  const R = 1.18;
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
  const s = 0.84;
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

function makeKnot(n: number) {
  const arr = new Float32Array(n * 3);
  const scale = 0.42;
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2;
    // trefoil knot + a little tube thickness
    const x = Math.sin(t) + 2 * Math.sin(2 * t);
    const y = Math.cos(t) - 2 * Math.cos(2 * t);
    const z = -Math.sin(3 * t);
    arr[i * 3] = x * scale + (Math.random() - 0.5) * 0.16;
    arr[i * 3 + 1] = y * scale + (Math.random() - 0.5) * 0.16;
    arr[i * 3 + 2] = z * scale + (Math.random() - 0.5) * 0.16;
  }
  return arr;
}

/* ── shaders ────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uFromShaped;
  uniform float uToShaped;
  uniform float uSize;
  uniform float uSpin;
  uniform vec2 uFade;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  varying float vShaped;
  varying float vSeed;
  varying float vTwinkle;
  varying float vFade;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  void main() {
    // staggered per-particle progress
    float t = clamp(uProgress * 1.35 - aSeed * 0.35, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    // only shaped endpoints spin; the free cloud stays put
    vec3 from = rotY(aFrom, uSpin * uFromShaped);
    vec3 to = rotY(aTo, uSpin * uToShaped);
    vec3 pos = mix(from, to, t);

    // particles bow outward mid-flight
    float arc = sin(t * 3.14159265);
    pos += vec3(
      sin(aSeed * 78.233 + uTime * 0.4),
      cos(aSeed * 43.758),
      sin(aSeed * 12.9898)
    ) * arc * 0.38 * (0.3 + aSeed * 0.7);

    float shaped = mix(uFromShaped, uToShaped, t);

    // restless drift while unformed
    pos += (1.0 - shaped) * 0.16 * vec3(
      sin(uTime * 0.7 + aSeed * 31.4),
      sin(uTime * 0.9 + aSeed * 17.2),
      cos(uTime * 0.6 + aSeed * 23.7)
    );

    // breathing once formed
    pos *= 1.0 + shaped * 0.012 * sin(uTime * 1.6 + aSeed * 6.2831);

    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed * 0.9) * mix(1.1, 0.85, shaped) / -mv.z;

    // free particles dim over the headline on the left; the formed
    // shape is unaffected
    vFade = mix(mix(0.06, 1.0, smoothstep(uFade.x, uFade.y, wp.x)), 1.0, shaped);
    vShaped = shaped;
    vSeed = aSeed;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 2.0 + aSeed * 40.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uFlash;
  varying float vShaped;
  varying float vSeed;
  varying float vTwinkle;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.16, d);
    if (alpha < 0.01) discard;

    vec3 violet = vec3(0.553, 0.482, 1.0);          /* #8D7BFF */
    vec3 lime   = vec3(0.624, 0.937, 0.0) * 0.78;   /* #9FEF00, headroom for additive stacking */
    vec3 amber  = vec3(1.0, 0.698, 0.141);          /* #FFB224 */

    vec3 col = mix(violet, lime, vShaped);
    // sparse amber accents once formed
    col = mix(col, amber, step(0.95, fract(vSeed * 7.31)) * vShaped);
    // completion flash
    col += uFlash * lime * 0.4;

    gl_FragColor = vec4(col, alpha * (0.65 + 0.25 * vShaped) * vTwinkle * vFade);
  }
`;

/* ── the particle system ────────────────────────────────────────── */

type Phase = "form" | "hold" | "dissolve" | "drift";
const DUR: Record<Phase, number> = { form: 2.6, hold: 3.4, dissolve: 1.5, drift: 1.1 };

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Particles({ frozen }: { frozen: boolean }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const viewport = useThree((s) => s.viewport);

  // quantized so the cloud only regenerates on real resizes
  const vw = Math.round(viewport.width * 2) / 2;
  const vh = Math.round(viewport.height * 2) / 2;
  const wide = vw / vh >= 1.05;

  const data = useMemo(() => {
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = Math.random();
    return {
      chaos: makeChaos(COUNT, wide ? vw * 0.26 : vw * 0.55, wide ? vh * 0.5 : vh * 0.35),
      shapes: [makeGlobe(COUNT), makeCube(COUNT), makeKnot(COUNT)],
      seeds,
    };
  }, [vw, vh, wide]);

  // built imperatively: R3F clones a `uniforms` prop, which would break
  // the per-frame mutations below
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: frozen ? 1 : 0 },
          uFromShaped: { value: 0 },
          uToShaped: { value: 1 },
          uFlash: { value: 0 },
          uSize: { value: 12 },
          uSpin: { value: 0 },
          uFade: { value: new THREE.Vector2(-1000, -999) },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const uniforms = material.uniforms;

  // built imperatively too: declarative bufferAttributes would be
  // recreated from their initial arrays on every React re-render,
  // wiping the retargeting done in useFrame
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.chaos.slice(), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(data.chaos.slice(), 3));
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
    uniforms.uSize.value = size.height * dpr * 0.028;
    uniforms.uFade.value.set(wide ? -vw * 0.1 : -1000, wide ? vw * 0.06 : -999);
  }, [size, dpr, wide, vw, uniforms]);

  const anim = useRef({ phase: "form" as Phase, t: 0, shape: 0, flash: 0, spin: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  const fillTargets = (from: Float32Array, to: Float32Array) => {
    const aFrom = geometry.attributes.aFrom as THREE.BufferAttribute;
    const aTo = geometry.attributes.aTo as THREE.BufferAttribute;
    (aFrom.array as Float32Array).set(from);
    (aTo.array as Float32Array).set(to);
    aFrom.needsUpdate = true;
    aTo.needsUpdate = true;
  };

  const retarget = (from: Float32Array, to: Float32Array, fromShaped: number, toShaped: number) => {
    fillTargets(from, to);
    uniforms.uProgress.value = 0;
    uniforms.uFromShaped.value = fromShaped;
    uniforms.uToShaped.value = toShaped;
  };

  // after a resize regenerates the buffers, restore the endpoints of
  // whatever transition is in flight (uniforms stay valid)
  useEffect(() => {
    const s = anim.current;
    if (s.phase === "form" || s.phase === "hold") fillTargets(data.chaos, data.shapes[s.shape]);
    else if (s.phase === "dissolve") fillTargets(data.shapes[s.shape], data.chaos);
    else fillTargets(data.chaos, data.chaos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, rawDelta) => {
    const g = group.current!;
    g.position.set(wide ? vw * 0.24 : 0, wide ? 0 : -vh * 0.3, 0);
    const sc = wide ? 1 : 0.55;
    g.scale.set(sc, sc, sc);

    if (frozen) return;
    const delta = Math.min(rawDelta, 0.05);
    const s = anim.current;
    uniforms.uTime.value += delta;
    s.t += delta;

    if (s.phase === "form" || s.phase === "dissolve") {
      const p = Math.min(1, s.t / DUR[s.phase]);
      uniforms.uProgress.value = easeInOut(p);
      if (p === 1) {
        if (s.phase === "form") {
          s.phase = "hold";
          s.flash = 1.1;
        } else {
          s.phase = "drift";
        }
        s.t = 0;
      }
    } else if (s.t >= DUR[s.phase]) {
      if (s.phase === "hold") {
        retarget(data.shapes[s.shape], data.chaos, 1, 0);
        s.phase = "dissolve";
      } else {
        s.shape = (s.shape + 1) % data.shapes.length;
        retarget(data.chaos, data.shapes[s.shape], 0, 1);
        s.phase = "form";
      }
      s.t = 0;
    }

    s.flash = Math.max(0, s.flash - delta * 0.8);
    uniforms.uFlash.value = s.flash;

    s.spin += delta * 0.22;
    uniforms.uSpin.value = s.spin;

    const k = Math.min(1, delta * 3);
    g.rotation.y += (mouse.current.x * 0.16 - g.rotation.y) * k;
    g.rotation.x += (mouse.current.y * 0.1 - g.rotation.x) * k;
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

  useEffect(() => {
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
    <div ref={wrap} className="pointer-events-none absolute inset-0" aria-hidden>
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
