"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMagneticHover } from "@/lib/hooks/useMagneticHover";

// ═══════════════════════════════════════════════════════════════
//   FloatingCTA — 漂浮「我想預約」
//   出現時機:scroll 過 Hero 後 → 進 Appointment 前
//   避免與 Hero 主 CTA 和 Appointment 終極 CTA 打架
//   位置:fixed bottom-right,magnetic hover + 金色呼吸光暈
// ═══════════════════════════════════════════════════════════════

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticHover({
    strength: 0.2,
  });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight > doc.scrollHeight - 900;
      // 過 Hero 80vh 後出現,接近 Appointment 區(底部 900px 內)隱藏
      setVisible(y > window.innerHeight * 0.85 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href="#appointment"
            className="inline-flex items-center gap-2.5 pl-4 pr-5 py-3 bg-gold text-ivory font-sans-tc font-medium text-sm tracking-wider rounded-full shadow-[0_4px_20px_-4px_rgba(184,149,63,0.55)] hover:bg-gold-dark transition-colors duration-300 animate-cta-breathe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            aria-label="跳到預約區塊"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-ivory/80 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ivory" />
            </span>
            我想預約
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
