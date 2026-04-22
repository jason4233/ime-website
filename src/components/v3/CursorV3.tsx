"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   CursorV3 — 朱砂磁性游標
//   一個小紅點跟隨滑鼠(spring lag),hover over 可點擊元素時
//   變成金色光暈環。手機自動不顯示。
// ═══════════════════════════════════════════════════════════════

export function CursorV3() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const xs = useSpring(x, { stiffness: 520, damping: 38, mass: 0.5 });
  const ys = useSpring(y, { stiffness: 520, damping: 38, mass: 0.5 });

  const ringX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.8 });
  const ringY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.8 });

  const [hovering, setHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHovering(
        !!t.closest("a, button, [role='button'], input, textarea, select, label")
      );
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer ring(金色,延遲跟隨) */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: hovering ? 1.5 : 1,
          opacity: hovering ? 0.9 : 0.35,
        }}
        transition={{ scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25 } }}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-leaf-gold pointer-events-none z-[99] hidden md:block"
      />
      {/* Inner dot(朱砂紅) */}
      <motion.div
        style={{ x: xs, y: ys, translateX: "-50%", translateY: "-50%", scale: hovering ? 0.5 : 1 }}
        transition={{ scale: { duration: 0.25 } }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-vermillion pointer-events-none z-[100] mix-blend-multiply hidden md:block"
        aria-hidden
      />
    </>
  );
}
