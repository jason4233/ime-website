"use client";

import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   InkSeal — 朱砂印章
//   載入時像真印章壓下去：旋轉到位 + scale 收縮 + opacity 湧現
//   背景用 feTurbulence 做印泥顆粒感,不是純色
// ═══════════════════════════════════════════════════════════════

interface InkSealProps {
  size?: number;
  /** 印章中央的字,例:泌、壹、貳、參、肆、伍 */
  char?: string;
  /** 下方小字,例:I·ME */
  subtitle?: string;
  /** 進場延遲(秒) */
  delay?: number;
  /** 如果 hoverRotate 則 hover 時會像蓋章般稍微旋轉 */
  hoverRotate?: boolean;
  className?: string;
}

export function InkSeal({
  size = 72,
  char = "泌",
  subtitle = "I·ME",
  delay = 0,
  hoverRotate = false,
  className = "",
}: InkSealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.55, rotate: -7 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.3, 1.4, 0.5, 1],
      }}
      whileHover={hoverRotate ? { rotate: 3, scale: 1.04 } : {}}
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center bg-vermillion"
        style={{
          backgroundImage: `
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><filter id='ink'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23ink)'/></svg>"),
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 55%)
          `,
          backgroundBlendMode: "overlay, normal",
          borderRadius: "3px",
          boxShadow:
            "0 2px 10px rgba(164,44,46,0.32), inset 0 1px 2px rgba(255,255,255,0.12)",
        }}
      >
        {/* 邊角磨損感 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 2px rgba(164,44,46,0.55), inset 0 0 10px rgba(0,0,0,0.22)",
            borderRadius: "3px",
          }}
        />

        <div className="relative z-10 text-center leading-none select-none">
          <div
            className="font-serif-tc text-paper-cream font-bold"
            style={{ fontSize: size * 0.42, letterSpacing: "0.02em" }}
          >
            {char}
          </div>
          {subtitle && (
            <div
              className="text-paper-cream/75 tracking-[0.2em] font-sans-tc mt-1"
              style={{ fontSize: Math.max(size * 0.12, 8) }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
