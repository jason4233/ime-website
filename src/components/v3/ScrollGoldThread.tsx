"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   ScrollGoldThread — 左緣金線,scroll 進度時一點一滴垂下
//   漸變:leaf-gold → vermillion → leaf-goldDeep,象徵儀式從金到朱砂
// ═══════════════════════════════════════════════════════════════

export function ScrollGoldThread() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <>
      {/* 左緣金線 */}
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="fixed left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-leaf-gold via-vermillion to-leaf-goldDeep origin-top z-[45] hidden md:block"
      />
      {/* 底部金珠 —— scroll 進度結束時浮現 */}
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="fixed left-0 top-0 origin-top pointer-events-none z-[45] h-screen hidden md:block"
      >
        <div className="absolute bottom-0 -left-[4px] w-[10px] h-[10px] rounded-full bg-leaf-gold shadow-[0_0_12px_rgba(201,164,107,0.8)]" />
      </motion.div>
    </>
  );
}
