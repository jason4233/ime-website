"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeSkinJourney — Cinematic 3D dive through 6 skin strata
//
//   Approach: instancedMesh "cell tissue" densely packed in a tube
//   along the z-axis. Camera flies from z=+2 to z=-15. Each stratum
//   is a ~2.4-unit-thick slab populated with ~400 cells whose colors
//   reflect the layer's biology (warm keratin → rose dermis → purple
//   signaling → gold exosomes).
//
//   Layers (back-to-front render order):
//   1. <fog>             — exponential darkness fade
//   2. Translucent layer membranes (6 thin discs) — sense of stratum
//   3. CellTissue        — 2400 instanced spheres (the bulk)
//   4. Particle dust     — 5000 fine Points, atmosphere
//   5. ExosomesAscent    — last layer's golden particles rising
// ═══════════════════════════════════════════════════════════════

const STRATA = [
  { zh: "角質層",         en: "Stratum corneum",           hex: "#F5C9A8", emissive: "#E8B07F" },
  { zh: "表皮",           en: "Epidermis",                 hex: "#E8B07F", emissive: "#C28066" },
  { zh: "真皮交界",        en: "Dermal-epidermal junction", hex: "#C28066", emissive: "#A85A4F" },
  { zh: "真皮 · 微血管",   en: "Dermis · Capillaries",      hex: "#B85A7A", emissive: "#8B3A5C" },
  { zh: "細胞訊息",        en: "Cellular communication",    hex: "#A374B8", emissive: "#7A4D8E" },
  { zh: "外泌體抵達",      en: "Exosome arrival",           hex: "#E8B23F", emissive: "#CA8A04" },
] as const;

// Tunnel geometry
const TUNNEL_Z_START = 2;
const TUNNEL_Z_END = -15;
const TUNNEL_LENGTH = TUNNEL_Z_START - TUNNEL_Z_END; // 17
const STRATUM_THICKNESS = TUNNEL_LENGTH / STRATA.length; // ~2.83
const TUBE_RADIUS = 3.2;

const CELLS_PER_STRATUM = 420;
const TOTAL_CELLS = CELLS_PER_STRATUM * STRATA.length; // 2520
const DUST_COUNT = 5000;
const EXOSOME_COUNT = 80;

// ───────────────────────────────────────────────────────────────
//   CellTissue — the protagonist. 2520 instanced spheres pre-
//   placed in the tunnel, colored by stratum, with per-frame
//   breathing scale + faint z-drift to feel alive.
// ───────────────────────────────────────────────────────────────
function CellTissue() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Pre-compute per-cell static data
  const cells = useMemo(() => {
    const arr: {
      x: number;
      y: number;
      z: number;
      baseScale: number;
      phase: number;
      driftAmp: number;
      colorR: number;
      colorG: number;
      colorB: number;
      stratumIdx: number;
    }[] = [];

    for (let s = 0; s < STRATA.length; s++) {
      const zCenter = TUNNEL_Z_START - (s + 0.5) * STRATUM_THICKNESS;
      const baseColor = new THREE.Color(STRATA[s].hex);
      const emissiveColor = new THREE.Color(STRATA[s].emissive);

      for (let i = 0; i < CELLS_PER_STRATUM; i++) {
        // Distribute z within stratum thickness (with a soft falloff at edges so layers blend)
        const zJitter = (Math.random() - 0.5) * STRATUM_THICKNESS * 1.05;
        const z = zCenter + zJitter;

        // Distribute in tube cross-section: uniform area (sqrt for radial)
        // Bias toward outer half so center is open for camera path,
        // but fill edges densely for "surrounded" feel
        const r = 0.45 + Math.sqrt(Math.random()) * (TUBE_RADIUS - 0.45);
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;

        // Cell size: keratin (top) is flat & small, dermis bigger, purple signaling smallest+brightest
        const sizeProfile =
          s === 0 ? 0.04 + Math.random() * 0.05 : // tight keratin
          s === 1 ? 0.06 + Math.random() * 0.06 : // epidermal
          s === 2 ? 0.07 + Math.random() * 0.07 : // junction
          s === 3 ? 0.08 + Math.random() * 0.10 : // dermis larger
          s === 4 ? 0.05 + Math.random() * 0.06 : // signaling cells
                    0.04 + Math.random() * 0.04;  // exosomes (small but bright)

        // Color: blend between base color and emissive accent randomly
        const blend = Math.random() * 0.55;
        tmpColor.copy(baseColor).lerp(emissiveColor, blend);
        // HDR boost for tonemapped emissive feel
        const hdrBoost = 1.15 + Math.random() * 0.4;

        arr.push({
          x,
          y,
          z,
          baseScale: sizeProfile,
          phase: Math.random() * Math.PI * 2,
          driftAmp: 0.02 + Math.random() * 0.04,
          colorR: tmpColor.r * hdrBoost,
          colorG: tmpColor.g * hdrBoost,
          colorB: tmpColor.b * hdrBoost,
          stratumIdx: s,
        });
      }
    }
    return arr;
  }, [tmpColor]);

  // Pre-fill instance colors (one-time)
  useEffect(() => {
    if (!meshRef.current) return;
    cells.forEach((c, i) => {
      tmpColor.setRGB(c.colorR, c.colorG, c.colorB);
      meshRef.current!.setColorAt(i, tmpColor);
    });
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [cells, tmpColor]);

  // Per-frame: subtle breathing + slow z-drift (cells flow past camera direction)
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];

      // Breathing pulse
      const pulse = 1 + Math.sin(t * 0.7 + c.phase) * 0.18;
      const scale = c.baseScale * pulse;

      // Tiny lateral drift
      const dx = Math.sin(t * 0.4 + c.phase * 1.3) * c.driftAmp;
      const dy = Math.cos(t * 0.3 + c.phase * 0.9) * c.driftAmp;

      dummy.position.set(c.x + dx, c.y + dy, c.z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, TOTAL_CELLS]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 12, 10]} />
      <meshStandardMaterial
        vertexColors
        roughness={0.45}
        metalness={0.05}
        emissive={"#FFFFFF" as any}
        emissiveIntensity={0.32}
        transparent
        opacity={0.92}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ───────────────────────────────────────────────────────────────
//   ParticleDust — 5000 tiny additive points scattered through
//   tunnel for atmosphere / motion blur substitute.
// ───────────────────────────────────────────────────────────────
function ParticleDust() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const colors = new Float32Array(DUST_COUNT * 3);
    const sizes = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      const z = TUNNEL_Z_START - Math.random() * TUNNEL_LENGTH;
      const stratumIdx = Math.min(
        STRATA.length - 1,
        Math.max(0, Math.floor((TUNNEL_Z_START - z) / STRATUM_THICKNESS))
      );
      const baseColor = new THREE.Color(STRATA[stratumIdx].hex);

      // Slightly tighter spread for dust — keep camera surrounded
      const r = Math.sqrt(Math.random()) * (TUBE_RADIUS + 0.4);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = z;

      // HDR color, lifted toward warm white so dust glows
      colors[i * 3] = baseColor.r * 1.4 + 0.15;
      colors[i * 3 + 1] = baseColor.g * 1.3 + 0.12;
      colors[i * 3 + 2] = baseColor.b * 1.2 + 0.10;

      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, colors, sizes };
  }, []);

  // Slow constant drift along z (creates feel of flow as camera dives)
  useFrame((_state, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3 + 2] += delta * 0.18;
      // Wrap back to far end
      if (arr[i * 3 + 2] > TUNNEL_Z_START + 1) {
        arr[i * 3 + 2] = TUNNEL_Z_END - 0.5;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={DUST_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={DUST_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={DUST_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// ───────────────────────────────────────────────────────────────
//   StratumMembranes — 6 large translucent discs at each stratum
//   center to give a "passing through layers" sensation
// ───────────────────────────────────────────────────────────────
function StratumMembranes() {
  return (
    <>
      {STRATA.map((s, i) => {
        const z = TUNNEL_Z_START - (i + 0.5) * STRATUM_THICKNESS;
        return (
          <mesh
            key={i}
            position={[0, 0, z]}
            rotation={[0, 0, (Math.PI / 7) * (i % 2 === 0 ? 1 : -1)]}
          >
            <ringGeometry args={[0.2, TUBE_RADIUS * 1.05, 64, 1]} />
            <meshBasicMaterial
              color={s.emissive}
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   ExosomesAscent — last stratum: golden particles rising
// ───────────────────────────────────────────────────────────────
function ExosomesAscent({ progress }: { progress: number }) {
  const visible = progress > 0.55;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const goldA = useMemo(() => new THREE.Color("#E8B23F"), []);
  const goldB = useMemo(() => new THREE.Color("#F4D78A"), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const exosomes = useMemo(() => {
    return Array.from({ length: EXOSOME_COUNT }, () => {
      const r = Math.sqrt(Math.random()) * 2.4;
      const theta = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(theta) * r,
        y: -3.5 - Math.random() * 2.5, // start below
        z: TUNNEL_Z_END + 1 + Math.random() * 4, // last stratum range
        riseSpeed: 0.18 + Math.random() * 0.32,
        sway: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.08,
        colorMix: Math.random(),
      };
    });
  }, []);

  // Initial color
  useEffect(() => {
    if (!meshRef.current) return;
    exosomes.forEach((e, i) => {
      tmpColor.copy(goldA).lerp(goldB, e.colorMix).multiplyScalar(1.6);
      meshRef.current!.setColorAt(i, tmpColor);
    });
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [exosomes, goldA, goldB, tmpColor]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < exosomes.length; i++) {
      const e = exosomes[i];
      e.y += delta * e.riseSpeed;
      // Wrap when too high
      if (e.y > 4) e.y = -4;

      const swayX = Math.sin(t * 0.6 + e.phase) * e.sway;
      const swayZ = Math.cos(t * 0.4 + e.phase) * e.sway * 0.5;

      // Gentle pulse
      const pulse = 1 + Math.sin(t * 1.2 + e.phase) * 0.22;

      dummy.position.set(e.x + swayX, e.y, e.z + swayZ);
      dummy.scale.setScalar(e.scale * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, EXOSOME_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 14, 14]} />
      <meshStandardMaterial
        vertexColors
        emissive={"#FFFFFF" as any}
        emissiveIntensity={0.85}
        roughness={0.25}
        metalness={0.15}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ───────────────────────────────────────────────────────────────
//   CameraRig — scroll-driven dive
// ───────────────────────────────────────────────────────────────
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const targetZ =
      TUNNEL_Z_START - progress * (TUNNEL_LENGTH - 1.5); // stop just inside last stratum
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.09);

    // Subtle organic sway (sinusoidal)
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      Math.sin(progress * Math.PI * 1.6) * 0.55,
      0.06
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      Math.cos(progress * Math.PI * 1.1) * 0.4,
      0.06
    );
    camera.lookAt(
      Math.sin(progress * Math.PI * 1.6) * 0.4,
      Math.cos(progress * Math.PI * 1.1) * 0.3,
      camera.position.z - 2.2
    );

    // Light follows camera so cells near the viewer always glow
    if (lightRef.current) {
      lightRef.current.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z - 0.6
      );
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={3.4}
      distance={6}
      decay={1.6}
      color="#FFE4B8"
    />
  );
}

// ───────────────────────────────────────────────────────────────
//   StratumLight — colored point light per stratum, fades in/out
//   based on camera proximity. Tints cells biologically.
// ───────────────────────────────────────────────────────────────
function StratumLights({ progress }: { progress: number }) {
  // Pick the active stratum's emissive color and project a soft light
  // at that z-position; intensity decays with distance from camera Z.
  const activeIdx = Math.min(
    STRATA.length - 1,
    Math.floor(progress * STRATA.length)
  );
  const nextIdx = Math.min(STRATA.length - 1, activeIdx + 1);
  const activeColor = STRATA[activeIdx].emissive;
  const nextColor = STRATA[nextIdx].emissive;

  return (
    <>
      <pointLight
        position={[0, 0, TUNNEL_Z_START - (activeIdx + 0.5) * STRATUM_THICKNESS]}
        intensity={1.6}
        color={activeColor}
        distance={5}
        decay={1.8}
      />
      <pointLight
        position={[0, 0, TUNNEL_Z_START - (nextIdx + 0.5) * STRATUM_THICKNESS]}
        intensity={0.9}
        color={nextColor}
        distance={5}
        decay={1.8}
      />
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   Scene
// ───────────────────────────────────────────────────────────────
function SkinScene({ progress }: { progress: number }) {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      <fog attach="fog" args={["#0A0A0D", 1.8, 9.0]} />

      <ambientLight intensity={0.25} />

      <CameraRig progress={progress} />
      <StratumLights progress={progress} />

      <StratumMembranes />
      <CellTissue />
      <ParticleDust />
      <ExosomesAscent progress={progress} />
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   Reduced-motion poster — static frame substitute
// ───────────────────────────────────────────────────────────────
function StaticPoster() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(184,90,122,0.35), transparent 70%), " +
          "radial-gradient(ellipse 70% 50% at 50% 75%, rgba(122,77,142,0.30), transparent 70%), " +
          "radial-gradient(ellipse 40% 30% at 50% 95%, rgba(202,138,4,0.25), transparent 70%), " +
          "#0A0A0D",
      }}
    />
  );
}

export function LuxeSkinJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [progressVal, setProgressVal] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return progress.on("change", setProgressVal);
  }, [progress]);

  const activeIdx = Math.min(
    STRATA.length - 1,
    Math.floor(progressVal * STRATA.length)
  );

  return (
    <section
      id="skin"
      ref={containerRef}
      className="relative bg-luxe-bgBase"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {reduced ? (
            <StaticPoster />
          ) : (
            <Canvas
              camera={{ position: [0, 0, TUNNEL_Z_START], fov: 64 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={null}>
                <SkinScene progress={progressVal} />
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Soft cinematic vignette only at outer edges */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 95% 95% at center, transparent 65%, rgba(10,10,13,0.6) 100%)",
          }}
        />

        {/* Eyebrow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <p className="font-italic italic text-luxe-gold/80 text-sm tracking-[0.5em] uppercase">
            III · Skin Journey
          </p>
        </div>

        {/* Stratum label */}
        <div className="absolute bottom-24 left-0 right-0 z-20 px-6 text-center pointer-events-none">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <p className="font-italic italic text-luxe-ivoryFade text-[0.75rem] tracking-[0.45em] uppercase">
              {STRATA[activeIdx].en}
            </p>
            <h3 className="font-serif-tc text-luxe-ivory text-4xl md:text-6xl font-medium tracking-tight">
              {STRATA[activeIdx].zh}
            </h3>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mt-10">
            {STRATA.map((_, i) => (
              <span
                key={i}
                className={`block h-px transition-all duration-700 ${
                  i === activeIdx
                    ? "w-14 bg-luxe-gold"
                    : i < activeIdx
                    ? "w-7 bg-luxe-gold/40"
                    : "w-7 bg-luxe-ivory/15"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 right-8 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
          <div className="flex flex-col items-end gap-2">
            <span className="font-display italic text-luxe-gold text-6xl font-medium tabular-nums leading-none">
              {String(Math.round(progressVal * 100)).padStart(2, "0")}
            </span>
            <span className="font-italic italic text-luxe-ivoryFade text-[0.7rem] tracking-[0.45em] uppercase">
              depth
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
