"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeMolecule — Rotating Exosome Vesicle
//   - Outer "membrane" sphere with subtle distortion shader
//   - Surface markers (CD9 / CD63) as glowing instanced points
//   - Inner cargo (orbiting micro-particles)
//   - Bloom-style additive glow
// ═══════════════════════════════════════════════════════════════

const MARKER_COUNT = 180;
const CARGO_COUNT = 60;

function ExosomeMembrane() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.12;
    // Subtle pulsation
    const s = 1 + Math.sin(t * 0.6) * 0.012;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.05, 5]} />
      <meshPhysicalMaterial
        ref={matRef}
        color="#3a2840"
        roughness={0.35}
        metalness={0.05}
        transmission={0.6}
        thickness={0.8}
        ior={1.4}
        clearcoat={0.4}
        clearcoatRoughness={0.3}
        attenuationColor="#7A4D8E"
        attenuationDistance={2}
        emissive="#7A4D8E"
        emissiveIntensity={0.18}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function SurfaceMarkers() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Distribute markers on sphere via golden angle
  const positions = useMemo(() => {
    const arr: { x: number; y: number; z: number; phase: number }[] = [];
    const r = 1.08;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < MARKER_COUNT; i++) {
      const y = 1 - (i / (MARKER_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr.push({
        x: Math.cos(theta) * radius * r,
        y: y * r,
        z: Math.sin(theta) * radius * r,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    positions.forEach((p, i) => {
      // Co-rotate with membrane
      const rotY = t * 0.18;
      const rotX = Math.sin(t * 0.25) * 0.12;
      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      // Rotate around Y first, then X
      const x = p.x * cy + p.z * sy;
      let z = -p.x * sy + p.z * cy;
      let y = p.y;
      [y, z] = [y * cx - z * sx, y * sx + z * cx];

      dummy.position.set(x, y, z);
      const pulse = 0.7 + Math.sin(t * 1.4 + p.phase) * 0.3;
      dummy.scale.setScalar(0.025 * pulse);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MARKER_COUNT]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color="#E8B23F" toneMapped={false} />
    </instancedMesh>
  );
}

function CargoOrbits() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const orbits = useMemo(
    () =>
      Array.from({ length: CARGO_COUNT }, () => ({
        radius: 0.3 + Math.random() * 0.55,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        tiltX: (Math.random() - 0.5) * Math.PI,
        tiltZ: (Math.random() - 0.5) * Math.PI,
      })),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    orbits.forEach((o, i) => {
      const angle = t * o.speed + o.phase;
      let x = Math.cos(angle) * o.radius;
      let y = 0;
      let z = Math.sin(angle) * o.radius;
      // Tilt orbit plane
      const c1 = Math.cos(o.tiltX), s1 = Math.sin(o.tiltX);
      [y, z] = [y * c1 - z * s1, y * s1 + z * c1];
      const c2 = Math.cos(o.tiltZ), s2 = Math.sin(o.tiltZ);
      [x, y] = [x * c2 - y * s2, x * s2 + y * c2];

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.015);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, CARGO_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#C7E3D8" toneMapped={false} />
    </instancedMesh>
  );
}

function MoleculeScene() {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F5F0E8" />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#7A4D8E" />
      <pointLight position={[2, -1, 4]} intensity={1.0} color="#CA8A04" />

      <ExosomeMembrane />
      <SurfaceMarkers />
      <CargoOrbits />
    </>
  );
}

const SPECS = [
  { label: "Particle size", value: "76.8–99.4", unit: "nm", en: "Diameter" },
  { label: "Concentration", value: "2,000", unit: "億 / mL", en: "Vesicles" },
  { label: "Surface markers", value: "CD9 · CD63", unit: "", en: "Tetraspanins" },
  { label: "Source", value: "UC-MSC", unit: "", en: "Umbilical Mesenchymal" },
];

export function LuxeMolecule() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  // Camera-feel: parallax the 3D canvas based on scroll
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.4]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.05]);

  return (
    <section
      id="molecule"
      ref={containerRef}
      className="relative bg-luxe-bgBase py-section overflow-hidden"
    >
      {/* Decorative hairline */}
      <div className="absolute top-12 right-[14%] h-[20vh] w-px bg-gradient-to-b from-luxe-gold/35 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: 3D molecule */}
        <motion.div
          style={{ opacity: canvasOpacity, scale: canvasScale }}
          className="relative aspect-square w-full max-w-[600px] mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(202,138,4,0.18),transparent_60%)] blur-2xl" />
          <Canvas
            camera={{ position: [0, 0, 3.4], fov: 38 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Suspense fallback={null}>
              <MoleculeScene />
            </Suspense>
          </Canvas>

          {/* Annotation pins (decorative, not 3D-tied for now) */}
          <div className="absolute top-[12%] right-[10%] flex items-center gap-3 pointer-events-none">
            <div className="h-px w-12 bg-luxe-gold/50" />
            <span className="font-italic italic text-[0.7rem] tracking-[0.3em] uppercase text-luxe-gold/85">
              CD63
            </span>
          </div>
          <div className="absolute bottom-[18%] left-[6%] flex items-center gap-3 pointer-events-none">
            <span className="font-italic italic text-[0.7rem] tracking-[0.3em] uppercase text-luxe-cellLight/85">
              cargo
            </span>
            <div className="h-px w-12 bg-luxe-cellLight/50" />
          </div>
        </motion.div>

        {/* Right: spec text */}
        <div>
          <p className="font-italic italic text-luxe-gold/75 text-sm tracking-[0.45em] uppercase mb-4">
            II · The Molecule
          </p>
          <h2 className="font-serif-tc text-luxe-ivory leading-[1.2] tracking-[-0.005em] mb-6 font-medium" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
            一封寫給細胞的
            <span className="block text-luxe-ivoryDim font-light mt-1">最短的信</span>
          </h2>
          <div className="h-px w-12 bg-luxe-gold mb-8" />
          <p className="font-sans text-luxe-ivoryDim text-body-lg leading-loose font-light max-w-md mb-12">
            外泌體（Exosome）是細胞之間的「信使奈米囊泡」。
            源自臍帶間質幹細胞，攜帶蛋白、microRNA 與生長因子。
          </p>

          {/* Specs grid */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
            {SPECS.map((spec) => (
              <div key={spec.label} className="border-t border-luxe-ivory/10 pt-4">
                <dt className="font-italic italic text-luxe-gold/70 text-[0.65rem] tracking-[0.3em] uppercase mb-1">
                  {spec.en}
                </dt>
                <dd className="font-display text-luxe-ivory text-3xl md:text-4xl font-medium leading-none tracking-tight tabular-nums">
                  {spec.value}
                </dd>
                {spec.unit && (
                  <p className="font-sans text-luxe-ivoryFade text-xs mt-2 tracking-wider">
                    {spec.unit}
                  </p>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
