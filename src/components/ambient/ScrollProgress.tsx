"use client";

/**
 * ScrollProgress — 頂部金色細線，隨 scroll 拉長
 * 用 scroll 驅動 scaleX transform（GPU accelerated、不會 reflow）
 */

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[70] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left will-change-transform transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          background:
            "linear-gradient(to right, transparent 0%, #D4B36A 15%, #E6C77A 50%, #D4B36A 85%, transparent 100%)",
          boxShadow: "0 0 8px rgba(212, 179, 106, 0.6)",
        }}
      />
    </div>
  );
}
