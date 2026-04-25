"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeVial — Procedural 3D ampoule bottle
//   Pure Three.js geometry (no GLB needed) — extruded silhouette
//   Scroll-linked rotation + tilt-to-look
// ═══════════════════════════════════════════════════════════════

function AmpouleBody() {
  const ref = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    if (liquidRef.current) {
      // Subtle liquid level wobble
      liquidRef.current.position.y = -0.3 + Math.sin(t * 1.2) * 0.005;
    }
  });

  // Build the bottle silhouette (lathe geometry)
  const points = [
    [0, -1.5],   // bottom center
    [0.55, -1.5],
    [0.6, -1.45],
    [0.62, -1.0],
    [0.6, -0.5],
    [0.58, 0.3],
    [0.55, 0.7],
    [0.4, 0.95],
    [0.22, 1.05],
    [0.2, 1.4],
    [0.25, 1.5],  // cap rim
    [0.0, 1.5],
  ].map(([x, y]) => new THREE.Vector2(x, y));

  return (
    <group ref={ref}>
      {/* Glass body */}
      <mesh>
        <latheGeometry args={[points, 64]} />
        <meshPhysicalMaterial
          color="#1a1a22"
          transmission={0.92}
          thickness={0.5}
          roughness={0.05}
          ior={1.52}
          attenuationColor="#3a2840"
          attenuationDistance={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0}
          envMapIntensity={1.2}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner liquid (gold serum) */}
      <mesh ref={liquidRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.3, 48, 1]} />
        <meshPhysicalMaterial
          color="#CA8A04"
          emissive="#E8B23F"
          emissiveIntensity={0.3}
          transmission={0.5}
          thickness={1}
          roughness={0.15}
          ior={1.4}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Gold neck band */}
      <mesh position={[0, 0.92, 0]}>
        <torusGeometry args={[0.27, 0.025, 16, 48]} />
        <meshStandardMaterial
          color="#CA8A04"
          metalness={0.95}
          roughness={0.18}
          emissive="#CA8A04"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cap top */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.24, 0.22, 0.12, 32]} />
        <meshStandardMaterial
          color="#0C0A09"
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function VialScene() {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      {/* Studio HDR — gives glass real reflections, transmission caustics, and depth */}
      <Environment preset="studio" environmentIntensity={0.6} />

      <ambientLight intensity={0.25} />
      {/* Key light (warm) */}
      <directionalLight position={[4, 5, 4]} intensity={2.5} color="#F5E8C8" castShadow />
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

      <AmpouleBody />

      {/* Soft contact shadow under the bottle */}
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.6}
        scale={5}
        blur={2.4}
        far={2}
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
            單支安瓶以 lyophilization 凍晶工藝封存活性，常溫保存三年，
            開封 90 秒內 reconstitute，分子完整無損。
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
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <VialScene />
            </Suspense>
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
