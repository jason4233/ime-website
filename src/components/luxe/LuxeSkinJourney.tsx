"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeSkinJourney — Scroll-linked camera dive
//   Camera Z translates from far → close while passing skin "strata"
//   Each stratum is a translucent plane with cell-like noise texture
// ═══════════════════════════════════════════════════════════════

const STRATA = [
  { z: 0,   color: "#E8D5C2", label: "Stratum corneum",  zh: "角質層" },
  { z: -2,  color: "#D8B896", label: "Epidermis",         zh: "表皮" },
  { z: -4,  color: "#A87A61", label: "Dermal-epidermal junction", zh: "真皮交界" },
  { z: -6,  color: "#7A4D5E", label: "Dermis · Capillaries", zh: "真皮 · 微血管" },
  { z: -8,  color: "#3a2840", label: "Cellular communication", zh: "細胞訊息" },
  { z: -10, color: "#7A4D8E", label: "Exosome arrival",   zh: "外泌體抵達" },
];

function CellTexture({ color, opacity }: { color: string; opacity: number }) {
  // Procedural cell-like points on a plane (each "stratum")
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return arr;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.getElapsedTime() * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function SkinStratum({
  z,
  color,
  cameraZ,
}: {
  z: number;
  color: string;
  cameraZ: number;
}) {
  // Distance to camera → opacity fade in/out
  // Wider falloff so strata are visible across a longer scroll range
  const distance = Math.abs(cameraZ - z);
  const opacity = THREE.MathUtils.clamp(1 - distance * 0.18, 0, 0.95);

  return (
    <group position={[0, 0, z]}>
      {/* Translucent plane (larger, fills viewport) */}
      <mesh>
        <planeGeometry args={[24, 24, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity * 0.5}
          side={THREE.DoubleSide}
          roughness={0.6}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Cell-like points */}
      <CellTexture color={color} opacity={opacity * 0.9} />
    </group>
  );
}

function ExosomeDescent({ cameraZ }: { cameraZ: number }) {
  // Show exosomes only in deep layers
  const visible = cameraZ < -3;
  const ref = useRef<THREE.Group>(null);

  const exosomes = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 6 + 2,
        z: -3 - Math.random() * 7,
        speed: 0.3 + Math.random() * 0.5,
        scale: 0.06 + Math.random() * 0.08,
      })),
    []
  );

  useFrame((s, delta) => {
    if (!ref.current || !visible) return;
    ref.current.children.forEach((c, i) => {
      const ex = exosomes[i];
      c.position.y -= delta * ex.speed * 0.5;
      if (c.position.y < -4) c.position.y = 4;
      c.rotation.y += delta * 0.4;
    });
  });

  if (!visible) return null;

  return (
    <group ref={ref}>
      {exosomes.map((e, i) => (
        <mesh key={i} position={[e.x, e.y, e.z]} scale={e.scale}>
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial
            color="#7A4D8E"
            emissive="#A374B8"
            emissiveIntensity={0.5}
            transmission={0.5}
            roughness={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  useFrame(() => {
    // Camera flies *through* the strata — start just in front of stratum 0
    // and dive past stratum 5 (z=-10). Range: z=1 → z=-11.
    const targetZ = 1 - progress * 12;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.lookAt(0, 0, targetZ - 2);
  });
  return null;
}

function SkinScene({ progress }: { progress: number }) {
  // Track current camera z for stratum fade calc
  const [camZ, setCamZ] = useState(1);
  const { camera } = useThree();
  useFrame(() => setCamZ(camera.position.z));

  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      <ambientLight intensity={0.3} />
      <pointLight
        position={[0, 0, camZ + 1]}
        intensity={1.4}
        color="#F5F0E8"
        distance={6}
      />
      <pointLight
        position={[2, 2, camZ - 3]}
        intensity={1.0}
        color="#CA8A04"
        distance={6}
      />

      <CameraRig progress={progress} />

      {STRATA.map((s) => (
        <SkinStratum key={s.z} z={s.z} color={s.color} cameraZ={camZ} />
      ))}

      <ExosomeDescent cameraZ={camZ} />
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

  // Active stratum index
  const activeIdx = Math.min(
    STRATA.length - 1,
    Math.floor(progressVal * STRATA.length)
  );

  return (
    <section
      id="skin"
      ref={containerRef}
      className="relative bg-luxe-bgBase"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D canvas (full screen) */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 1], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <SkinScene progress={progressVal} />
            </Suspense>
          </Canvas>
        </div>

        {/* Atmospheric vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0D_85%)]"
        />

        {/* Top: section label */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <p className="font-italic italic text-luxe-gold/70 text-sm tracking-[0.5em] uppercase">
            III · Skin Journey
          </p>
        </div>

        {/* Bottom: active stratum label (animates between layers) */}
        <div className="absolute bottom-20 left-0 right-0 z-20 px-6 text-center pointer-events-none">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <p className="font-italic italic text-luxe-ivoryFade text-[0.7rem] tracking-[0.4em] uppercase">
              {STRATA[activeIdx].label}
            </p>
            <h3 className="font-serif text-luxe-ivory text-3xl md:text-5xl font-medium tracking-tight">
              {STRATA[activeIdx].zh}
            </h3>
          </motion.div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {STRATA.map((_, i) => (
              <span
                key={i}
                className={`block h-px transition-all duration-700 ${
                  i === activeIdx
                    ? "w-12 bg-luxe-gold"
                    : i < activeIdx
                    ? "w-6 bg-luxe-gold/40"
                    : "w-6 bg-luxe-ivory/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: progress percent */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
          <div className="flex flex-col items-end gap-2">
            <span className="font-display italic text-luxe-gold text-5xl font-medium tabular-nums leading-none">
              {String(Math.round(progressVal * 100)).padStart(2, "0")}
            </span>
            <span className="font-italic italic text-luxe-ivoryFade text-[0.65rem] tracking-[0.4em] uppercase">
              depth
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
