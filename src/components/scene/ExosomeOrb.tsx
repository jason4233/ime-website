"use client";

/**
 * ExosomeOrb — I ME 品牌主角 3D 組件
 *
 * 視覺結構（從內到外）：
 *   1. Core (發光白金核心，直徑 ~0.3)
 *   2. Membrane (主球體，紫色 iridescent，有 MeshDistortMaterial 呼吸感)
 *   3. Surface markers (~24 顆小金點，分散在球面，象徵 CD9 / CD63 標誌物)
 *   4. Aura (外圍淡紫色光環，low-opacity 大球)
 *
 * 所有旋轉 / 呼吸 / markers 閃爍都用 useFrame 在 GPU-layer 處理，React 不會重繪。
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface ExosomeOrbProps {
  /** 世界座標位置 */
  position?: [number, number, number];
  /** 整體縮放 (default 1) */
  scale?: number;
  /** 主膜顏色 (I ME 紫) */
  membraneColor?: string;
  /** 核心顏色 (I ME 金) */
  coreColor?: string;
}

export function ExosomeOrb({
  position = [0, 0, 0],
  scale = 1,
  membraneColor = "#7B2FBE",
  coreColor = "#D4B36A",
}: ExosomeOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  // Surface markers (CD9 / CD63) — 用 useMemo 只算一次，24 顆小金點均勻灑在球面
  const markers = useMemo(() => {
    const count = 24;
    const pts: [number, number, number][] = [];
    // Fibonacci 球面分佈
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      // markers 貼在膜外 0.02 的位置 (膜半徑 1)
      pts.push([x * 1.02, y * 1.02, z * 1.02]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // 整體慢速自旋
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    // 核心輕微呼吸
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }
    // Aura 反向呼吸
    if (auraRef.current) {
      const s = 1 + Math.sin(t * 0.8 + 1) * 0.12;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 外圍光暈 aura — 半透明大球 */}
      <Sphere ref={auraRef} args={[1.6, 32, 32]}>
        <meshBasicMaterial
          color={membraneColor}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </Sphere>

      {/* 主膜 — distortion material 有機呼吸感 */}
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={membraneColor}
          attach="material"
          distort={0.25}
          speed={1.2}
          roughness={0.15}
          metalness={0.6}
          transparent
          opacity={0.6}
          emissive={membraneColor}
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* 內部膜 - 稍小、顏色偏亮 */}
      <Sphere args={[0.85, 48, 48]}>
        <meshPhysicalMaterial
          color={membraneColor}
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.2}
          transmission={0.5}
          thickness={0.5}
        />
      </Sphere>

      {/* 核心 — 白金發光點 */}
      <Sphere ref={coreRef} args={[0.28, 32, 32]}>
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </Sphere>

      {/* 表面標誌物 — CD9 / CD63 小金點 */}
      {markers.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
