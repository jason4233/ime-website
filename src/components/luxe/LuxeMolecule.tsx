"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Trail } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════════════════
//   LuxeMolecule — Rotating Exosome Vesicle (Cinematic v3)
//   - Displacement-shader membrane (procedural noise ripple)
//   - Layered halo glow (additive sphere outside membrane)
//   - 350 instanced surface markers with color-varied pulse
//   - Cargo orbits with shimmer trails (drei <Trail>)
//   - HDR warehouse environment for PBR reflections
//   - Sparkles ambient particles + radial backdrop disc
// ═══════════════════════════════════════════════════════════════

const MARKER_COUNT = 350;
const CARGO_COUNT = 18; // fewer cargo so each can have a Trail

// ───────────────────────────────────────────────────────────────
// Shared shader uniforms — animated by membrane, read by halo too
// ───────────────────────────────────────────────────────────────
const sharedUniforms = {
  uTime: { value: 0 },
};

// ───────────────────────────────────────────────────────────────
// Membrane — physical glass with procedural displacement ripple
// ───────────────────────────────────────────────────────────────
function ExosomeMembrane() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const shaderRef = useRef<{ uniforms: { uTime: { value: number } } } | null>(null);

  // Inject custom displacement noise into MeshPhysicalMaterial via onBeforeCompile.
  // Classic 3D simplex-style noise → displaces along vertex normal.
  const handleBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = sharedUniforms.uTime;
    shaderRef.current = shader;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `
        #include <common>
        uniform float uTime;

        // Hash-based 3D noise (fast, no permutation table)
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
        // Two-octave noise — slow base ripple + faster detail
        float n1 = snoise(position * 1.6 + vec3(uTime * 0.18));
        float n2 = snoise(position * 3.4 - vec3(uTime * 0.32));
        float displacement = n1 * 0.05 + n2 * 0.018;
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
      {/* Higher subdivision so noise displacement reads smoothly */}
      <icosahedronGeometry args={[1.05, 7]} />
      <meshPhysicalMaterial
        ref={matRef}
        color="#3a2840"
        roughness={0.3}
        metalness={0.05}
        transmission={0.65}
        thickness={0.85}
        ior={1.42}
        clearcoat={0.55}
        clearcoatRoughness={0.25}
        attenuationColor="#7A4D8E"
        attenuationDistance={2}
        emissive="#7A4D8E"
        emissiveIntensity={0.22}
        envMapIntensity={1.1}
        transparent
        opacity={0.88}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  );
}

// ───────────────────────────────────────────────────────────────
// Halo — additive transparent sphere outside membrane (volumetric feel)
// ───────────────────────────────────────────────────────────────
function MembraneHalo() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    // Breathe: subtle scale + opacity oscillation
    const s = 1 + Math.sin(t * 0.7) * 0.02;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.ShaderMaterial;
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = t;
  });

  // Custom fresnel-rim shader so halo is hot at silhouette, faint at center
  const haloMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#A374B8") },
        uColorB: { value: new THREE.Color("#E8B23F") },
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
          fres = pow(fres, 2.4);
          float pulse = 0.85 + 0.15 * sin(uTime * 1.1);
          vec3 col = mix(uColorA, uColorB, fres);
          float alpha = fres * 0.55 * pulse;
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
// Surface markers — 350 instanced spheres with pulse + color variation
// Color is animated per-instance via instanceColor attribute
// ───────────────────────────────────────────────────────────────
function SurfaceMarkers() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorTmp = useMemo(() => new THREE.Color(), []);

  // Three "stops" we'll lerp between for color variation
  const colA = useMemo(() => new THREE.Color("#E8B23F"), []); // gold
  const colB = useMemo(() => new THREE.Color("#CA8A04"), []); // amber
  const colC = useMemo(() => new THREE.Color("#A374B8"), []); // soft magenta

  const positions = useMemo(() => {
    const arr: {
      x: number;
      y: number;
      z: number;
      phase: number;
      sizeBase: number;
      colorPhase: number;
    }[] = [];
    const r = 1.085;
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
        // Varied marker sizes (most small, a few large "feature" tetraspanins)
        sizeBase: 0.018 + Math.pow(Math.random(), 3) * 0.024,
        colorPhase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

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
      // Dramatic pulse: wider amplitude than before
      const pulse = 0.55 + Math.sin(t * 1.6 + p.phase) * 0.55;
      dummy.scale.setScalar(p.sizeBase * pulse);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);

      // Color variation — blend gold ↔ amber ↔ magenta with phase offset
      const k = 0.5 + 0.5 * Math.sin(t * 0.9 + p.colorPhase);
      // Three-way mix using two lerps
      const k2 = 0.5 + 0.5 * Math.sin(t * 0.55 + p.colorPhase * 1.7);
      colorTmp.copy(colA).lerp(colB, k);
      // Light magenta tint on a fraction of cycle
      colorTmp.lerp(colC, k2 * 0.18);
      ref.current.setColorAt(i, colorTmp);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, MARKER_COUNT]}>
      <sphereGeometry args={[1, 14, 14]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// ───────────────────────────────────────────────────────────────
// One cargo particle — wrapped in <Trail> so it leaves a fading ribbon
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
  // Alternating cargo color: most pale-mint, some warm-gold (microRNA vs growth-factor visual cue)
  const color = hue < 0.5 ? "#C7E3D8" : "#E8B23F";

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
      width={0.08}
      length={3.2}
      color={color}
      attenuation={(t) => t * t}
      decay={1.6}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function CargoOrbits() {
  const orbits = useMemo(
    () =>
      Array.from({ length: CARGO_COUNT }, () => ({
        radius: 0.32 + Math.random() * 0.55,
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
// Backdrop — radial gold disc behind the molecule (custom shader)
// ───────────────────────────────────────────────────────────────
function BackdropDisc() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#CA8A04") },
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
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float d = distance(vUv, vec2(0.5));
          // Soft radial falloff with subtle breathing
          float breathe = 0.92 + 0.08 * sin(uTime * 0.6);
          float core = smoothstep(0.5, 0.0, d) * breathe;
          // Faint outer glow ring
          float ring = smoothstep(0.5, 0.32, d) - smoothstep(0.32, 0.0, d) * 0.4;
          float alpha = core * 0.55 + ring * 0.08;
          gl_FragColor = vec4(uColor * (0.6 + core * 0.6), alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, -3]} material={material}>
      <planeGeometry args={[8, 8]} />
    </mesh>
  );
}

function MoleculeScene() {
  return (
    <>
      <color attach="background" args={["#0A0A0D"]} />

      {/* HDR environment for PBR reflections on the membrane */}
      <Environment preset="warehouse" environmentIntensity={0.45} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#F5F0E8" />
      <pointLight position={[-3, -2, 2]} intensity={1.4} color="#7A4D8E" distance={10} />
      <pointLight position={[2, -1, 4]} intensity={1.1} color="#CA8A04" distance={10} />

      {/* Backdrop glow disc (z = -3) */}
      <BackdropDisc />

      {/* The molecule */}
      <ExosomeMembrane />
      <MembraneHalo />
      <SurfaceMarkers />
      <CargoOrbits />

      {/* Atmospheric particles drifting around the vesicle */}
      <Sparkles
        count={150}
        scale={[5, 5, 5]}
        size={3}
        speed={0.2}
        opacity={0.7}
        color="#E8B23F"
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
