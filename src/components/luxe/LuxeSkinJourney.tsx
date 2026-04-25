"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Trail } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeSkinJourney — Cinematic 3D dive through 6 skin strata
//
//   Upgrade pass (4K physical feel):
//   - meshPhysicalMaterial (transmission/clearcoat) on cells for
//     subsurface translucency.
//   - Per-cell nucleus (second instanced mesh, emissive purple).
//   - Per-stratum biological tints (corneum ivory → hypodermis plum).
//   - Volumetric atmosphere: fog + warehouse env + god-ray planes.
//   - Exosomes: 120 total, top 40 with drei <Trail> ribbons.
//   - Dual-layer dust (front bright / back dim) for parallax depth.
// ═══════════════════════════════════════════════════════════════

// Stratum: zh/en label + biological body tint + emissive accent + flatten ratio
const STRATA = [
  // 角質層 — ivory beige, very flat squamous
  { zh: "角質層",      en: "Stratum corneum",            tint: "#F0E2D6", emissive: "#E8B07F", flatten: 0.30 },
  // 顆粒層 — pinkish
  { zh: "顆粒層",      en: "Stratum granulosum",         tint: "#F2D4C8", emissive: "#D89C82", flatten: 0.55 },
  // 棘層 — fleshy
  { zh: "棘層",        en: "Stratum spinosum",           tint: "#E8B8AA", emissive: "#C28066", flatten: 0.85 },
  // 基底層 — pink-rose
  { zh: "基底層",      en: "Stratum basale",             tint: "#D898A2", emissive: "#A85A4F", flatten: 1.00 },
  // 真皮 — deeper rose
  { zh: "真皮層",      en: "Dermis",                     tint: "#C77A8A", emissive: "#8B3A5C", flatten: 1.15 },
  // 皮下 — plum
  { zh: "皮下組織",    en: "Hypodermis",                 tint: "#A8606A", emissive: "#7A4D8E", flatten: 1.30 },
] as const;

// Tunnel geometry
const TUNNEL_Z_START = 2;
const TUNNEL_Z_END = -15;
const TUNNEL_LENGTH = TUNNEL_Z_START - TUNNEL_Z_END; // 17
const STRATUM_THICKNESS = TUNNEL_LENGTH / STRATA.length; // ~2.83
const TUBE_RADIUS = 3.2;

const CELLS_PER_STRATUM = 420;
const TOTAL_CELLS = CELLS_PER_STRATUM * STRATA.length; // 2520
const DUST_FRONT_COUNT = 1500;
const DUST_BACK_COUNT = 3500;
const EXOSOME_INSTANCED = 80;
const EXOSOME_TRAILED = 40;
// EXOSOME_TOTAL = 120 (instanced + trailed)

// ───────────────────────────────────────────────────────────────
//   CellTissue — body + nucleus, two instanced meshes per stratum
//   Body: meshPhysicalMaterial (transmission ~ cytoplasm)
//   Nucleus: 0.35x emissive purple sphere offset slightly
// ───────────────────────────────────────────────────────────────
type CellData = {
  x: number;
  y: number;
  z: number;
  baseScale: number;
  flatten: number;
  nucleusOffsetX: number;
  nucleusOffsetZ: number;
  phase: number;
  driftAmp: number;
  colorR: number;
  colorG: number;
  colorB: number;
};

function CellTissue() {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const nucleusRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Pre-compute per-cell static data
  const cells = useMemo<CellData[]>(() => {
    const arr: CellData[] = [];

    for (let s = 0; s < STRATA.length; s++) {
      const zCenter = TUNNEL_Z_START - (s + 0.5) * STRATUM_THICKNESS;
      const baseColor = new THREE.Color(STRATA[s].tint);
      const flatten = STRATA[s].flatten;

      for (let i = 0; i < CELLS_PER_STRATUM; i++) {
        const zJitter = (Math.random() - 0.5) * STRATUM_THICKNESS * 1.05;
        const z = zCenter + zJitter;

        // Tube cross-section, dense outer ring (camera path stays clear-ish)
        const r = 0.45 + Math.sqrt(Math.random()) * (TUBE_RADIUS - 0.45);
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;

        // Cell base size by stratum biology
        const sizeProfile =
          s === 0 ? 0.06 + Math.random() * 0.05 :
          s === 1 ? 0.07 + Math.random() * 0.06 :
          s === 2 ? 0.08 + Math.random() * 0.07 :
          s === 3 ? 0.09 + Math.random() * 0.08 :
          s === 4 ? 0.10 + Math.random() * 0.09 :
                    0.11 + Math.random() * 0.10;

        // HSL jitter ±4% hue, ±8% lightness — natural variation
        const hueShift = (Math.random() - 0.5) * 0.08;       // 0.04 each side
        const lightShift = (Math.random() - 0.5) * 0.16;     // 0.08 each side
        tmpColor.copy(baseColor).offsetHSL(hueShift, 0, lightShift);

        const baseScale = sizeProfile;
        const nucleusOffsetX = (Math.random() - 0.5) * baseScale * 0.3;
        const nucleusOffsetZ = (Math.random() - 0.5) * baseScale * 0.3;

        arr.push({
          x,
          y,
          z,
          baseScale,
          flatten,
          nucleusOffsetX,
          nucleusOffsetZ,
          phase: Math.random() * Math.PI * 2,
          driftAmp: 0.015 + Math.random() * 0.035,
          colorR: tmpColor.r,
          colorG: tmpColor.g,
          colorB: tmpColor.b,
        });
      }
    }
    return arr;
  }, [tmpColor]);

  // One-time per-instance color upload (body only — nucleus is uniform purple)
  useEffect(() => {
    if (!bodyRef.current) return;
    cells.forEach((c, i) => {
      tmpColor.setRGB(c.colorR, c.colorG, c.colorB);
      bodyRef.current!.setColorAt(i, tmpColor);
    });
    if (bodyRef.current.instanceColor) {
      bodyRef.current.instanceColor.needsUpdate = true;
    }
  }, [cells, tmpColor]);

  // Per-frame: breathing scale + lateral drift; sync nucleus
  useFrame((state) => {
    if (!bodyRef.current || !nucleusRef.current) return;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const pulse = 1 + Math.sin(t * 0.7 + c.phase) * 0.14;
      const scale = c.baseScale * pulse;

      const dx = Math.sin(t * 0.4 + c.phase * 1.3) * c.driftAmp;
      const dy = Math.cos(t * 0.3 + c.phase * 0.9) * c.driftAmp;

      // Body — flattened along z (squamous shape)
      dummy.position.set(c.x + dx, c.y + dy, c.z);
      dummy.scale.set(scale, scale, scale * c.flatten);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);

      // Nucleus — 0.35x scale, slight offset
      const nScale = scale * 0.35;
      dummy.position.set(
        c.x + dx + c.nucleusOffsetX,
        c.y + dy,
        c.z + c.nucleusOffsetZ
      );
      dummy.scale.set(nScale, nScale, nScale);
      dummy.updateMatrix();
      nucleusRef.current.setMatrixAt(i, dummy.matrix);
    }
    bodyRef.current.instanceMatrix.needsUpdate = true;
    nucleusRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Cell body — translucent cytoplasm */}
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, TOTAL_CELLS]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 16, 12]} />
        <meshPhysicalMaterial
          vertexColors
          transmission={0.55}
          thickness={0.4}
          roughness={0.45}
          ior={1.36}
          clearcoat={0.3}
          clearcoatRoughness={0.7}
          envMapIntensity={0.9}
          attenuationColor={"#F2D4C8" as any}
          attenuationDistance={0.3}
          transparent
          opacity={0.95}
        />
      </instancedMesh>

      {/* Nucleus — emissive purple, gives interior structure */}
      <instancedMesh
        ref={nucleusRef}
        args={[undefined, undefined, TOTAL_CELLS]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial
          color={"#3F1F4F" as any}
          emissive={"#7A4D8E" as any}
          emissiveIntensity={0.3}
          roughness={0.6}
          metalness={0.0}
        />
      </instancedMesh>
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   ParticleDust (split front / back for parallax)
// ───────────────────────────────────────────────────────────────
function ParticleDust({
  count,
  baseSize,
  brightness,
  speed,
  opacity,
}: {
  count: number;
  baseSize: number;
  brightness: number;
  speed: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const z = TUNNEL_Z_START - Math.random() * TUNNEL_LENGTH;
      const stratumIdx = Math.min(
        STRATA.length - 1,
        Math.max(0, Math.floor((TUNNEL_Z_START - z) / STRATUM_THICKNESS))
      );
      const baseColor = new THREE.Color(STRATA[stratumIdx].emissive);

      const r = Math.sqrt(Math.random()) * (TUBE_RADIUS + 0.4);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = z;

      // HDR-warm dust
      colors[i * 3] = baseColor.r * brightness + 0.12;
      colors[i * 3 + 1] = baseColor.g * brightness + 0.10;
      colors[i * 3 + 2] = baseColor.b * brightness + 0.08;
    }
    return { positions, colors };
  }, [count, brightness]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += delta * speed;
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
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={baseSize * 0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// ───────────────────────────────────────────────────────────────
//   GodRays — 3 transparent radial-gradient planes at strata
//   boundaries, slowly sweeping. Fakes shafts of light through tissue.
// ───────────────────────────────────────────────────────────────
function GodRays() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate radial-gradient texture once
  const rayTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, "rgba(255,228,184,1)");
    grad.addColorStop(0.4, "rgba(255,180,140,0.5)");
    grad.addColorStop(1, "rgba(255,180,140,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = t * 0.05 * (i % 2 === 0 ? 1 : -1) + i * 0.4;
    });
  });

  return (
    <group ref={groupRef}>
      {[1.5, 3.5, 5.5].map((offset, i) => {
        const z = TUNNEL_Z_START - offset * STRATUM_THICKNESS;
        return (
          <mesh key={i} position={[0, 0, z]} rotation={[0, 0, i * 0.7]}>
            <planeGeometry args={[TUBE_RADIUS * 3, TUBE_RADIUS * 3]} />
            <meshBasicMaterial
              map={rayTexture}
              transparent
              opacity={0.06}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ───────────────────────────────────────────────────────────────
//   StratumMembranes — 6 thin translucent rings
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
              opacity={0.05}
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
//   TrailedExosome — single drei <Trail>+mesh, animated rise + sway
// ───────────────────────────────────────────────────────────────
function TrailedExosome({
  seed,
}: {
  seed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const data = useMemo(() => {
    const rng = (k: number) => {
      const x = Math.sin(seed * 12.9898 + k * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const r = Math.sqrt(rng(1)) * 2.4;
    const theta = rng(2) * Math.PI * 2;
    return {
      x: Math.cos(theta) * r,
      z: TUNNEL_Z_END + 1 + rng(3) * 4,
      yStart: -3.5 - rng(4) * 2.5,
      riseSpeed: 0.18 + rng(5) * 0.32,
      sway: 0.06 + rng(6) * 0.10,
      phase: rng(7) * Math.PI * 2,
      scale: 0.07 + rng(8) * 0.07,
    };
  }, [seed]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const mesh = meshRef.current;

    // Y advances; wrap when high
    let y = mesh.position.y;
    y += delta * data.riseSpeed;
    if (y > 4) y = data.yStart;

    const swayX = Math.sin(t * 0.6 + data.phase) * data.sway;
    const swayZ = Math.cos(t * 0.4 + data.phase) * data.sway * 0.6;

    mesh.position.set(data.x + swayX, y, data.z + swayZ);
    const pulse = 1 + Math.sin(t * 1.2 + data.phase) * 0.18;
    mesh.scale.setScalar(data.scale * pulse);
  });

  return (
    <Trail
      width={0.03}
      length={8}
      color={"#FCD27A" as any}
      attenuation={(w) => w * w}
    >
      <mesh ref={meshRef} position={[data.x, data.yStart, data.z]}>
        <sphereGeometry args={[1, 18, 14]} />
        <meshPhysicalMaterial
          transmission={0.7}
          thickness={0.4}
          ior={1.4}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.04}
          attenuationColor={"#FFA94D" as any}
          attenuationDistance={0.4}
          color={"#FFE6B0" as any}
          emissive={"#FFC36A" as any}
          emissiveIntensity={0.45}
          envMapIntensity={1.8}
          toneMapped={false}
        />
      </mesh>
    </Trail>
  );
}

// ───────────────────────────────────────────────────────────────
//   ExosomesAscent — 80 instanced (cheap) + 40 trailed (premium)
// ───────────────────────────────────────────────────────────────
function ExosomesAscent({ progress }: { progress: number }) {
  const visible = progress > 0.55;
  const instRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const goldA = useMemo(() => new THREE.Color("#FFE6B0"), []);
  const goldB = useMemo(() => new THREE.Color("#FFA94D"), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const exosomes = useMemo(() => {
    return Array.from({ length: EXOSOME_INSTANCED }, () => {
      const r = Math.sqrt(Math.random()) * 2.4;
      const theta = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(theta) * r,
        y: -3.5 - Math.random() * 2.5,
        z: TUNNEL_Z_END + 1 + Math.random() * 4,
        riseSpeed: 0.18 + Math.random() * 0.32,
        sway: 0.05 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.07,
        colorMix: Math.random(),
      };
    });
  }, []);

  // Trail seeds — stable across renders
  const trailSeeds = useMemo(
    () => Array.from({ length: EXOSOME_TRAILED }, (_, i) => i + 7),
    []
  );

  useEffect(() => {
    if (!instRef.current) return;
    exosomes.forEach((e, i) => {
      tmpColor.copy(goldA).lerp(goldB, e.colorMix * 0.6).multiplyScalar(1.6);
      instRef.current!.setColorAt(i, tmpColor);
    });
    if (instRef.current.instanceColor) {
      instRef.current.instanceColor.needsUpdate = true;
    }
  }, [exosomes, goldA, goldB, tmpColor]);

  useFrame((state, delta) => {
    if (!instRef.current) return;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < exosomes.length; i++) {
      const e = exosomes[i];
      e.y += delta * e.riseSpeed;
      if (e.y > 4) e.y = -4;

      const swayX = Math.sin(t * 0.6 + e.phase) * e.sway;
      const swayZ = Math.cos(t * 0.4 + e.phase) * e.sway * 0.5;
      const pulse = 1 + Math.sin(t * 1.2 + e.phase) * 0.22;

      dummy.position.set(e.x + swayX, e.y, e.z + swayZ);
      dummy.scale.setScalar(e.scale * pulse);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(i, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <>
      {/* 80 instanced exosomes — cheap glassy spheres */}
      <instancedMesh
        ref={instRef}
        args={[undefined, undefined, EXOSOME_INSTANCED]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 16, 14]} />
        <meshPhysicalMaterial
          vertexColors
          transmission={0.7}
          thickness={0.4}
          ior={1.4}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor={"#FFA94D" as any}
          attenuationDistance={0.4}
          emissive={"#FFC36A" as any}
          emissiveIntensity={0.4}
          envMapIntensity={1.6}
          toneMapped={false}
        />
      </instancedMesh>

      {/* 40 premium trailed exosomes — drei <Trail> ribbons */}
      {trailSeeds.map((s) => (
        <TrailedExosome key={s} seed={s} />
      ))}
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   CameraRig — scroll-driven dive
// ───────────────────────────────────────────────────────────────
function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const targetZ = TUNNEL_Z_START - progress * (TUNNEL_LENGTH - 1.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.09);

    // Cinematic sway + tiny z-jitter for parallax-DOF feel
    const t = state.clock.getElapsedTime();
    const jitterZ = Math.sin(t * 0.7) * 0.02;

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
    camera.position.z += jitterZ * 0.1;

    camera.lookAt(
      Math.sin(progress * Math.PI * 1.6) * 0.4,
      Math.cos(progress * Math.PI * 1.1) * 0.3,
      camera.position.z - 2.2
    );

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
      intensity={3.0}
      distance={6}
      decay={1.6}
      color={"#FFE4B8" as any}
    />
  );
}

// ───────────────────────────────────────────────────────────────
//   StratumLights — active + next colored point lights
// ───────────────────────────────────────────────────────────────
function StratumLights({ progress }: { progress: number }) {
  const activeIdx = Math.min(
    STRATA.length - 1,
    Math.floor(progress * STRATA.length)
  );
  const nextIdx = Math.min(STRATA.length - 1, activeIdx + 1);

  return (
    <>
      <pointLight
        position={[0, 0, TUNNEL_Z_START - (activeIdx + 0.5) * STRATUM_THICKNESS]}
        intensity={1.4}
        color={STRATA[activeIdx].emissive}
        distance={5}
        decay={1.8}
      />
      <pointLight
        position={[0, 0, TUNNEL_Z_START - (nextIdx + 0.5) * STRATUM_THICKNESS]}
        intensity={0.8}
        color={STRATA[nextIdx].emissive}
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
      <color attach="background" args={["#0A0506"]} />
      <fog attach="fog" args={["#0A0506", 3, 14]} />

      <Environment
        preset="warehouse"
        background={false}
        environmentIntensity={0.55}
      />

      <ambientLight intensity={0.2} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={0.85}
        color={"#FFE9C8" as any}
      />
      <pointLight
        position={[-3, -2, -1]}
        intensity={0.4}
        color={"#7A4D8E" as any}
      />

      <CameraRig progress={progress} />
      <StratumLights progress={progress} />

      <StratumMembranes />
      <GodRays />
      <CellTissue />
      <ParticleDust
        count={DUST_BACK_COUNT}
        baseSize={0.7}
        brightness={0.9}
        speed={0.14}
        opacity={0.55}
      />
      <ParticleDust
        count={DUST_FRONT_COUNT}
        baseSize={1.4}
        brightness={1.5}
        speed={0.22}
        opacity={0.85}
      />
      <ExosomesAscent progress={progress} />
    </>
  );
}

// ───────────────────────────────────────────────────────────────
//   Reduced-motion poster
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
          "#0A0506",
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
              camera={{ position: [0, 0, TUNNEL_Z_START], fov: 28 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
                outputColorSpace: THREE.SRGBColorSpace,
                powerPreference: "high-performance",
              }}
            >
              <Suspense fallback={null}>
                <SkinScene progress={progressVal} />
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Soft cinematic vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 95% 95% at center, transparent 65%, rgba(10,5,6,0.6) 100%)",
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
