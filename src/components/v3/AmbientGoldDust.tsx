"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
//   AmbientGoldDust — 全站背景持續漂浮的金塵
//   • Canvas 30 顆小點,緩慢往上飄
//   • 滑鼠靠近會被推開(repel)
//   • 低 opacity,不干擾閱讀
//   • z-[3],所有 section 共享(覺得是同一個網站的氛圍線索)
// ═══════════════════════════════════════════════════════════════

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  base: number;
}

export function AmbientGoldDust({ count = 30 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Spawn dots
    dotsRef.current = Array.from({ length: count }, () => {
      const r = 0.6 + Math.random() * 1.4;
      const base = 0.22 + Math.random() * 0.38;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.12 - Math.random() * 0.15, // 整體向上飄
        r,
        alpha: base,
        base,
      };
    });

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const d of dotsRef.current) {
        // mouse repel
        const dx = d.x - mouseRef.current.x;
        const dy = d.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          d.x += (dx / dist) * force * 1.2;
          d.y += (dy / dist) * force * 1.2;
        }

        d.x += d.vx;
        d.y += d.vy;

        // wrap (bottom to top)
        if (d.y < -10) {
          d.y = h + 10;
          d.x = Math.random() * w;
        }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;

        // subtle twinkle
        d.alpha = d.base + Math.sin(Date.now() * 0.001 + d.x * 0.01) * 0.12;

        ctx.beginPath();
        ctx.fillStyle = `rgba(201, 164, 107, ${Math.max(0, d.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(230, 207, 160, 0.55)";
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[3] opacity-70"
    />
  );
}
