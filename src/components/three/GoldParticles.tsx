"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1200;
const PURPLE_RATIO = 0.2; // 20% 紫色粒子

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const { positions, velocities, sizes, opacities, colorMix } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const colorMix = new Float32Array(PARTICLE_COUNT); // 0 = 金色, 1 = 紫色

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001 + 0.0005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      sizes[i] = Math.random() * 1.2 + 0.3;
      opacities[i] = Math.random() * 0.2 + 0.05;

      // 20% 的粒子是紫色
      colorMix[i] = Math.random() < PURPLE_RATIO ? 1.0 : 0.0;
    }
    return { positions, velocities, sizes, opacities, colorMix };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;

    const mx = mouseRef.current.x * viewport.width * 0.2;
    const my = mouseRef.current.y * viewport.height * 0.2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      pos[i3] += velocities[i3] * delta * 60;
      pos[i3 + 1] += velocities[i3 + 1] * delta * 60;
      pos[i3 + 2] += velocities[i3 + 2] * delta * 60;

      const dx = mx - pos[i3];
      const dy = my - pos[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist / 6) * 0.005;
      pos[i3] += dx * force;
      pos[i3 + 1] += dy * force;

      if (pos[i3] > 10) pos[i3] = -10;
      if (pos[i3] < -10) pos[i3] = 10;
      if (pos[i3 + 1] > 7) pos[i3 + 1] = -7;
      if (pos[i3 + 1] < -7) pos[i3 + 1] = 7;
      if (pos[i3 + 2] > 6) pos[i3 + 2] = -6;
      if (pos[i3 + 2] < -6) pos[i3 + 2] = 6;
    }

    geo.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += delta * 0.015;
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uGold: { value: new THREE.Color("#B8953F") },
        uGoldLight: { value: new THREE.Color("#D4B96A") },
        uPurple: { value: new THREE.Color("#7B2FBE") },
        uPurpleLight: { value: new THREE.Color("#9B5DD4") },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        attribute float aColorMix;
        varying float vOpacity;
        varying float vCenterDist;
        varying float vColorMix;

        void main() {
          vOpacity = aOpacity;
          vColorMix = aColorMix;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          vec4 clipPos = projectionMatrix * mvPosition;
          vec2 ndc = clipPos.xy / clipPos.w;
          vCenterDist = length(ndc);

          gl_PointSize = aSize * (120.0 / -mvPosition.z);
          gl_Position = clipPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uGold;
        uniform vec3 uGoldLight;
        uniform vec3 uPurple;
        uniform vec3 uPurpleLight;
        varying float vOpacity;
        varying float vCenterDist;
        varying float vColorMix;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;

          // 中心淡化
          float centerFade = smoothstep(0.0, 0.6, vCenterDist);
          alpha *= mix(0.15, 1.0, centerFade);

          // 金色 or 紫色
          vec3 baseColor = mix(uGold, uPurple, vColorMix);
          vec3 lightColor = mix(uGoldLight, uPurpleLight, vColorMix);
          vec3 color = mix(baseColor, lightColor, smoothstep(0.35, 0.0, dist));

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, []);

  return (
    <points ref={meshRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          array={sizes}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          array={opacities}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColorMix"
          array={colorMix}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

export function GoldParticles() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
