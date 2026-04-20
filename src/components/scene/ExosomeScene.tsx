"use client";

/**
 * ExosomeScene — 全站共用的 R3F Canvas
 *
 * 架構：
 *   - Canvas 以 `fixed inset-0` 釘在整頁背景 (z-index = 0)
 *   - HTML sections 疊在 z-10 以上，背景用 transparent 讓 orb 穿透
 *   - Choreographer 用 window.scrollY 算進度 → 平滑補間 orb 位置/縮放
 *   - 不用 drei ScrollControls (會接管滾動),不用 GSAP pin (之前 crash 元兇)
 *
 * Phase 1 只做 Hero 與 BrandStory 過渡的 keyframes,證明架構能跑。
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { ExosomeOrb } from "./ExosomeOrb";

// ============================================================
// Keyframe timeline — 滾動進度 → orb 的 (x, y, z, scale)
// progress 是 0..1 的全頁滾動進度
// ============================================================
interface Keyframe {
  p: number; // progress 0..1
  pos: [number, number, number];
  scale: number;
}

// Phase 1 先定義簡單的 4 段旅程
// 座標系統: x 右為正, y 上為正, z 靠相機為正
const KEYFRAMES: Keyframe[] = [
  { p: 0.0,  pos: [0,    0,   0], scale: 1.0 },   // Hero 中央
  { p: 0.08, pos: [0,    -1,  0], scale: 1.1 },   // 滑到 Hero 底 (略下沉)
  { p: 0.15, pos: [2,    -2,  0], scale: 0.7 },   // BrandStory 進入,右下
  { p: 0.25, pos: [-2,   -2,  0], scale: 0.7 },   // 左下 (第 2 幕)
  { p: 0.33, pos: [0,    -2,  -1], scale: 1.2 },  // 第 3 幕回中間, 退遠
  { p: 0.45, pos: [3,    -1,  0], scale: 0.8 },   // Founder 區貼右邊
  { p: 0.60, pos: [0,    0,   2], scale: 2.2 },   // Product 區放大 zoom-in
  { p: 0.75, pos: [0,    -3,  0], scale: 1.0 },   // SkinLayers 下降
  { p: 0.90, pos: [0,    0,   0], scale: 1.3 },   // 回中放大收尾
  { p: 1.0,  pos: [0,    0,   0], scale: 1.5 },
];

// 線性插值
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// easeInOutCubic — 給位置補間用,動感更自然
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 根據 progress 找出當前在哪兩個 keyframe 之間,補間出 pos/scale
function interpolate(progress: number): { pos: [number, number, number]; scale: number } {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (p >= a.p && p <= b.p) {
      const local = (p - a.p) / (b.p - a.p);
      const eased = easeInOutCubic(local);
      return {
        pos: [
          lerp(a.pos[0], b.pos[0], eased),
          lerp(a.pos[1], b.pos[1], eased),
          lerp(a.pos[2], b.pos[2], eased),
        ],
        scale: lerp(a.scale, b.scale, eased),
      };
    }
  }
  return { pos: KEYFRAMES[KEYFRAMES.length - 1].pos, scale: KEYFRAMES[KEYFRAMES.length - 1].scale };
}

// ============================================================
// Choreographer — 訂閱 scrollProgress 驅動 orb
// ============================================================
function Choreographer({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const orbGroupRef = useRef<THREE.Group>(null);
  // 用 ref 暫存目標值,在 useFrame 平滑補間到目標 (避免 scroll 抖動)
  const target = useRef({ pos: [0, 0, 0] as [number, number, number], scale: 1 });
  const current = useRef({ pos: [0, 0, 0] as [number, number, number], scale: 1 });

  useFrame(() => {
    const { pos, scale } = interpolate(progressRef.current);
    target.current = { pos, scale };

    // 平滑補間 — 每幀往目標靠近 10% (damp)
    const damp = 0.08;
    current.current.pos[0] = lerp(current.current.pos[0], target.current.pos[0], damp);
    current.current.pos[1] = lerp(current.current.pos[1], target.current.pos[1], damp);
    current.current.pos[2] = lerp(current.current.pos[2], target.current.pos[2], damp);
    current.current.scale = lerp(current.current.scale, target.current.scale, damp);

    if (orbGroupRef.current) {
      orbGroupRef.current.position.set(
        current.current.pos[0],
        current.current.pos[1],
        current.current.pos[2]
      );
      orbGroupRef.current.scale.setScalar(current.current.scale);
    }
  });

  return (
    <group ref={orbGroupRef}>
      <ExosomeOrb />
    </group>
  );
}

// ============================================================
// Main Scene — 掛 fixed 背景
// ============================================================
export function ExosomeScene() {
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const onScroll = () => {
      // 全頁滾動進度 0..1
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!ready) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        {/* 主光 — 略暖白 */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[3, 5, 5]}
          intensity={1.2}
          color="#FFF5E8"
        />
        {/* 紫色 rim light 從後方打亮膜邊緣 */}
        <pointLight position={[-4, -2, -3]} intensity={1.5} color="#9B5DD4" />
        {/* 金色 fill light */}
        <pointLight position={[4, 2, 2]} intensity={0.8} color="#D4B36A" />

        <Choreographer progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
