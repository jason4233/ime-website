"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeHero — Liquid Gold Particles → Ampoule Silhouette
//   Per ui-ux-pro-max: Pattern "Immersive/Interactive Experience"
//   Style "Liquid Glass" — premium luxury portfolios
//   Particles are mathematically positioned to FORM a bottle shape
//   on idle, then disperse on mouse move (cause-effect motion)
//   ───────────────────────────────────────────────────────────
//   v3 upgrades (Apple/DEV21ST quality):
//   • Custom GLSL shader: per-particle size + soft circular sprites
//   • Depth-based fade: back particles tint cool, front pop hot
//   • Breathing pulse on whole group
//   ───────────────────────────────────────────────────────────
//   v4: Removed liquid drip stream — it clustered ~220 particles
//   along the central axis and rendered as a solid milky-white
//   vertical stripe that covered the bottle silhouette and made
//   the headline unreadable. All particles now settle into the
//   ampoule silhouette uniformly.
// ═══════════════════════════════════════════════════════════════

const PARTICLE_COUNT = 8000;

// Bottle radius profile — piecewise smooth curve (called for arbitrary y)
function bottleRadius(y: number): number {
  if (y < -1.45) return 0;        // closed bottom
  if (y < -1.30) {
    // Bottom curve
    const yn = (y + 1.45) / 0.15;
    return 0.55 * Math.sqrt(Math.max(0, 1 - (1 - yn) * (1 - yn)));
  }
  if (y < 0.55) {
    // Main body — slight inward curve at middle
    const yn = (y + 1.30) / 1.85;
    return 0.55 - 0.025 * Math.sin(yn * Math.PI);
  }
  if (y < 0.95) {
    // Shoulder — narrows to neck
    const yn = (y - 0.55) / 0.40;
    return 0.55 - 0.39 * Math.pow(yn, 1.6);
  }
  if (y < 1.25) {
    // Neck — thin column
    return 0.16;
  }
  if (y < 1.45) {
    // Cap rim — slight flare
    const yn = (y - 1.25) / 0.20;
    return 0.16 + 0.06 * yn;
  }
  return 0.22; // top of cap
}

// Generate target positions: VOLUMETRIC ampoule shape
// Strategy: each particle gets random y in bottle range, then random angle
// at that y's radius. This fills the SURFACE of the bottle silhouette
// (rotation-symmetric solid), not a spiral.
function bottlePositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Uniform y across full bottle height
    const y = -1.45 + Math.random() * 2.95; // -1.45 to 1.50
    const r = bottleRadius(y);
    if (r < 0.001) {
      // Skip degenerate (closed cap)
      pos[i * 3 + 0] = 0;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 0;
      continue;
    }
    // Random angle around bottle (full ring at each y)
    const angle = Math.random() * Math.PI * 2;
    // Inward jitter for liquid-glass thickness feel
    const jitter = (Math.random() - 0.5) * 0.05;
    const rr = Math.max(0, r + jitter);
    pos[i * 3 + 0] = rr * Math.cos(angle);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = rr * Math.sin(angle);
  }
  return pos;
}

// ─── Custom GLSL shader for points ──────────────────────────────
// Per-particle size attribute, soft circular alpha mask, depth-aware
// HDR color (>1.0 still tonemaps via ACES for cinematic glow).
const POINT_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vDepth;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPulse;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // depth in view space, normalized roughly to [0..1] for our camera
    vDepth = clamp((-mvPosition.z - 2.0) / 4.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // size attenuation by view-space distance (mimics sizeAttenuation)
    float perspective = 360.0 / -mvPosition.z;
    gl_PointSize = aSize * uPixelRatio * perspective * uPulse;
  }
`;

const POINT_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    // soft circular alpha mask (procedural, no texture)
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    // 2-stop smoothstep: hot core, soft halo
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.18, d);
    float alpha = core * 0.55 + halo * 0.45;

    // depth tint: front particles stay golden, back particles cool to violet
    vec3 cool = vec3(0.45, 0.30, 0.85);
    vec3 col = mix(vColor, cool, vDepth * 0.55);
    // slight hot core boost
    col += vec3(0.6, 0.4, 0.1) * pow(core, 4.0) * 0.6;

    gl_FragColor = vec4(col, alpha);
  }
`;

function ParticleBottle({ mousePower }: { mousePower: { current: number } }) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  // (innerGlowRef removed: the volumetric inner-glow mesh was deleted because
  //  it rendered as a giant milky-white blob covering the bottle silhouette.)
  const { mouse, viewport, gl } = useThree();

  // Pre-compute target (bottle) and seed (random sphere) positions + per-particle attributes
  const { targets, seeds, sizes } = useMemo(() => {
    const targets = bottlePositions(PARTICLE_COUNT);
    const seeds = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random points in sphere (uniform via cube-rejection)
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 4;
        y = (Math.random() - 0.5) * 4;
        z = (Math.random() - 0.5) * 4;
      } while (x * x + y * y + z * z > 4);
      seeds[i * 3 + 0] = x;
      seeds[i * 3 + 1] = y;
      seeds[i * 3 + 2] = z;
      // Per-particle size (small majority + a few big "highlights")
      const r = Math.random();
      sizes[i] = r > 0.96 ? 7.5 + Math.random() * 3.5 // sparkle highlight
              : r > 0.75 ? 3.5 + Math.random() * 2.0  // mid
              : 1.6 + Math.random() * 1.4;            // base population
    }
    return { targets, seeds, sizes };
  }, []);

  // Animated buffer — interpolated each frame
  const positions = useMemo(() => new Float32Array(targets), [targets]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uPulse: { value: 1.0 },
    }),
    []
  );

  // Color buffer (HDR bright gold — drives vColor in shader)
  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Slight per-particle hue jitter so the field isn't monotone
      const tint = 0.85 + Math.random() * 0.3;
      c[i * 3] = 1.6 * tint;
      c[i * 3 + 1] = 1.05 * tint;
      c[i * 3 + 2] = 0.32 + Math.random() * 0.18;
    }
    return c;
  }, []);

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);
  }, [gl, uniforms]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const power = mousePower.current; // 0 = bottle, 1 = dispersed
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const tx = targets[i3] * (1 - power) + seeds[i3] * power;
      const ty = targets[i3 + 1] * (1 - power) + seeds[i3 + 1] * power;
      const tz = targets[i3 + 2] * (1 - power) + seeds[i3 + 2] * power;

      // Idle drift (subtle breathing)
      const breath = 0.012 * Math.sin(t * 0.7 + i * 0.013);
      const swirl = 0.008 * Math.cos(t * 0.5 + i * 0.018);

      // Smooth lerp toward target
      arr[i3] += (tx + breath - arr[i3]) * 0.06;
      arr[i3 + 1] += (ty + swirl - arr[i3 + 1]) * 0.06;
      arr[i3 + 2] += (tz - arr[i3 + 2]) * 0.06;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Shader time uniform + breathing pulse (1.00 ↔ 1.025, ~4s period)
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uPulse.value =
        1.0 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.025;
    }

    // (Inner volumetric glow removed — it rendered as a milky white blob
    //  covering the bottle. Particles + Sparkles now provide the lit feel.)

    // Rotate the whole group very slowly + subtle parallax to mouse
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        (mouse.y * 0.15) / Math.max(1, viewport.factor),
        0.03
      );
      // Gentle group-scale breathing (2% over 4s) — feels alive
      const groupPulse = 1.0 + Math.sin(t * 0.5) * 0.02;
      groupRef.current.scale.setScalar(groupPulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Volumetric inner-glow spheres removed — they composited as a solid
          milky-white oval over the bottle silhouette and the hero text.
          The particle field + Sparkles + light rig give enough "lit from
          within" feel without obscuring the silhouette or the headline. */}

      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={PARTICLE_COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          vertexShader={POINT_VERTEX_SHADER}
          fragmentShader={POINT_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

function GoldGlow() {
  return (
    <>
      {/* Gentle backlight to lift the particle field */}
      <ambientLight intensity={0.4} />
      <pointLight
        position={[0, 0, 4]}
        intensity={2.5}
        color="#CA8A04"
        distance={8}
        decay={1.5}
      />
      <pointLight
        position={[-3, -2, 3]}
        intensity={1.2}
        color="#7A4D8E"
        distance={10}
        decay={2}
      />

      {/* Drei Sparkles — drifting gold motes around the bottle for atmosphere */}
      <Sparkles
        count={120}
        scale={[6, 4, 4]}
        size={4}
        speed={0.25}
        opacity={0.9}
        color="#F0D896"
        position={[0, 0, 0]}
      />
      <Sparkles
        count={60}
        scale={[8, 6, 6]}
        size={2}
        speed={0.12}
        opacity={0.6}
        color="#A374B8"
      />
    </>
  );
}

// Postprocessing removed — caused React #329 hydration error in production.
// Using HDR vertex colors + Sparkles + tonemapping for glow instead.

interface HeroData {
  headline?: string | null;
  subheadline?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

export function LuxeHero({ data }: { data?: HeroData | null }) {
  const mousePower = useRef(0);
  const [reduced, setReduced] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      m.removeEventListener("change", onChange);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mouse-induced dispersion
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const dist = Math.sqrt(x * x + y * y);
    mousePower.current = Math.min(0.55, dist * 0.9);
  };
  const onMouseLeave = () => {
    // Smooth ease back to bottle
    const ease = () => {
      mousePower.current *= 0.92;
      if (mousePower.current > 0.002) requestAnimationFrame(ease);
      else mousePower.current = 0;
    };
    ease();
  };

  // 寫死文字，不從 CMS 抓 — luxe 是 design 主導的頁面
  const headline = "妳值得";
  const headlineAccent = "被細胞溫柔對待。";
  const subline =
    "每 1mL 安瓶 2,000 億顆臍帶間質幹細胞外泌體。";
  const ctaText = "我想預約";
  // suppress unused-data warning for now (data still informs layout decisions)
  void data;

  // Hero parallax — content fades & translates as you scroll
  const heroProgress = Math.min(1, scrollY / 700);

  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden bg-luxe-bgBase"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Layer 0: ambient gradient backdrop (renders even if R3F fails) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(202,138,4,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_30%_70%,rgba(122,77,142,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_70%_30%,rgba(199,227,216,0.06),transparent_70%)]" />
      </div>

      {/* Layer 1: 3D particle bottle */}
      {!reduced && (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Suspense fallback={null}>
              <GoldGlow />
              <ParticleBottle mousePower={mousePower} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Layer 1.5: vertical gradient veil to lift text legibility above particles */}
      <div
        aria-hidden
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,13,0) 0%, rgba(10,10,13,0.55) 35%, rgba(10,10,13,0.55) 65%, rgba(10,10,13,0) 100%)",
        }}
      />

      {/* Layer 2: SVG film grain overlay (subtle texture) */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay pointer-events-none"
      >
        <filter id="luxe-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.92  0 0 0 0 0.78  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#luxe-grain)" />
      </svg>

      {/* Layer 3: Decorative hairlines */}
      <div className="absolute top-0 left-[12%] h-[28vh] w-px bg-gradient-to-b from-luxe-gold/40 to-transparent z-10" />
      <div className="absolute bottom-0 right-[14%] h-[18vh] w-px bg-gradient-to-t from-luxe-gold/30 to-transparent z-10" />

      {/* Layer 20: Content */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: 1 - heroProgress * 0.8,
          transform: `translateY(${heroProgress * -40}px)`,
        }}
      >
        {/* Whisper */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-italic italic text-luxe-gold/80 text-[0.75rem] sm:text-sm tracking-[0.5em] uppercase mb-6 sm:mb-8"
        >
          Cellular Atelier · Est. 2025
        </motion.p>

        {/* Headline — restrained luxury: neutral ivory + accent only on tiny EN word */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-tc text-luxe-ivory leading-[1.15] tracking-[-0.01em] max-w-3xl mb-6 font-medium"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
        >
          <span className="block">{headline}</span>
          <span className="block mt-1 text-luxe-ivoryDim font-light">
            {headlineAccent}
          </span>
        </motion.h1>

        {/* English italic whisper — tiny accent, where the gold lives */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.85 }}
          className="font-italic italic text-luxe-gold/70 text-base md:text-lg tracking-wider mb-10"
        >
          a letter, written by your own cells.
        </motion.p>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0 }}
          className="font-sans text-luxe-ivoryDim text-base sm:text-lg leading-relaxed font-light max-w-xl mb-12 tracking-wide"
        >
          {subline}
        </motion.p>

        {/* Decorative gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-24 bg-luxe-gold/60 mb-12 origin-center"
        />

        {/* CTA */}
        <motion.a
          href="#appointment"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-pill border border-luxe-gold/50 bg-luxe-gold/5 px-8 py-4 font-sans text-sm font-medium tracking-[0.18em] uppercase text-luxe-gold backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-luxe-gold hover:text-luxe-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxe-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxe-bgBase"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 origin-left scale-x-0 bg-luxe-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          />
          <span className="relative">{ctaText}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="relative transition-transform duration-700 group-hover:translate-x-1"
          >
            <path
              d="M2 7h10m0 0L7 2m5 5L7 12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </motion.a>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-italic italic text-[0.65rem] tracking-[0.4em] uppercase text-luxe-ivoryFade">
            scroll
          </span>
          <span className="block h-12 w-px bg-gradient-to-b from-luxe-gold/60 to-transparent">
            <motion.span
              animate={{ y: [0, 36, 0], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="block h-3 w-px bg-luxe-gold"
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
