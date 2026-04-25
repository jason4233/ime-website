"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  MeshReflectorMaterial,
  Sparkles,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeVial — Procedural 3D ampoule bottle (museum-grade)
//   - Lathe-extruded glass body with caustic-friendly physical mat
//   - Suspended lyophilized particles inside the serum (instancedMesh)
//   - Curved meniscus disc on liquid surface
//   - Cap thread rings + dome top
//   - MeshReflectorMaterial floor (luxury boutique feel)
//   - Atmospheric Sparkles around bottle
//   - Auto-rotation + scroll-driven tilt
// ═══════════════════════════════════════════════════════════════

const PARTICLE_COUNT = 60;

interface AmpouleBodyProps {
  tiltMV?: MotionValue<number>;
}

function AmpouleBody({ tiltMV }: AmpouleBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate suspended particle positions inside the liquid cylinder.
  // Liquid spans y ∈ [-0.95, 0.35] (centered at -0.3, height 1.3) with radius ≤ 0.5.
  const particles = useMemo(() => {
    const arr: {
      r: number;
      theta: number;
      y: number;
      driftSpeed: number;
      driftPhase: number;
      driftAmp: number;
      scale: number;
      tone: number; // 0..1, 0 = ivory, 1 = gold
    }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.sqrt(Math.random()) * 0.46;
      arr.push({
        r,
        theta: Math.random() * Math.PI * 2,
        y: -0.95 + Math.random() * 1.3,
        driftSpeed: 0.15 + Math.random() * 0.35,
        driftPhase: Math.random() * Math.PI * 2,
        driftAmp: 0.015 + Math.random() * 0.025,
        scale: 0.008 + Math.random() * 0.014,
        tone: Math.random(),
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Auto-rotation (preserved from prior version)
    groupRef.current.rotation.y = t * 0.25;
    // Subtle z wobble + scroll-driven tilt
    const scrollTilt = tiltMV?.get() ?? 0;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05 + scrollTilt;
    groupRef.current.rotation.x = scrollTilt * 0.4;

    if (liquidRef.current) {
      liquidRef.current.position.y = -0.3 + Math.sin(t * 1.2) * 0.005;
    }

    // Float the suspended particles slowly
    if (particlesRef.current) {
      particles.forEach((p, i) => {
        const yOff = Math.sin(t * p.driftSpeed + p.driftPhase) * p.driftAmp;
        const thetaOff = (t * p.driftSpeed * 0.3) + p.driftPhase;
        const x = Math.cos(p.theta + thetaOff) * p.r;
        const z = Math.sin(p.theta + thetaOff) * p.r;
        const y = p.y + yOff;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Bottle silhouette (lathe geometry) — preserved.
  const points = [
    [0, -1.5],
    [0.55, -1.5],
    [0.6, -1.45],
    [0.62, -1.0],
    [0.6, -0.5],
    [0.58, 0.3],
    [0.55, 0.7],
    [0.4, 0.95],
    [0.22, 1.05],
    [0.2, 1.4],
    [0.25, 1.5],
    [0.0, 1.5],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  // Pre-shared particle material — cheap, additive feel.
  const particleColor = useMemo(() => new THREE.Color("#F5F0E8"), []);

  return (
    <group ref={groupRef}>
      {/* Glass body */}
      <mesh>
        <latheGeometry args={[points, 96]} />
        <meshPhysicalMaterial
          color="#1a1a22"
          transmission={0.94}
          thickness={0.55}
          roughness={0.04}
          ior={1.52}
          attenuationColor="#3a2840"
          attenuationDistance={1.4}
          clearcoat={1}
          clearcoatRoughness={0.04}
          metalness={0}
          envMapIntensity={1.4}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner liquid (gold serum) — slightly inset radius so particles read as suspended */}
      <mesh ref={liquidRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.3, 64, 1]} />
        <meshPhysicalMaterial
          color="#CA8A04"
          emissive="#E8B23F"
          emissiveIntensity={0.28}
          transmission={0.55}
          thickness={1.1}
          roughness={0.18}
          ior={1.4}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Liquid surface meniscus — slightly domed disc, higher transmission */}
      <mesh position={[0, 0.355, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.55, 48, 16, 0, Math.PI * 2, 0, Math.PI / 14]} />
        <meshPhysicalMaterial
          color="#E8B23F"
          emissive="#E8B23F"
          emissiveIntensity={0.18}
          transmission={0.85}
          thickness={0.25}
          roughness={0.05}
          ior={1.36}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Suspended lyophilized particles inside liquid */}
      <instancedMesh
        ref={particlesRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={particleColor} toneMapped={false} transparent opacity={0.85} />
      </instancedMesh>

      {/* Gold neck band */}
      <mesh position={[0, 0.92, 0]}>
        <torusGeometry args={[0.27, 0.025, 20, 64]} />
        <meshStandardMaterial
          color="#CA8A04"
          metalness={0.95}
          roughness={0.16}
          emissive="#CA8A04"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Cap thread detail — 4 thin rings stacked near the neck */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.2 + i * 0.05, 0]}>
          <torusGeometry args={[0.215, 0.008, 12, 48]} />
          <meshStandardMaterial
            color="#1a1410"
            metalness={0.85}
            roughness={0.32}
          />
        </mesh>
      ))}

      {/* Cap body (dark) */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.24, 0.22, 0.12, 48]} />
        <meshStandardMaterial
          color="#0C0A09"
          metalness={0.7}
          roughness={0.28}
        />
      </mesh>

      {/* Cap dome — adds shine highlight at the top */}
      <mesh position={[0, 1.515, 0]}>
        <sphereGeometry args={[0.24, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial
          color="#1A1410"
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

interface VialSceneProps {
  tiltMV?: MotionValue<number>;
}

function VialScene({ tiltMV }: VialSceneProps) {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      {/* Studio HDR — preserved for predictable transmission/IOR look */}
      <Environment preset="studio" environmentIntensity={0.65} />

      <ambientLight intensity={0.22} />
      {/* Key light (warm) */}
      <directionalLight position={[4, 5, 4]} intensity={2.6} color="#F5E8C8" castShadow />
      {/* Top-down cap shine — extra DirectionalLight as requested */}
      <directionalLight position={[0, 8, 0.5]} intensity={1.6} color="#FFF6E0" />
      {/* Rim light (purple, behind for back-glow) */}
      <pointLight position={[-3, 1, -4]} intensity={3.5} color="#7A4D8E" distance={12} />
      {/* Gold accent fill */}
      <pointLight position={[2, -1, 5]} intensity={2.0} color="#CA8A04" distance={10} />
      {/* Top spot to lift cap */}
      <spotLight
        position={[0, 4, 2]}
        angle={0.4}
        penumbra={0.6}
        intensity={2}
        color="#F5F0E8"
        distance={8}
      />

      <AmpouleBody tiltMV={tiltMV} />

      {/* Atmospheric sparkles — gold motes around the bottle for ambient luxe */}
      <Sparkles
        count={80}
        size={2}
        speed={0.1}
        scale={[3.5, 4.5, 3.5]}
        position={[0, 0, 0]}
        color="#E8B23F"
        opacity={0.7}
      />

      {/* Reflective floor — luxury boutique surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <planeGeometry args={[14, 14]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.1}
          mixStrength={1.3}
          roughness={0.85}
          depthScale={0.9}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0A0A0D"
          metalness={0.45}
          mirror={0.4}
        />
      </mesh>

      {/* Soft contact shadow — kept on top of reflector for grounding */}
      <ContactShadows
        position={[0, -1.548, 0]}
        opacity={0.55}
        scale={5}
        blur={2.6}
        far={2.4}
        color="#000000"
      />
    </>
  );
}

interface VialProps {
  product?: {
    name?: string;
    tagline?: string;
    description?: string;
  };
}

export function LuxeVial({ product }: VialProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.2, 1, 1, 0.5]);
  // Scroll-driven tilt: ±5° (~0.087 rad) across the section
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-0.087, 0, 0.087]);

  const productName = product?.name?.split("\n")[0] ?? "USC-E SiUPi POWDER";
  const productSub = product?.name?.split("\n")[1] ?? "外泌體凍晶";
  const tagline = product?.tagline ?? "1mL Lyophilized Ampoule";

  return (
    <section
      id="vial"
      ref={containerRef}
      className="relative bg-luxe-bgBase py-section overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
        {/* Left: text */}
        <div className="lg:order-2">
          <p className="font-italic italic text-luxe-gold/75 text-sm tracking-[0.45em] uppercase mb-4">
            IV · The Vial
          </p>
          <h2 className="font-serif text-h1 text-luxe-ivory leading-[1.05] tracking-tight mb-2">
            {productName}
          </h2>
          <p className="font-display italic text-luxe-gold text-2xl md:text-3xl tracking-tight mb-6">
            {productSub}
          </p>
          <p className="font-italic italic text-luxe-ivoryFade text-sm tracking-[0.2em] mb-8">
            {tagline}
          </p>
          <div className="h-px w-12 bg-luxe-gold mb-8" />
          <p className="font-sans text-luxe-ivoryDim text-body-lg leading-loose font-light max-w-md mb-8">
            單支安瓶以 lyophilization 凍晶工藝封存活性,常溫保存三年,
            開封 90 秒內 reconstitute,分子完整無損。
          </p>
          <ul className="space-y-3">
            {[
              ["INCI", "Mono ID 40148"],
              ["TFDA", "醫器製字 008446"],
              ["Patent", "中國 ZL · 韓國 KR 1793032"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-baseline gap-4 border-t border-luxe-ivory/8 pt-3"
              >
                <span className="font-italic italic text-luxe-gold/70 text-[0.7rem] tracking-[0.3em] uppercase w-20">
                  {k}
                </span>
                <span className="font-sans text-luxe-ivoryDim text-sm tracking-wide">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: 3D ampoule */}
        <motion.div
          style={{ opacity: canvasOpacity }}
          className="lg:order-1 relative aspect-[3/4] w-full max-w-[520px] mx-auto"
        >
          {/* Spotlight backdrop */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(202,138,4,0.2),transparent_60%)] blur-3xl" />
          <Canvas
            camera={{ position: [0, 0, 7], fov: 28 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
            }}
          >
            <Suspense fallback={null}>
              <VialScene tiltMV={tilt} />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
