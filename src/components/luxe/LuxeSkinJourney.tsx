"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeSkinJourney — flying through tissue
//   Strategy: ONE big Points field with 4000 cells distributed in a
//   long tube along z-axis (z = +2 → -16). Per-frame color/size based
//   on which stratum the camera is currently passing through.
// ═══════════════════════════════════════════════════════════════

const STRATA = [
  { z:  0.0, zh: "角質層",       en: "Stratum corneum",           color: new THREE.Color("#F5C9A8") },
  { z: -2.5, zh: "表皮",         en: "Epidermis",                 color: new THREE.Color("#E8B07F") },
  { z: -5.0, zh: "真皮交界",     en: "Dermal-epidermal junction", color: new THREE.Color("#C28066") },
  { z: -7.5, zh: "真皮 · 微血管", en: "Dermis · Capillaries",     color: new THREE.Color("#B85A7A") },
  { z:-10.0, zh: "細胞訊息",     en: "Cellular communication",    color: new THREE.Color("#A374B8") },
  { z:-12.5, zh: "外泌體抵達",   en: "Exosome arrival",           color: new THREE.Color("#E8B23F") },
];

const PARTICLE_COUNT = 12000;

function colorAtZ(z: number): THREE.Color {
  // Interpolate between adjacent strata colors based on z position
  // Strata z: 0, -2.5, -5, -7.5, -10, -12.5
  const idxFloat = (-z + 0) / 2.5; // 0 at z=0, 5 at z=-12.5
  const i = Math.max(0, Math.min(STRATA.length - 1, Math.floor(idxFloat)));
  const j = Math.max(0, Math.min(STRATA.length - 1, i + 1));
  const t = THREE.MathUtils.clamp(idxFloat - i, 0, 1);
  const out = STRATA[i].color.clone().lerp(STRATA[j].color, t);
  return out;
}

function CellTunnel() {
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();

  // Generate cells in a tube along z = +2 → -16, tube radius 0.8 → 4.5
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Z spans the full tunnel
      const z = 3 - Math.random() * 19; // +3 → -16
      // Tube cross-section: tighter, closer to camera path
      const r = 0.35 + Math.sqrt(Math.random()) * 2.6;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = z;
      // Initial color (will be updated per-frame based on camera Z)
      const c = colorAtZ(z);
      colors[i * 3] = c.r * 1.6;       // HDR boost
      colors[i * 3 + 1] = c.g * 1.4;
      colors[i * 3 + 2] = c.b * 1.4;
      // Size variance — small sparse points for flowing through
      sizes[i] = 0.4 + Math.random() * 0.8;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const camZ = camera.position.z;
    const colorArr = ref.current.geometry.attributes.color.array as Float32Array;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;

    // Update each cell's color based on its z relative to current strata
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = posArr[i * 3 + 2];
      const c = colorAtZ(z);
      // Distance fade from camera — closer = brighter
      const distZ = Math.abs(camZ - z);
      const fade = THREE.MathUtils.clamp(1 - distZ * 0.18, 0.05, 1);
      // HDR boost for bloom-friendly emissive look
      colorArr[i * 3]     = c.r * 1.6 * fade;
      colorArr[i * 3 + 1] = c.g * 1.4 * fade;
      colorArr[i * 3 + 2] = c.b * 1.4 * fade;
    }
    ref.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function ExosomesAscent({ progress }: { progress: number }) {
  // Activate in deep half of journey
  const visible = progress > 0.55;
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const { positions, colors, sizes } = useMemo(() => {
    const N = 60;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = Math.sqrt(Math.random()) * 2.6;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = -8 - Math.random() * 8;
      colors[i * 3] = 1.8;
      colors[i * 3 + 1] = 1.3;
      colors[i * 3 + 2] = 0.5;
      sizes[i] = 1.2 + Math.random() * 0.8;
    }
    return { positions, colors, sizes };
  }, []);

  useFrame((s, delta) => {
    if (!ref.current || !visible) return;
    const t = s.clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < arr.length / 3; i++) {
      arr[i * 3 + 1] += delta * 0.4;
      // Wrap upward
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
      // Subtle horizontal sway
      arr[i * 3] += Math.sin(t * 0.8 + i) * delta * 0.04;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // Follow camera depth-wise
    if (ref.current) ref.current.position.z = camera.position.z * 0.3;
  });

  if (!visible) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetZ = 2 - progress * 16;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    // Subtle organic sway
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      Math.sin(progress * Math.PI * 1.4) * 0.4,
      0.06
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      Math.cos(progress * Math.PI * 0.9) * 0.3,
      0.06
    );
    camera.lookAt(0, 0, targetZ - 2);
  });
  return null;
}

function SkinScene({ progress }: { progress: number }) {
  // Use a Drei Sparkles cluster that follows camera (we know this works
  // because Hero uses it). Three layers to give density + color depth.
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      <fog attach="fog" args={["#0A0A0D", 1.5, 13]} />
      <ambientLight intensity={0.5} />

      <CameraRig progress={progress} />

      {/* Foreground: dense bright cells in immediate vicinity of camera */}
      <Sparkles
        count={2200}
        scale={[8, 8, 30]}
        position={[0, 0, -6]}
        size={6}
        speed={0.15}
        opacity={1}
        color={progress < 0.5 ? "#F5C9A8" : progress < 0.8 ? "#B85A7A" : "#E8B23F"}
      />
      {/* Mid-range tissue scatter */}
      <Sparkles
        count={1800}
        scale={[14, 14, 30]}
        position={[0, 0, -6]}
        size={3}
        speed={0.08}
        opacity={0.7}
        color={progress < 0.5 ? "#E8B07F" : progress < 0.8 ? "#A374B8" : "#CA8A04"}
      />
      {/* Distant ambient glow */}
      <Sparkles
        count={1000}
        scale={[20, 20, 30]}
        position={[0, 0, -6]}
        size={1.5}
        speed={0.04}
        opacity={0.5}
        color="#7A4D8E"
      />

      <ExosomesAscent progress={progress} />
    </>
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
          <Canvas
            camera={{ position: [0, 0, 2], fov: 70 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Suspense fallback={null}>
              <SkinScene progress={progressVal} />
            </Suspense>
          </Canvas>
        </div>

        {/* Soft cinematic vignette only at outer edges */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 95% 95% at center, transparent 70%, rgba(10,10,13,0.55) 100%)",
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
