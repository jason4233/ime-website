"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type CursorVariant = "default" | "link" | "text";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 行動裝置不顯示
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input[type='submit']")
      ) {
        setVariant("link");
      } else if (
        target.closest("p") ||
        target.closest("h1") ||
        target.closest("h2") ||
        target.closest("h3") ||
        target.closest("h4") ||
        target.closest("span") ||
        target.closest("blockquote")
      ) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    // 隱藏系統游標
    document.documentElement.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      document.documentElement.style.cursor = "";
    };
  }, [visible]);

  // 行動裝置直接不渲染
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const ringSize = variant === "link" ? 48 : variant === "text" ? 4 : 28;
  const ringHeight = variant === "text" ? 24 : ringSize;
  const ringBorder = variant === "link" ? "border-brand/40" : "border-ivory/15";
  const dotOpacity = variant === "text" ? 0 : 1;

  return (
    <>
      {/* 小圓點 — 即時跟隨 */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: visible ? dotOpacity : 0,
          willChange: "transform",
        }}
      >
        <div className="w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ivory" />
      </div>

      {/* 外圈 — 延遲跟隨 */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          opacity: visible ? 1 : 0,
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringHeight,
            borderRadius: variant === "text" ? 2 : ringSize / 2,
          }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`-translate-x-1/2 -translate-y-1/2 border ${ringBorder} transition-colors duration-200`}
          style={{
            backgroundColor: variant === "text" ? "rgba(123,47,190,0.3)" : "transparent",
          }}
        />
      </motion.div>

      {/* 全站隱藏系統游標 */}
      <style jsx global>{`
        *, *::before, *::after {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          *, *::before, *::after {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
