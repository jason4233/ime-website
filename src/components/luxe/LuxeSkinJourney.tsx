"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeSkinJourney — scroll-linked dive through skin layers
//   - Each stratum is densely packed instanced spheres (real "cells")
//   - 6 strata, each visually distinct (size, density, color)
//   - Camera dives through Z; opacity fades by distance
//   - Deepest stratum: exosomes emerge and ascend
// ═══════════════════════════════════════════════════════════════

type Stratum = {
  z: number;
  zh: string;
  en: string;
  color: string;
  emissive: string;
  cellCount: number;
  cellSize: [number, number]; // min/max
  packDensity: number; // tighter cluster
};

const STRATA: Stratum[] = [
  { z:  0.0, zh: "角質層",       en: "Stratum corneum",           color: "#E8D5C2", emissive: "#5a3820", cellCount: 280, cellSize: [0.18, 0.32], packDensity: 0.6 },
  { z: -2.5, zh: "表皮",         en: "Epidermis",                 color: "#D8B896", emissive: "#5a3820", cellCount: 240, cellSize: [0.22, 0.40], packDensity: 0.55 },
  { z: -5.0, zh: "真皮交界",     en: "Dermal-epidermal junction", color: "#A87A61", emissive: "#5a1c1c", cellCount: 200, cellSize: [0.26, 0.46], packDensity: 0.5 },
  { z: -7.5, zh: "真皮 · 微血管", en: "Dermis · Capillaries",     color: "#9A4D6E", emissive: "#822A4A", cellCount: 180, cellSize: [0.30, 0.55], packDensity: 0.5 },
  { z:-10.0, zh: "細胞訊息",     en: "Cellular communication",    color: "#7B3288", emissive: "#A374B8", cellCount: 160, cellSize: [0.26, 0.46], packDensity: 0.45 },
  { z:-12.5, zh: "外泌體抵達",   en: "Exosome arrival",           color: "#A374B8", emissive: "#E8B23F", cellCount: 120, cellSize: [0.18, 0.34], packDensity: 0.4 },
];

function StratumLayer({
  stratum,
  cameraZ,
  globalT,
}: {
  stratum: Stratum;
  cameraZ: number;
  globalT: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Fixed cell positions per stratum — packed within a disc
  const cells = useMemo(() => {
    const arr: { x: number; y: number; z: number; size: number; phase: number }[] = [];
    for (let i = 0; i < stratum.cellCount; i++) {
      // Polar distribution + jitter for organic packing
      const r = Math.sqrt(Math.random()) * 7 * stratum.packDensity;
      const theta = Math.random() * Math.PI * 2;
      arr.push({
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r * 0.62, // ellipse, more horizontal spread
        z: (Math.random() - 0.5) * 0.7, // slight depth jitter
        size: stratum.cellSize[0] + Math.random() * (stratum.cellSize[1] - stratum.cellSize[0]),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [stratum]);

  // Distance to camera → fade
  const distance = Math.abs(cameraZ - stratum.z);
  const opacity = THREE.MathUtils.clamp(1 - distance * 0.18, 0, 1);

  useFrame(() => {
    if (!ref.current || opacity < 0.02) return;
    cells.forEach((c, i) => {
      const breath = 0.93 + 0.07 * Math.sin(globalT * 1.2 + c.phase);
      dummy.position.set(c.x, c.y, c.z);
      dummy.scale.setScalar(c.size * breath);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    // Per-frame opacity update via material
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = opacity;
      mat.emissiveIntensity = 0.4 + opacity * 0.4;
    }
  });

  if (opacity < 0.01) return null;

  return (
    <group position={[0, 0, stratum.z]}>
      <instancedMesh ref={ref} args={[undefined, undefined, stratum.cellCount]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={stratum.color}
          emissive={stratum.emissive}
          emissiveIntensity={0.6}
          roughness={0.5}
          metalness={0.0}
          transparent
          opacity={opacity}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}

function ExosomesArrive({ cameraZ, globalT }: { cameraZ: number; globalT: number }) {
  // Activate when camera enters the deepest two strata
  const visible = cameraZ < -8;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const exosomes = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      seedX: (Math.random() - 0.5) * 9,
      seedY: -3 - Math.random() * 4,
      seedZ: -10 - Math.random() * 4,
      speed: 0.22 + Math.random() * 0.45,
      phase: i * 0.41,
      size: 0.10 + Math.random() * 0.10,
    }));
  }, []);

  useFrame(() => {
    if (!ref.current || !visible) return;
    exosomes.forEach((e, i) => {
      const t = globalT * e.speed + e.phase;
      const yLoop = ((t % 6) - 3) * 1.2; // ascending loop
      dummy.position.set(
        e.seedX + Math.sin(t * 0.8) * 0.3,
        e.seedY + yLoop,
        e.seedZ + Math.cos(t * 0.6) * 0.25
      );
      dummy.scale.setScalar(e.size);
      ref.current!.setMatrixAt(i, dummy.matrix);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, exosomes.length]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#CA8A04"
        emissive="#E8B23F"
        emissiveIntensity={1.6}
        roughness={0.3}
        metalness={0.1}
        toneMapped={false}
        transparent
        opacity={0.95}
      />
    </instancedMesh>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Camera flies *through* the strata: z = +1 → -14
    const targetZ = 1 - progress * 15;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    // Subtle x/y sway as we dive (organic feel)
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      Math.sin(progress * Math.PI * 1.5) * 0.6,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      Math.cos(progress * Math.PI * 1.0) * 0.4,
      0.05
    );
    camera.lookAt(0, 0, targetZ - 2);
  });
  return null;
}

function SkinScene({ progress }: { progress: number }) {
  const [camZ, setCamZ] = useState(1);
  const [globalT, setGlobalT] = useState(0);
  const { camera } = useThree();
  useFrame((s) => {
    setCamZ(camera.position.z);
    setGlobalT(s.clock.getElapsedTime());
  });

  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      <fog attach="fog" args={["#0A0A0D", Math.max(0.5, -camZ + 1), Math.max(8, -camZ + 8)]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, camZ + 1.5]} intensity={3} color="#F5E8C8" distance={6} />
      <pointLight position={[3, 2, camZ - 2]} intensity={2} color="#CA8A04" distance={8} />
      <pointLight position={[-3, -2, camZ - 4]} intensity={2.5} color="#7A4D8E" distance={10} />

      <CameraRig progress={progress} />

      {STRATA.map((s) => (
        <StratumLayer key={s.z} stratum={s} cameraZ={camZ} globalT={globalT} />
      ))}

      <ExosomesArrive cameraZ={camZ} globalT={globalT} />
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
            camera={{ position: [0, 0, 1], fov: 65 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Suspense fallback={null}>
              <SkinScene progress={progressVal} />
            </Suspense>
          </Canvas>
        </div>

        {/* Vignette overlay for cinematic depth */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at center, transparent 30%, rgba(10,10,13,0.6) 70%, rgba(10,10,13,0.95) 100%)",
          }}
        />

        {/* Section eyebrow */}
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

        {/* Depth meter */}
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
