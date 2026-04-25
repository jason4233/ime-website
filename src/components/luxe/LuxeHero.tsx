"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Sparkles,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeHero — Physical Glass Ampoule (v5)
//   ───────────────────────────────────────────────────────────
//   v5 changes (Apple / Augustinus Bader / DEV21ST tier):
//   • Replaced "particles-form-bottle" silhouette with an actual
//     PHYSICAL glass ampoule mesh (lathe geometry) rendered via
//     drei <MeshTransmissionMaterial> — multi-bounce refraction,
//     IOR 1.52, clearcoat, attenuation. This is the difference
//     between "a glowing pillar of fog" and "a 4K piece of glass".
//   • <Environment preset="studio" /> HDRI — REQUIRED for the
//     transmission shader to look real (without it: flat gray).
//   • Inner liquid lathe (amber meshPhysicalMaterial) — gives the
//     bottle a real fluid level instead of a hollow void.
//   • Cap = stacked torus rings + a small dome on top.
//   • <ContactShadows> below the bottle for grounding.
//   • Particle count 8000 → 4000, demoted to ambient role, plus
//     <Sparkles> for warm gold motes.
//   • ACES Filmic + sRGB output + scene fog (fakes bloom without
//     the postprocessing package, which causes React #329 in prod).
//   • Preserved: mouse-dispersion power, breathing pulse, scroll
//     parallax, Chinese typography overlay.
// ═══════════════════════════════════════════════════════════════

const PARTICLE_COUNT = 4000;

// Ambient particles that orbit AROUND the ampoule — not on it.
// They're spawned in a wider shell so the glass mesh is the visual
// anchor and the points are atmosphere, not the subject.
function ambientPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Cylindrical shell: radius 0.9–2.2, height -1.8..1.8
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.9 + Math.pow(Math.random(), 0.6) * 1.3;
    const y = -1.8 + Math.random() * 3.6;
    pos[i * 3 + 0] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  return pos;
}

// ─── GLSL shader: warm gold motes with HDR core + soft halo ──────
const POINT_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vDepth;
  uniform float uPixelRatio;
  uniform float uPulse;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = clamp((-mvPosition.z - 2.0) / 4.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float perspective = 360.0 / -mvPosition.z;
    gl_PointSize = aSize * uPixelRatio * perspective * uPulse;
  }
`;

const POINT_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    // tighter falloff than v4: hot pinpoint core, gentle halo
    float core = smoothstep(0.30, 0.0, d);
    float halo = smoothstep(0.50, 0.14, d);
    float alpha = core * 0.65 + halo * 0.35;

    // far particles cool toward violet (depth recession)
    vec3 cool = vec3(0.42, 0.30, 0.78);
    vec3 col = mix(vColor, cool, vDepth * 0.55);
    col += vec3(0.55, 0.38, 0.10) * pow(core, 4.0) * 0.7;

    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Glass ampoule (lathe + transmission) ────────────────────────
function Ampoule({ mousePower }: { mousePower: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  // Lathe profile — narrow base, full body, shoulder, neck, cap rim.
  // Sampled densely for a smooth silhouette.
  const points = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0001, -1.6));
    // base curve
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const y = -1.6 + t * 0.15;
      const r = 0.55 * Math.sin((t * Math.PI) / 2);
      pts.push(new THREE.Vector2(Math.max(0.0001, r), y));
    }
    // body — slight inward sine for cosmetic curve
    for (let i = 1; i <= 22; i++) {
      const t = i / 22;
      const y = -1.45 + t * 1.95;
      const r = 0.55 - 0.03 * Math.sin(t * Math.PI);
      pts.push(new THREE.Vector2(r, y));
    }
    // shoulder transition
    pts.push(new THREE.Vector2(0.5, 0.55));
    pts.push(new THREE.Vector2(0.36, 0.7));
    pts.push(new THREE.Vector2(0.24, 0.85));
    pts.push(new THREE.Vector2(0.18, 0.95));
    // neck column
    pts.push(new THREE.Vector2(0.18, 1.05));
    pts.push(new THREE.Vector2(0.18, 1.18));
    // cap rim flare → cap top
    pts.push(new THREE.Vector2(0.22, 1.22));
    pts.push(new THREE.Vector2(0.0001, 1.22));
    return pts;
  }, []);

  // Inner liquid profile — slightly inset, lower fill level (cuts
  // off below the shoulder so we read "70 % full ampoule").
  const liquidPoints = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0001, -1.55));
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const y = -1.55 + t * 0.15;
      const r = 0.5 * Math.sin((t * Math.PI) / 2);
      pts.push(new THREE.Vector2(Math.max(0.0001, r), y));
    }
    for (let i = 1; i <= 18; i++) {
      const t = i / 18;
      const y = -1.4 + t * 1.6;
      const r = 0.5 - 0.025 * Math.sin(t * Math.PI);
      pts.push(new THREE.Vector2(r, y));
    }
    // flat liquid surface at ~y=0.2
    pts.push(new THREE.Vector2(0.46, 0.2));
    pts.push(new THREE.Vector2(0.0001, 0.2));
    return pts;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Slow rotation + subtle mouse parallax + breathing
    groupRef.current.rotation.y += delta * 0.10;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (mouse.y * 0.18) / Math.max(1, viewport.factor),
      0.04
    );
    const pulse = 1.0 + Math.sin(t * 0.55) * 0.012;
    // Slight push-away when mouse disperses particles, so the glass
    // recedes a hair and the user reads "the field reacted to me".
    const recede = 1.0 - mousePower.current * 0.05;
    // Multiply by base scale (0.6) so initial scale prop is preserved.
    const BASE_SCALE = 0.6;
    groupRef.current.scale.setScalar(BASE_SCALE * pulse * recede);
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} rotation={[0, -0.18, 0]} scale={0.6}>
      {/* Glass shell — the hero of the scene */}
      <mesh castShadow>
        <latheGeometry args={[points, 64]} />
        <MeshTransmissionMaterial
          transmission={0.92}
          thickness={1.4}
          roughness={0.06}
          ior={1.52}
          chromaticAberration={0.08}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor={new THREE.Color("#D08F3F")}
          attenuationDistance={0.28}
          color={new THREE.Color("#FFE9C8")}
          envMapIntensity={1.4}
          backside
          backsideThickness={0.3}
          samples={6}
          resolution={512}
        />
      </mesh>

      {/* Liquid inside — warm amber, slight opacity, refracts the
          inside surface of the glass. */}
      <mesh scale={[0.92, 0.92, 0.92]} position={[0, -0.05, 0]}>
        <latheGeometry args={[liquidPoints, 48]} />
        <meshPhysicalMaterial
          color={new THREE.Color("#A77B3A")}
          transmission={0.55}
          thickness={2.0}
          roughness={0.22}
          ior={1.34}
          attenuationColor={new THREE.Color("#7A4D1A")}
          attenuationDistance={0.35}
          emissive={new THREE.Color("#5A3A12")}
          emissiveIntensity={0.25}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Cap — black metal, 3 thread rings + a top cap dome */}
      {[1.05, 1.10, 1.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.205, 0.012, 16, 64]} />
          <meshStandardMaterial color="#1A1A1F" metalness={0.95} roughness={0.28} />
        </mesh>
      ))}
      {/* Cap shoulder ring (thicker) */}
      <mesh position={[0, 1.20, 0]}>
        <torusGeometry args={[0.22, 0.024, 16, 64]} />
        <meshStandardMaterial color="#0F0F12" metalness={0.95} roughness={0.22} />
      </mesh>
      {/* Cap dome */}
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 48]} />
        <meshStandardMaterial color="#0A0A0D" metalness={0.92} roughness={0.3} />
      </mesh>

      {/* Subtle gold logo band on bottle body — flat ring sitting
          on the glass surface, low metalness so it reads as foil. */}
      <mesh position={[0, -0.15, 0]}>
        <torusGeometry args={[0.55, 0.004, 8, 96]} />
        <meshStandardMaterial
          color="#CA8A04"
          metalness={0.6}
          roughness={0.35}
          emissive="#3A2A08"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <torusGeometry args={[0.55, 0.003, 8, 96]} />
        <meshStandardMaterial
          color="#CA8A04"
          metalness={0.6}
          roughness={0.35}
          emissive="#3A2A08"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// ─── Ambient particle field around the ampoule ───────────────────
function AmbientField({ mousePower }: { mousePower: { current: number } }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const { positions, seeds, sizes, colors } = useMemo(() => {
    const positions = ambientPositions(PARTICLE_COUNT);
    const seeds = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Disperse seeds = bigger sphere, used for mouse-induced spread
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 5.5;
        y = (Math.random() - 0.5) * 4.5;
        z = (Math.random() - 0.5) * 5.5;
      } while (x * x + y * y + z * z > 7);
      seeds[i * 3 + 0] = x;
      seeds[i * 3 + 1] = y;
      seeds[i * 3 + 2] = z;

      // Size distribution: tiny majority + occasional bright sparkle
      const r = Math.random();
      sizes[i] = r > 0.97 ? 6.5 + Math.random() * 3
              : r > 0.80 ? 2.8 + Math.random() * 1.8
              : 1.2 + Math.random() * 1.0;

      // Per-particle warm gold with hue jitter (no monotone field)
      const tint = 0.85 + Math.random() * 0.3;
      const hueShift = (Math.random() - 0.5) * 0.16; // ±8 % around gold
      colors[i * 3 + 0] = (1.55 + hueShift * 0.3) * tint;
      colors[i * 3 + 1] = (1.05 - Math.abs(hueShift) * 0.4) * tint;
      colors[i * 3 + 2] = 0.30 + Math.random() * 0.20;
    }
    return { positions, seeds, sizes, colors };
  }, []);

  // Working buffer animated each frame
  const livePositions = useMemo(() => new Float32Array(positions), [positions]);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1 },
      uPulse: { value: 1.0 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);
  }, [gl, uniforms]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const power = mousePower.current; // 0 = orbit, 1 = dispersed
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const tx = positions[i3] * (1 - power) + seeds[i3] * power;
      const ty = positions[i3 + 1] * (1 - power) + seeds[i3 + 1] * power;
      const tz = positions[i3 + 2] * (1 - power) + seeds[i3 + 2] * power;

      // Gentle orbital drift (different freqs per particle)
      const breath = 0.014 * Math.sin(t * 0.7 + i * 0.013);
      const swirl = 0.010 * Math.cos(t * 0.5 + i * 0.018);

      arr[i3] += (tx + breath - arr[i3]) * 0.06;
      arr[i3 + 1] += (ty + swirl - arr[i3 + 1]) * 0.06;
      arr[i3 + 2] += (tz - arr[i3 + 2]) * 0.06;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    if (matRef.current) {
      matRef.current.uniforms.uPulse.value =
        1.0 + Math.sin(t * (Math.PI * 2 / 4.0)) * 0.025;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={livePositions}
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
  );
}

// ─── Lighting rig — supports HDRI environment, doesn't replace it ─
function LightRig() {
  return (
    <>
      <ambientLight intensity={0.05} />
      {/* Warm key spot — chiaroscuro from upper-front-left */}
      <spotLight
        position={[-2.5, 4, 3.5]}
        angle={0.42}
        penumbra={0.85}
        intensity={3.2}
        color="#FFD9A8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Back rim purple — separation against dark bg */}
      <spotLight
        position={[3, 2, -1.5]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.4}
        color="#7A4D8E"
      />
      {/* Tight gold key directly behind for through-glass glow */}
      <pointLight
        position={[0, 0.3, -2.6]}
        intensity={2.0}
        color="#CA8A04"
        distance={6}
        decay={1.8}
      />
    </>
  );
}

// ─── Hero data type & component ─────────────────────────────────
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

  // Mouse-induced dispersion (preserved from v4)
  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const dist = Math.sqrt(x * x + y * y);
    mousePower.current = Math.min(0.55, dist * 0.9);
  };
  const onMouseLeave = () => {
    const ease = () => {
      mousePower.current *= 0.92;
      if (mousePower.current > 0.002) requestAnimationFrame(ease);
      else mousePower.current = 0;
    };
    ease();
  };

  const headline = "妳值得";
  const headlineAccent = "被細胞溫柔對待。";
  const subline = "每 1mL 安瓶 2,000 億顆臍帶間質幹細胞外泌體。";
  const ctaText = "我想預約";
  void data;

  // Hero parallax — content fades & translates as you scroll
  const heroProgress = Math.min(1, scrollY / 700);
  // Scroll-driven zoom on the canvas (preserved UX)
  const canvasZoom = 1 + heroProgress * 0.18;

  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden bg-luxe-bgBase"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Layer 0: ambient corner-only vignette accents (NOT center) — leaves
          the central viewport dark so the glass ampoule reads cleanly
          against bg, instead of showing through transparent canvas as fog. */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Lower-left purple breath — corner only, falls off well before center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_8%_88%,rgba(122,77,142,0.10),transparent_55%)]" />
        {/* Upper-right ivory breath — corner only */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_28%_22%_at_92%_8%,rgba(199,227,216,0.04),transparent_55%)]" />
      </div>

      {/* Layer 1: 3D physical ampoule scene */}
      {!reduced && (
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${canvasZoom})`,
            transformOrigin: "50% 55%",
            transition: "transform 60ms linear",
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 32 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            shadows
          >
            {/* Explicit dark canvas bg — guarantees blackness behind transmission */}
            <color attach="background" args={["#0A0A0D"]} />
            {/* Fog → far ambient particles dim, restoring depth */}
            <fog attach="fog" args={["#0A0A0D", 6, 22]} />

            <Suspense fallback={null}>
              {/* HDRI environment — warehouse preset has directional contrast,
                  low intensity prevents bright fog inside the glass body. */}
              <Environment preset="warehouse" background={false} environmentIntensity={0.45} />

              <LightRig />

              {/* Float adds organic micro-drift the eye reads as
                  "alive". Tame intensity — this is luxury, not a toy. */}
              <Float
                speed={0.6}
                floatIntensity={0.25}
                rotationIntensity={0.12}
                floatingRange={[-0.04, 0.04]}
              >
                <Ampoule mousePower={mousePower} />
              </Float>

              {/* Drei sparkles — warm gold motes drifting through scene */}
              <Sparkles
                count={400}
                scale={[3.5, 6, 3.5]}
                size={1.4}
                speed={0.28}
                opacity={0.85}
                color="#F5D08A"
              />
              <Sparkles
                count={120}
                scale={[6, 5, 6]}
                size={0.7}
                speed={0.12}
                opacity={0.5}
                color="#A374B8"
              />

              {/* Custom-shader ambient field (lower density, atmospheric) */}
              <AmbientField mousePower={mousePower} />

              {/* Grounding shadow on the implied surface */}
              <ContactShadows
                position={[0, -1.65, 0]}
                opacity={0.75}
                scale={5}
                blur={2.4}
                far={4}
                resolution={512}
                color="#000000"
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Layer 1.5: minimal localized text backdrop. Only enough darkening
          near the headline band (~38–48% Y) for readability against the
          bottle's amber rim. Keep the center mostly transparent so the
          glass ampoule shows through clearly. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,10,13,0.12) 25%, rgba(10,10,13,0.18) 50%, transparent 75%, transparent 100%)",
        }}
      />

      {/* Layer 2: SVG film grain — subtle texture */}
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

      {/* Layer 20: Content overlay (preserved) */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: 1 - heroProgress * 0.8,
          transform: `translateY(${heroProgress * -40}px)`,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-italic italic text-luxe-gold/80 text-[0.75rem] sm:text-sm tracking-[0.5em] uppercase mb-6 sm:mb-8"
        >
          Cellular Atelier · Est. 2025
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-tc text-luxe-ivory leading-[1.15] tracking-[-0.01em] max-w-3xl mb-6 font-medium"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
            textShadow:
              "0 2px 20px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          <span className="block">{headline}</span>
          <span className="block mt-1 text-luxe-ivoryDim font-light">
            {headlineAccent}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.85 }}
          className="font-italic italic text-luxe-gold/70 text-base md:text-lg tracking-wider mb-10"
        >
          a letter, written by your own cells.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0 }}
          className="font-sans text-luxe-ivoryDim text-base sm:text-lg leading-relaxed font-light max-w-xl mb-12 tracking-wide"
        >
          {subline}
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px w-24 bg-luxe-gold/60 mb-12 origin-center"
        />

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
