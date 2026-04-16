"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const layers = [
  {
    id: 0,
    name: "表皮層",
    en: "Epidermis",
    effects: ["提亮", "細緻", "保濕重建"],
    color: "#B8953F",
    bgGradient: "linear-gradient(180deg, #F5E6C8 0%, #E8D5AD 100%)",
  },
  {
    id: 1,
    name: "真皮層",
    en: "Dermis",
    effects: ["膠原訊號喚醒", "彈潤還原"],
    color: "#7B2FBE",
    bgGradient: "linear-gradient(180deg, #E8C4BA 0%, #D4A89B 100%)",
  },
  {
    id: 2,
    name: "屏障層",
    en: "Barrier",
    effects: ["穩定紅敏", "修復乾受損"],
    color: "#D4A89B",
    bgGradient: "linear-gradient(180deg, #D4A89B 0%, #C4918A 100%)",
  },
];

export function SkinLayers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState(-1); // -1 = 全部蓋住

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${window.innerHeight * 3.5}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        if (p < 0.15) setActiveLayer(-1);      // 全蓋住
        else if (p < 0.4) setActiveLayer(0);    // 掀開表皮 → 露出表皮功效
        else if (p < 0.65) setActiveLayer(1);   // 掀開表皮+真皮 → 露出真皮功效
        else setActiveLayer(2);                  // 全掀 → 露出屏障功效
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-night"
    >
      {/* 標題 */}
      <motion.div
        className="absolute top-[8%] left-0 right-0 text-center z-30 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: activeLayer >= 0 ? 0.3 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-overline text-brand-light/60 uppercase tracking-[0.25em] font-body mb-3">
          Three-Layer Delivery
        </p>
        <h3 className="font-serif-tc text-h2 text-ivory">
          三層修復，層層精準
        </h3>
        <p className="font-sans-tc text-body text-ivory/30 mt-3 max-w-md mx-auto">
          不是疊加一層保養，是送一封訊息給妳的細胞。
        </p>
      </motion.div>

      {/* 皮膚層視覺 — 中央 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[340px] h-[420px] md:w-[420px] md:h-[500px]">

          {/* 底層（屏障層）— 永遠在最底 */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ background: layers[2].bgGradient }}
          >
            <div className="absolute inset-0 flex items-end justify-center pb-12 px-6">
              <motion.div
                className="text-center"
                animate={{ opacity: activeLayer >= 2 ? 1 : 0, y: activeLayer >= 2 ? 0 : 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-overline tracking-[0.2em] mb-2" style={{ color: layers[2].color }}>
                  {layers[2].en}
                </p>
                <h4 className="font-serif-tc text-2xl text-night font-semibold mb-3">
                  {layers[2].name}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {layers[2].effects.map((e) => (
                    <span key={e} className="px-3 py-1 text-xs font-body rounded-full border"
                      style={{ borderColor: `${layers[2].color}40`, color: layers[2].color }}>
                      {e}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* 中層（真皮層）— 第二層掀開 */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden origin-top"
            style={{ background: layers[1].bgGradient }}
            animate={
              activeLayer >= 2
                ? { rotateX: -75, y: -60, opacity: 0.3, scale: 0.9 }
                : { rotateX: 0, y: 0, opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 掀開時的陰影 */}
            <motion.div
              className="absolute inset-0 bg-black/0"
              animate={{ backgroundColor: activeLayer >= 2 ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <motion.div
                className="text-center"
                animate={{ opacity: activeLayer === 1 ? 1 : 0, y: activeLayer === 1 ? 0 : 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-overline tracking-[0.2em] mb-2" style={{ color: layers[1].color }}>
                  {layers[1].en}
                </p>
                <h4 className="font-serif-tc text-2xl text-night font-semibold mb-3">
                  {layers[1].name}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {layers[1].effects.map((e) => (
                    <span key={e} className="px-3 py-1 text-xs font-body rounded-full border"
                      style={{ borderColor: `${layers[1].color}40`, color: layers[1].color }}>
                      {e}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* 上層（表皮層）— 第一層掀開 */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden origin-top"
            style={{ background: layers[0].bgGradient }}
            animate={
              activeLayer >= 1
                ? { rotateX: -70, y: -80, opacity: 0.2, scale: 0.85 }
                : { rotateX: 0, y: 0, opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-black/0"
              animate={{ backgroundColor: activeLayer >= 1 ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)" }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <motion.div
                className="text-center"
                animate={{ opacity: activeLayer === 0 || activeLayer === -1 ? 1 : 0, y: activeLayer <= 0 ? 0 : 20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-overline tracking-[0.2em] mb-2" style={{ color: layers[0].color }}>
                  {layers[0].en}
                </p>
                <h4 className="font-serif-tc text-2xl text-night font-semibold mb-3">
                  {layers[0].name}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {layers[0].effects.map((e) => (
                    <span key={e} className="px-3 py-1 text-xs font-body rounded-full border"
                      style={{ borderColor: `${layers[0].color}40`, color: layers[0].color }}>
                      {e}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 初始狀態 — 未滾動時的封面 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F5E6C8] to-[#E8D5AD]"
              animate={{ opacity: activeLayer === -1 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-2xl">↓</span>
                </div>
                <p className="font-serif-tc text-xl text-night/60">
                  滾動，掀開妳的肌膚
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* 透視效果：3D perspective */}
          <style jsx>{`
            div { perspective: 800px; }
          `}</style>
        </div>
      </div>

      {/* 左右文字指示 */}
      <div className="absolute left-6 lg:left-16 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              animate={{
                opacity: activeLayer === i ? 1 : 0.15,
                x: activeLayer === i ? 0 : -8,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeLayer === i ? layer.color : "rgba(255,255,255,0.15)",
                  boxShadow: activeLayer === i ? `0 0 12px ${layer.color}40` : "none",
                }}
              />
              <span className="font-sans-tc text-caption text-ivory hidden md:block">
                {layer.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 滾動進度 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <motion.p
          className="font-elegant italic text-[0.6rem] text-ivory/20 tracking-[0.2em]"
          animate={{ opacity: activeLayer < 2 ? 1 : 0 }}
        >
          keep scrolling
        </motion.p>
      </div>
    </section>
  );
}
