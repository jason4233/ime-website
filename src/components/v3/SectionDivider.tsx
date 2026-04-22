"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { InkSeal } from "./InkSeal";

// ═══════════════════════════════════════════════════════════════
//   SectionDivider — 儀式性章節過場
//   三種變體：
//   • seal      朱砂印章 + 雙側金線伸展
//   • goldDrop  金墨水滴 + 上下豎線從中心展開
//   • brush     墨筆一劃 clip-path reveal
// ═══════════════════════════════════════════════════════════════

type Variant = "seal" | "goldDrop" | "brush";

interface SectionDividerProps {
  variant?: Variant;
  /** 印章字（只對 seal 有效） */
  sealChar?: string;
  /** 頂部小字（英文 whisper） */
  whisper?: string;
  /** 章節編號（"壹 · 相遇" 這種） */
  chapter?: string;
  /** 背景：紙本米 or 暗茄紫 */
  tone?: "paper" | "dark";
}

export function SectionDivider({
  variant = "seal",
  sealChar = "壹",
  whisper,
  chapter,
  tone = "paper",
}: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bgClass = tone === "paper" ? "bg-paper-cream paper-texture" : "bg-aubergine-deep";
  const lineClass = tone === "paper" ? "bg-leaf-gold/55" : "bg-leaf-gold/35";
  const textSub = tone === "paper" ? "text-ink/40" : "text-paper-cream/40";
  const textChap = tone === "paper" ? "text-ink/70" : "text-paper-cream/75";

  return (
    <div
      ref={ref}
      className={`relative ${bgClass} py-28 flex flex-col items-center justify-center gap-4`}
    >
      {/* 英文 whisper */}
      {whisper && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className={`font-elegant italic text-[0.7rem] tracking-[0.45em] uppercase ${textSub} relative z-10`}
        >
          {whisper}
        </motion.p>
      )}

      {/* 主元素 */}
      <div className="relative z-10 flex items-center gap-6">
        {variant === "seal" && (
          <>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className={`w-20 h-px ${lineClass} origin-right`}
            />
            {inView && <InkSeal size={52} char={sealChar} subtitle="" delay={0.45} />}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`w-20 h-px ${lineClass} origin-left`}
            />
          </>
        )}

        {variant === "goldDrop" && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center origin-top"
          >
            <div className={`w-px h-14 bg-gradient-to-b from-transparent via-leaf-gold/60 to-leaf-gold`} />
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                boxShadow: [
                  "0 0 10px rgba(201,166,107,0.45)",
                  "0 0 20px rgba(201,166,107,0.75)",
                  "0 0 10px rgba(201,166,107,0.45)",
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-2.5 h-2.5 rounded-full bg-leaf-goldLight my-1"
            />
            <div className={`w-px h-14 bg-gradient-to-b from-leaf-gold to-transparent`} />
          </motion.div>
        )}

        {variant === "brush" && (
          <motion.svg
            viewBox="0 0 400 40"
            className="w-72 h-10"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0 0)" } : {}}
            transition={{ duration: 1.6, ease: [0.7, 0, 0.3, 1] }}
          >
            <defs>
              <linearGradient id="brushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={tone === "paper" ? "#1A1611" : "#C9A66B"} />
                <stop offset="50%" stopColor={tone === "paper" ? "#1A1611" : "#C9A66B"} />
                <stop offset="100%" stopColor={tone === "paper" ? "#3A2F22" : "#A08349"} />
              </linearGradient>
            </defs>
            <path
              d="M 15 20 Q 90 6 200 20 T 385 20"
              fill="none"
              stroke="url(#brushGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="15" cy="20" r="3.5" fill={tone === "paper" ? "#1A1611" : "#C9A66B"} />
            <circle cx="385" cy="20" r="1.2" fill={tone === "paper" ? "#1A1611" : "#C9A66B"} />
          </motion.svg>
        )}
      </div>

      {/* 章節編號 */}
      {chapter && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className={`font-serif-tc text-[0.95rem] tracking-[0.5em] ${textChap} relative z-10 mt-2`}
        >
          {chapter}
        </motion.p>
      )}
    </div>
  );
}
