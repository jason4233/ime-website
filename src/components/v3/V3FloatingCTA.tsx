"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════
//   V3FloatingCTA — 朱砂漂浮「我想預約」
//   與 v2 不同: 朱砂方按鈕 + 金絲內邊 + ping dot
//   Scroll 過 Hero 後浮現,接近 Appointment 前隱藏
// ═══════════════════════════════════════════════════════════════

export function V3FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight > doc.scrollHeight - 1200;
      setVisible(y > window.innerHeight * 0.9 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ duration: 0.55, ease: [0.3, 1.4, 0.5, 1] }}
          className="fixed bottom-6 right-6 z-40"
        >
          <a
            href="#appointment"
            className="group relative inline-flex items-center gap-2.5 pl-4 pr-5 py-3.5 bg-vermillion text-paper-cream font-serif-tc text-sm tracking-[0.3em] shadow-[0_4px_24px_-4px_rgba(184,50,44,0.55)] hover:bg-vermillion-dark transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermillion focus-visible:ring-offset-2 focus-visible:ring-offset-paper-cream"
            style={{ borderRadius: "2px" }}
            aria-label="跳到預約區塊"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-paper-cream/85 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-paper-cream" />
            </span>
            我想預約
            <span
              aria-hidden
              className="absolute inset-[3px] border border-leaf-gold/40 pointer-events-none"
              style={{ borderRadius: "1px" }}
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
