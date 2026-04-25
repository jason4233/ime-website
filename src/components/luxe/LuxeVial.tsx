"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  Sparkles,
  Text,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeVial — Procedural 3D ampoule bottle (museum-grade)
//   實體 4K 質感:HDRI city env + MeshTransmissionMaterial 折射
//   - 真玻璃折射 (chromaticAberration / anisotropicBlur / backside)
//   - 內層液體 + 120 顆懸浮粒子 (gold motes,emissive)
//   - Knurled metal cap + 'i me' debossed text on top
//   - Reflector floor + soft halo
//   - Key (warm spot) + Rim (purple) + RectAreaLight softbox
//   - Liquid fill-up reveal (motion.group scaleY 0 → 0.93)
//   - HDR Sparkles + ACESFilmic tone mapping (no postprocessing)
// ═══════════════════════════════════════════════════════════════

const PARTICLE_COUNT = 120;
const SPARKLE_COUNT = 200;

// Liquid bounds (inner, world units): y ∈ [-0.95, 0.35], r ≤ 0.46
const LIQUID_Y_MIN = -0.95;
const LIQUID_Y_MAX = 0.35;
const LIQUID_R_MAX = 0.46;

interface AmpouleBodyProps {
  tiltMV?: MotionValue<number>;
}

function AmpouleBody({ tiltMV }: AmpouleBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidGroupRef = useRef<THREE.Group>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 懸浮粒子隨機種子(顏色微調 / 漂移)
  const particles = useMemo(() => {
    const arr: {
      r: number;
      theta: number;
      y: number;
      driftSpeed: number;
      driftPhase: number;
      driftAmpY: number;
      driftAmpXZ: number;
      brownPhase: number;
      scale: number;
      pulseSpeed: number;
      pulsePhase: number;
    }[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.sqrt(Math.random()) * (LIQUID_R_MAX - 0.02);
      arr.push({
        r,
        theta: Math.random() * Math.PI * 2,
        y: LIQUID_Y_MIN + Math.random() * (LIQUID_Y_MAX - LIQUID_Y_MIN),
        driftSpeed: 0.0015 + Math.random() * 0.0035, // y velocity 0.0015-0.005
        driftPhase: Math.random() * Math.PI * 2,
        driftAmpY: 0.012 + Math.random() * 0.022,
        driftAmpXZ: 0.008 + Math.random() * 0.018,
        brownPhase: Math.random() * Math.PI * 2,
        scale: 0.008 + Math.random() * 0.01, // 0.008–0.018
        pulseSpeed: 1.0 + Math.random() * 0.8,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  // Glass profile (lathe) — 64 segments per perf cap
  const points = useMemo(
    () =>
      [
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
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );

  // 液體輪廓 (略窄於玻璃,讓粒子顯著浮在內部)
  const liquidPoints = useMemo(
    () =>
      [
        [0, -1.42],
        [0.52, -1.42],
        [0.56, -1.38],
        [0.58, -1.0],
        [0.56, -0.5],
        [0.54, 0.28],
        [0.5, 0.5],
        [0.0, 0.5],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );

  // 玻璃材質參數 (MeshTransmissionMaterial 不支援 envMapIntensity prop,
  // 由 <Environment environmentIntensity> 主控)
  // anisotropicBlur 高,模擬厚玻璃霧化
  // attenuationColor 暖金色,液體穿透時染色

  // Liquid reveal animation — scaleY 0 → 0.93 over 1.4s after mount.
  // 用 ref 紀錄第一次 frame 的 t,避免 elapsed 受到 clock 起點干擾
  const fillStartRef = useRef<number | null>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (fillStartRef.current === null) fillStartRef.current = t;
    const elapsed = t - fillStartRef.current;

    // 緩自旋 + 滾動傾斜 + cap ±0.15 rad y
    const scrollTilt = tiltMV?.get() ?? 0;
    const cappedTilt = Math.max(-0.15, Math.min(0.15, scrollTilt));
    groupRef.current.rotation.y = t * 0.18 + cappedTilt;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    groupRef.current.rotation.x = cappedTilt * 0.35;

    // 液體填充動畫(scale.y 0→0.93,1.4s easeOut)
    if (liquidGroupRef.current) {
      const fillT = Math.min(1, Math.max(0, elapsed / 1.4));
      const eased = 1 - Math.pow(1 - fillT, 3); // easeOutCubic
      const targetY = 0.93 * eased;
      liquidGroupRef.current.scale.set(0.97, targetY, 0.97);
    }

    // 液體微小晃動
    if (liquidMeshRef.current) {
      liquidMeshRef.current.position.y = Math.sin(t * 1.2) * 0.004;
    }

    // 懸浮粒子:y drift + xz brown noise + scale pulse
    if (particlesRef.current) {
      particles.forEach((p, idx) => {
        const yOff = Math.sin(t * p.driftSpeed * 60 + p.driftPhase) * p.driftAmpY;
        const brownX = Math.sin(t * 0.35 + p.brownPhase) * Math.cos(t * 0.22 + p.brownPhase * 1.3) * p.driftAmpXZ;
        const brownZ = Math.cos(t * 0.4 + p.brownPhase * 0.8) * Math.sin(t * 0.27 + p.brownPhase) * p.driftAmpXZ;
        const angle = p.theta + Math.sin(t * 0.05 + p.driftPhase) * 0.15;
        const x = Math.cos(angle) * p.r + brownX;
        const z = Math.sin(angle) * p.r + brownZ;
        const y = p.y + yOff;
        // shimmer pulse 0.92 → 1.08
        const pulse = 0.92 + (Math.sin(t * p.pulseSpeed * 1.4 + p.pulsePhase) + 1) * 0.08;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(p.scale * pulse);
        dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(idx, dummy.matrix);
      });
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // HDR particle base color (>1 値 → ACES bloom 自然滾降)
  const particleHDRColor = useMemo(() => new THREE.Color().setRGB(2.2, 1.7, 0.85), []);

  return (
    <group ref={groupRef}>
      {/* ── 玻璃本體:MeshTransmissionMaterial ── */}
      <mesh>
        <latheGeometry args={[points, 64]} />
        <MeshTransmissionMaterial
          transmission={1.0}
          thickness={1.2}
          roughness={0.04}
          ior={1.52}
          chromaticAberration={0.06}
          anisotropicBlur={0.1}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor="#E8C266"
          attenuationDistance={0.85}
          color="#FFF8E8"
          backside
          backsideThickness={0.35}
          samples={8}
          resolution={512}
        />
      </mesh>

      {/* ── 液體(內層,scaleY 動畫)── */}
      <group ref={liquidGroupRef} position={[0, 0, 0]} scale={[0.97, 0, 0.97]}>
        <mesh ref={liquidMeshRef}>
          <latheGeometry args={[liquidPoints, 48]} />
          <meshPhysicalMaterial
            color="#C8A06D"
            transmission={0.78}
            thickness={1.6}
            ior={1.34}
            roughness={0.18}
            attenuationColor="#A77B3A"
            attenuationDistance={0.55}
            emissive="#5A3A12"
            emissiveIntensity={0.15}
            metalness={0}
            transparent
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 液面薄圓盤(meniscus)— 高反光,讓表面捕捉燈光 */}
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 48]} />
          <meshPhysicalMaterial
            color="#E8C68A"
            emissive="#E8B23F"
            emissiveIntensity={0.22}
            transmission={0.72}
            thickness={0.18}
            roughness={0.06}
            ior={1.36}
            clearcoat={1}
            clearcoatRoughness={0.04}
            metalness={0}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ── 懸浮凍晶粒子(120,glow gold motes)── */}
      <instancedMesh
        ref={particlesRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#F5D08A"
          emissive={particleHDRColor}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0}
          toneMapped={true}
        />
      </instancedMesh>

      {/* ── 金色頸環 ── */}
      <mesh position={[0, 0.92, 0]}>
        <torusGeometry args={[0.27, 0.024, 20, 64]} />
        <meshPhysicalMaterial
          color="#CA8A04"
          metalness={0.95}
          roughness={0.16}
          clearcoat={0.6}
          clearcoatRoughness={0.12}
          emissive="#CA8A04"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* ── Cap thread:6 道滾花 ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[0, 1.16 + i * 0.038, 0]}>
          <torusGeometry args={[0.218, 0.0085, 12, 56]} />
          <meshPhysicalMaterial
            color="#1A1A1F"
            metalness={0.92}
            roughness={0.28}
            clearcoat={0.4}
            clearcoatRoughness={0.18}
          />
        </mesh>
      ))}

      {/* ── Cap base 圓柱(深色合金)── */}
      <mesh position={[0, 1.43, 0]}>
        <cylinderGeometry args={[0.235, 0.218, 0.13, 48]} />
        <meshPhysicalMaterial
          color="#1A1A1F"
          metalness={0.92}
          roughness={0.28}
          clearcoat={0.4}
          clearcoatRoughness={0.18}
        />
      </mesh>

      {/* ── Cap dome 頂(更暗、更亮反射)── */}
      <mesh position={[0, 1.495, 0]}>
        <sphereGeometry args={[0.235, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshPhysicalMaterial
          color="#0F0F12"
          metalness={0.95}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* ── 'i me' debossed brand stamp on cap top ── */}
      <Text
        position={[0, 1.522, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.07}
        letterSpacing={0.05}
        color="#2A2A30"
        anchorX="center"
        anchorY="middle"
        material-toneMapped={true}
      >
        i me
      </Text>
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

      {/* HDRI 環境貼圖 — MeshTransmissionMaterial 折射的關鍵來源 */}
      <Environment preset="city" background={false} environmentIntensity={1.4} />

      <ambientLight intensity={0.12} />

      {/* Key spot — 暖金 */}
      <spotLight
        position={[3, 5, 4]}
        angle={0.4}
        penumbra={0.7}
        intensity={2.4}
        color="#FFEACD"
        castShadow
      />

      {/* Rim — 紫色背光,描出玻璃輪廓 */}
      <spotLight
        position={[-3, 2, -2]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.2}
        color="#7A4D8E"
      />

      {/* 軟箱 RectArea — 大面積白光,模擬攝影棚 */}
      <rectAreaLight
        position={[0, 4, 2]}
        width={4}
        height={1.5}
        intensity={3}
        color="#FFE9C8"
        rotation={[-Math.PI / 2.4, 0, 0]}
      />

      {/* 金色補光(下前方) */}
      <pointLight position={[2, -1, 5]} intensity={1.6} color="#CA8A04" distance={10} />

      <AmpouleBody tiltMV={tiltMV} />

      {/* 大氣 sparkles — 200 個金色 motes,HDR tint */}
      <Sparkles
        count={SPARKLE_COUNT}
        size={2}
        speed={0.2}
        scale={[1.5, 4, 1.5]}
        position={[0, 0, 0]}
        color="#F5D08A"
        opacity={0.85}
        noise={1}
      />

      {/* 反射地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.0}
          mixStrength={1.4}
          roughness={0.5}
          depthScale={0.9}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0A0A0D"
          metalness={0}
          mirror={0.55}
        />
      </mesh>

      {/* Plinth halo:柔光圓 plate(極低 opacity) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.547, 0]}>
        <ringGeometry args={[0.4, 2.4, 64]} />
        <meshBasicMaterial
          color="#E8C266"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Contact shadow */}
      <ContactShadows
        position={[0, -1.548, 0]}
        opacity={0.55}
        scale={5}
        blur={2.6}
        far={2.4}
        resolution={1024}
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
  // ±0.15 rad scroll-driven tilt
  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [-0.15, 0, 0.15]);

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
            camera={{ position: [0, 0.4, 4.2], fov: 28 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.25,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
            shadows
            onCreated={({ camera }) => {
              camera.lookAt(0, 0.1, 0);
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
