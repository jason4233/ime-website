"use client";

// Hero Particles — 基於 magicui/particles 架構擴充
// 差異：加入 3D z 深度 → 透視縮放 + 霧化光暈 + 滑鼠控消失點
//
// 每顆粒子有 (x, y, z)：
//   - z 從 1.0 (近) 逐漸增加到 maxZ (遠)，到極限後 respawn
//   - 渲染尺寸 = baseSize * (1 / z) → 越遠越小
//   - 渲染 alpha = (1 - z/maxZ) → 越遠越淡
//   - dx/dy 指向「消失點」，消失點 = 畫布中心 + 滑鼠偏移
//
// 用 shadowBlur 做霧化光暈，給每顆粒子 gold 或 purple 隨機顏色。

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface HeroParticlesProps {
  className?: string;
  /** 粒子總數 */
  quantity?: number;
  /** 基礎尺寸 (px)，實際尺寸會因 z 透視縮放 */
  baseSize?: number;
  /** 往遠處飛的速度 (z 每 frame 增加量) */
  speed?: number;
  /** 兩種顏色（金/紫）交替 */
  colorA?: string;
  colorB?: string;
  /** 最大 z，越大粒子飛越遠才 respawn */
  maxZ?: number;
  /** 滑鼠對消失點的影響強度 (0-1)，越大消失點會跟滑鼠越多 */
  mouseInfluence?: number;
  /** 光暈模糊半徑 (px)，讓粒子霧化 */
  glow?: number;
}

interface Particle {
  x: number;     // 世界座標，不直接渲染
  y: number;
  z: number;     // 1 (近) → maxZ (遠)
  baseSize: number;
  color: string;
  alphaTarget: number;
}

export function HeroParticles({
  className = "",
  quantity = 140,
  baseSize = 2.2,
  speed = 0.006,
  colorA = "#B8953F",
  colorB = "#9B5DD4",
  maxZ = 4,
  mouseInfluence = 0.35,
  glow = 12,
}: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [dpr, setDpr] = useState(1);

  // 初始化單一粒子（spawn 在近處）
  const spawnParticle = (isInitial = false): Particle => {
    const { w, h } = sizeRef.current;
    return {
      // 以螢幕中心為原點，隨機散佈到約 ±50% 範圍
      x: (Math.random() - 0.5) * w,
      y: (Math.random() - 0.5) * h,
      // 初始 z：如果是首次 spawn 均勻分佈 1~maxZ；如果是 respawn 回到近處
      z: isInitial ? 1 + Math.random() * (maxZ - 1) : 1 + Math.random() * 0.3,
      baseSize: baseSize * (0.6 + Math.random() * 0.8),
      color: Math.random() < 0.55 ? colorA : colorB,
      alphaTarget: 0.5 + Math.random() * 0.4,
    };
  };

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize 處理
    const resize = () => {
      sizeRef.current.w = container.offsetWidth;
      sizeRef.current.h = container.offsetHeight;
      canvas.width = sizeRef.current.w * dpr;
      canvas.height = sizeRef.current.h * dpr;
      canvas.style.width = `${sizeRef.current.w}px`;
      canvas.style.height = `${sizeRef.current.h}px`;
      ctx.scale(dpr, dpr);
      // 重新 spawn 粒子
      particlesRef.current = Array.from({ length: quantity }, () => spawnParticle(true));
    };

    // 滑鼠位置（相對畫布中心，值範圍約 -1 到 1）
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = sizeRef.current;
      mouseRef.current.x = ((e.clientX - rect.left) / w - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / h - 0.5) * 2;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    // 動畫循環
    let raf = 0;
    const render = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      // 消失點：畫布中心 + 滑鼠偏移
      const vpX = mouseRef.current.x * (w / 2) * mouseInfluence;
      const vpY = mouseRef.current.y * (h / 2) * mouseInfluence;

      particlesRef.current.forEach((p, i) => {
        // 1) 粒子往消失點方向移動（xy 飄向 vp，越近飄得越慢）
        const invZ = 1 / p.z;
        p.x += (vpX - p.x) * 0.002 * invZ;
        p.y += (vpY - p.y) * 0.002 * invZ;

        // 2) z 往遠處增加（飛走）
        p.z += speed;

        // 3) 飛到極限 → respawn 近處
        if (p.z > maxZ) {
          particlesRef.current[i] = spawnParticle(false);
          return;
        }

        // 4) 透視投影：越遠越靠近螢幕中心
        const perspective = 1 / p.z;
        const screenX = w / 2 + (p.x - vpX) * perspective + vpX;
        const screenY = h / 2 + (p.y - vpY) * perspective + vpY;

        // 5) 透視縮放：越遠越小
        const renderSize = p.baseSize * perspective;

        // 6) Alpha 淡出：越遠越淡
        const fade = 1 - p.z / maxZ;
        const alpha = p.alphaTarget * fade;

        // 7) 繪製粒子（含霧化光暈）
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = glow * perspective;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, renderSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dpr, quantity, baseSize, speed, colorA, colorB, maxZ, mouseInfluence, glow]);

  return (
    <div ref={containerRef} className={cn("pointer-events-none", className)} aria-hidden>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
