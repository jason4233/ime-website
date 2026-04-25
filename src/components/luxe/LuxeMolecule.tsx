"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Sparkles, Trail } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeMolecule — Rotating Exosome Vesicle (Cinematic v4 — 4K Physical)
//   - Two-layer membrane: MeshTransmissionMaterial + emissive inner core
//   - Procedurally generated normal map for surface micro-detail
//   - 600 metallic gold instanced surface markers (CD9/CD63 tetraspanins)
//   - 28 emissive cargo with HDR-bright glow + 8 inner translucent vesicles
//   - HDR warehouse environment + directional key + purple back-rim
//   - Shader-driven fresnel halo (gold→purple gradient on rim)
//   - Linear depth fog for cinematic depth illusion
// ═══════════════════════════════════════════════════════════════

const MARKER_COUNT = 600;
const CARGO_COUNT = 28;
const INNER_VESICLE_COUNT = 8;

// ───────────────────────────────────────────────────────────────
// Shared shader uniforms — animated by membrane, read by halo too
// ───────────────────────────────────────────────────────────────
const sharedUniforms = {
  uTime: { value: 0 },
};

// ───────────────────────────────────────────────────────────────
// Procedural normal map — sobel-derived from random heightfield
// Adds micro-bumpiness to the membrane surface for grazing-angle highlights
// ───────────────────────────────────────────────────────────────
function useNormalMap(size = 256, strength = 1.5) {
  return useMemo(() => {
    const heightData = new Float32Array(size * size);
    for (let i = 0; i < size * size; i++) heightData[i] = Math.random();
    const normalData = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const left = heightData[y * size + Math.max(0, x - 1)];
        const right = heightData[y * size + Math.min(size - 1, x + 1)];
        const up = heightData[Math.max(0, y - 1) * size + x];
        const down = heightData[Math.min(size - 1, y + 1) * size + x];
        const dx = (right - left) * strength;
        const dy = (down - up) * strength;
        normalData[i * 4 + 0] = Math.max(0, Math.min(255, (dx * 0.5 + 0.5) * 255));
        normalData[i * 4 + 1] = Math.max(0, Math.min(255, (dy * 0.5 + 0.5) * 255));
        normalData[i * 4 + 2] = 255;
        normalData[i * 4 + 3] = 255;
      }
    }
    const tex = new THREE.DataTexture(normalData, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.needsUpdate = true;
    return tex;
  }, [size, strength]);
}

// Roughness micro-variation map — same noise tech, single channel intent
function useRoughnessMap(size = 256) {
  return useMemo(() => {
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const v = Math.floor(Math.random() * 60 + 195);
      data[i * 4 + 0] = v;
      data[i * 4 + 1] = v;
      data[i * 4 + 2] = v;
      data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.needsUpdate = true;
    return tex;
  }, [size]);
}

// ───────────────────────────────────────────────────────────────
// Membrane outer shell — translucent phospholipid bilayer
// Uses MeshTransmissionMaterial for true subsurface scattering feel.
// onBeforeCompile injects 3D simplex noise displacement so the
// silhouette has visibly bumpy rim (revealed by transmission + rim light).
// ───────────────────────────────────────────────────────────────
function ExosomeMembrane() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);

  const normalMap = useNormalMap(256, 1.6);
  const roughnessMap = useRoughnessMap(256);

  const handleBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = sharedUniforms.uTime;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `
        #include <common>
        uniform float uTime;

        // Hash-based 3D simplex noise (fast, no permutation table)
        vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        `
      )
      .replace(
        "#include <begin_vertex>",
        `
        // Two-octave noise — slow base ripple + faster surface chatter.
        // Increased base scale so silhouette bumpiness reads at grazing angles.
        float n1 = snoise(position * 1.6 + vec3(uTime * 0.18));
        float n2 = snoise(position * 3.4 - vec3(uTime * 0.32));
        float displacement = n1 * 0.055 + n2 * 0.022;
        vec3 transformed = position + normal * displacement;
        `
      );
  };

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.12;
    const s = 1 + Math.sin(t * 0.6) * 0.012;
    ref.current.scale.setScalar(s);
    sharedUniforms.uTime.value = t;
  });

  return (
    <mesh ref={ref}>
      {/* High subdivision so the noise displacement reads smoothly at silhouette */}
      <icosahedronGeometry args={[1.05, 7]} />
      {/*
        MeshTransmissionMaterial gives real subsurface scattering — light bends
        through the lipid bilayer instead of bouncing off it like solid plastic.
      */}
      <MeshTransmissionMaterial
        ref={matRef as any}
        transmission={0.85}
        thickness={0.6}
        roughness={0.22}
        ior={1.38}
        chromaticAberration={0.04}
        attenuationColor="#5C2D72"
        attenuationDistance={0.5}
        color="#A374B8"
        anisotropy={0.4}
        backside
        backsideThickness={0.18}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.4, 0.4)}
        roughnessMap={roughnessMap}
        envMapIntensity={1.2}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────
// Inner core — emissive sphere visible through the translucent membrane
// Provides the warm internal glow that sells the "carrying cargo" idea.
// ───────────────────────────────────────────────────────────────
function InnerCore() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Counter-rotate slightly so the core feels like a separate body suspended inside
    ref.current.rotation.y = -t * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.08;
    const s = 0.7 + Math.sin(t * 0.8) * 0.015;
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color="#7A4D8E"
        emissive="#C9A0E0"
        emissiveIntensity={0.85}
        roughness={0.55}
        metalness={0.1}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────
// Halo — additive fresnel-rim sphere outside membrane
// Tighter pow exponent → sharp gold-purple rim, not muddy halo
// ───────────────────────────────────────────────────────────────
function MembraneHalo() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 0.7) * 0.02;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.ShaderMaterial;
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = t;
  });

  const haloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#7A4D8E") }, // purple at center
        uColorB: { value: new THREE.Color("#E8C266") }, // gold at extreme rim
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float fres = 1.0 - max(dot(vNormal, vViewDir), 0.0);
          // Sharper rim — pow 5.5 keeps halo concentrated to silhouette
          fres = pow(fres, 5.5);
          float pulse = 0.85 + 0.15 * sin(uTime * 1.1);
          // Gold-purple ramp: purple inside, gold at extreme rim
          vec3 col = mix(uColorA, uColorB, fres);
          float alpha = fres * 0.85 * pulse;
          gl_FragColor = vec4(col * pulse, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <mesh ref={ref} material={haloMaterial}>
      <sphereGeometry args={[1.22, 64, 64]} />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────
// Surface markers — 600 metallic gold instanced spheres
// Real PBR with clearcoat → reflects HDR environment, looks like jewelry
// Per-instance: HSL color jitter, scale jitter, emissive pulse with phase
// ───────────────────────────────────────────────────────────────
function SurfaceMarkers() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorTmp = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const arr: {
      x: number;
      y: number;
      z: number;
      phase: number;
      sizeBase: number;
      hueShift: number; // small HSL hue jitter ±5° around gold
      lightShift: number;
    }[] = [];
    // Slight offset above surface so markers cast tiny ambient occlusion
    const r = 1.05 * 1.005;
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
        // Random scale 0.011–0.022 per instance (varied protein density)
        sizeBase: 0.011 + Math.random() * 0.011,
        hueShift: (Math.random() - 0.5) * (10 / 360), // ±5° hue
        lightShift: (Math.random() - 0.5) * 0.08,
      });
    }
    return arr;
  }, []);

  // Pre-compute base instance colors (gold #E8C266 with HSL jitter)
  const baseColors = useMemo(() => {
    const c = new THREE.Color();
    const hsl = { h: 0, s: 0, l: 0 };
    return positions.map((p) => {
      c.set("#E8C266");
      c.getHSL(hsl);
      const out = new THREE.Color();
      out.setHSL(
        (hsl.h + p.hueShift + 1) % 1,
        Math.min(1, hsl.s),
        Math.max(0, Math.min(1, hsl.l + p.lightShift))
      );
      return out;
    });
  }, [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const rotY = t * 0.18;
    const rotX = Math.sin(t * 0.25) * 0.12;
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const cx = Math.cos(rotX), sx = Math.sin(rotX);

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const x = p.x * cy + p.z * sy;
      let z = -p.x * sy + p.z * cy;
      let y = p.y;
      [y, z] = [y * cx - z * sx, y * sx + z * cx];

      dummy.position.set(x, y, z);
      // Emissive pulse approximated via scale shimmer (per-instance phase)
      const pulse = 0.92 + Math.sin(t * 2.1 + p.phase) * 0.18;
      dummy.scale.setScalar(p.sizeBase * pulse);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);

      // Color brightness oscillation simulates emissive flicker 0.0 → 0.4
      const flick = 0.85 + Math.sin(t * 1.7 + p.phase * 1.3) * 0.4;
      colorTmp.copy(baseColors[i]).multiplyScalar(flick);
      ref.current.setColorAt(i, colorTmp);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MARKER_COUNT]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshPhysicalMaterial
        color="#E8C266"
        metalness={0.85}
        roughness={0.18}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
        envMapIntensity={1.4}
      />
    </instancedMesh>
  );
}

// ───────────────────────────────────────────────────────────────
// One cargo particle — wrapped in <Trail> so it leaves a fading ribbon
// Uses HDR linear-space color (>1.0) so ACES tonemapping produces real bloom
// ───────────────────────────────────────────────────────────────
function CargoParticle({
  radius,
  speed,
  phase,
  tiltX,
  tiltZ,
  hue,
}: {
  radius: number;
  speed: number;
  phase: number;
  tiltX: number;
  tiltZ: number;
  hue: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  // HDR-bright cargo: gold microRNA vs pale-mint growth-factor
  // Color values >1.0 in linear space create bloom feeling under ACES
  const isGold = hue < 0.55;
  const hdrColor = useMemo(
    () => (isGold ? new THREE.Color(2.4, 1.8, 0.6) : new THREE.Color(1.4, 2.2, 1.8)),
    [isGold]
  );
  const trailColor = isGold ? "#FCD27A" : "#C7E3D8";

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const angle = t * speed + phase;
    let x = Math.cos(angle) * radius;
    let y = 0;
    let z = Math.sin(angle) * radius;
    const c1 = Math.cos(tiltX), s1 = Math.sin(tiltX);
    [y, z] = [y * c1 - z * s1, y * s1 + z * c1];
    const c2 = Math.cos(tiltZ), s2 = Math.sin(tiltZ);
    [x, y] = [x * c2 - y * s2, x * s2 + y * c2];
    ref.current.position.set(x, y, z);
  });

  return (
    <Trail
      width={0.06}
      length={14}
      color={trailColor}
      attenuation={(t) => t * t}
      decay={1.4}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color={hdrColor} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function CargoOrbits() {
  const orbits = useMemo(
    () =>
      Array.from({ length: CARGO_COUNT }, () => ({
        // Constrain to inner radius 0.55 so cargo lives clearly inside the membrane
        radius: 0.18 + Math.random() * 0.37,
        speed: 0.45 + Math.random() * 0.85,
        phase: Math.random() * Math.PI * 2,
        tiltX: (Math.random() - 0.5) * Math.PI,
        tiltZ: (Math.random() - 0.5) * Math.PI,
        hue: Math.random(),
      })),
    []
  );

  return (
    <>
      {orbits.map((o, i) => (
        <CargoParticle key={i} {...o} />
      ))}
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// Inner translucent vesicles — 8 larger spheres with subtle transmission
// They scatter the inner-core light, giving multi-layered depth
// ───────────────────────────────────────────────────────────────
function InnerVesicle({
  radius,
  speed,
  phase,
  tiltX,
  tiltZ,
  size,
}: {
  radius: number;
  speed: number;
  phase: number;
  tiltX: number;
  tiltZ: number;
  size: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const angle = t * speed + phase;
    let x = Math.cos(angle) * radius;
    let y = 0;
    let z = Math.sin(angle) * radius;
    const c1 = Math.cos(tiltX), s1 = Math.sin(tiltX);
    [y, z] = [y * c1 - z * s1, y * s1 + z * c1];
    const c2 = Math.cos(tiltZ), s2 = Math.sin(tiltZ);
    [x, y] = [x * c2 - y * s2, x * s2 + y * c2];
    ref.current.position.set(x, y, z);
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshPhysicalMaterial
        color="#D4B6E6"
        transmission={0.6}
        thickness={0.3}
        roughness={0.3}
        ior={1.3}
        transparent
        opacity={0.85}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

function InnerVesicles() {
  const vesicles = useMemo(
    () =>
      Array.from({ length: INNER_VESICLE_COUNT }, () => ({
        radius: 0.15 + Math.random() * 0.3,
        speed: 0.18 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
        tiltX: (Math.random() - 0.5) * Math.PI,
        tiltZ: (Math.random() - 0.5) * Math.PI,
        size: 0.04 + Math.random() * 0.05,
      })),
    []
  );
  return (
    <>
      {vesicles.map((v, i) => (
        <InnerVesicle key={i} {...v} />
      ))}
    </>
  );
}

// ───────────────────────────────────────────────────────────────
// Backdrop — purple-tinted radial gradient with vignette falloff
// Pulled from #0A0A0D outer to #1A0F26 inner (subtle purple tint)
// ───────────────────────────────────────────────────────────────
function BackdropDisc() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorInner: { value: new THREE.Color("#1A0F26") },
        uColorOuter: { value: new THREE.Color("#0A0A0D") },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColorInner;
        uniform vec3 uColorOuter;
        varying vec2 vUv;
        void main() {
          float d = distance(vUv, vec2(0.5));
          float breathe = 0.94 + 0.06 * sin(uTime * 0.6);
          // Smooth radial falloff with vignette
          float core = smoothstep(0.55, 0.0, d) * breathe;
          vec3 col = mix(uColorOuter, uColorInner, core);
          // Subtle gold rim glow
          float ring = smoothstep(0.5, 0.32, d) - smoothstep(0.32, 0.0, d) * 0.4;
          col += vec3(0.79, 0.54, 0.02) * ring * 0.04;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, -3]} material={material}>
      <planeGeometry args={[10, 10]} />
    </mesh>
  );
}

function MoleculeScene() {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />
      {/* Linear depth fog — front cargo bright, back details dimmed for free depth */}
      <fog attach="fog" args={["#0A0A0D", 4, 9]} />

      {/* HDR environment — gives metallic markers real reflections */}
      <Environment preset="warehouse" background={false} environmentIntensity={1.2} />

      {/* Three-point lighting: key + back rim purple + low ambient */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 2]} intensity={1.5} color="#F5F0E8" />
      <pointLight position={[-2, 0, 1.5]} intensity={0.6} color="#7A4D8E" distance={10} />

      <BackdropDisc />

      {/* Layered molecule: backdrop → inner core → vesicles → membrane → markers → halo */}
      <InnerCore />
      <InnerVesicles />
      <ExosomeMembrane />
      <SurfaceMarkers />
      <MembraneHalo />
      <CargoOrbits />

      {/* Atmospheric particles drifting around the vesicle */}
      <Sparkles
        count={120}
        scale={[5, 5, 5]}
        size={2.4}
        speed={0.18}
        opacity={0.55}
        color="#E8C266"
      />
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
            camera={{ position: [0, 0, 4], fov: 32 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
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
