"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 動態數字計數器
function CountUp({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-display font-bold text-gold">
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 2000, suffix: " 億顆", label: "外泌體 / 每 1mL" },
  { value: 3, suffix: " 年", label: "常溫保存（凍晶型）" },
  { value: 40148, prefix: "Mono ID ", suffix: "", label: "INCI 國際原料登錄" },
];

export function ProductSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !horizontalRef.current) return;

    const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;
    const triggerElement = containerRef.current;

    const tween = gsap.to(horizontalRef.current, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: `+=${totalWidth}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === triggerElement) t.kill();
      });
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-night noise-overlay">
      {/* 裝飾 */}
      <div className="absolute top-0 left-[20%] w-px h-[20vh] bg-gradient-to-b from-brand/10 to-transparent z-10" />
      <div className="absolute bottom-0 right-[15%] w-px h-[15vh] bg-gradient-to-t from-gold/10 to-transparent z-10" />

      <div ref={horizontalRef} className="flex h-full" style={{ width: "max-content" }}>

        {/* Panel 1：產品主視覺 */}
        <div className="w-screen h-full flex items-center justify-center px-8 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl">
            {/* 左：產品圖 */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-80 md:w-80 md:h-[400px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://placehold.co/400x500/111111/B8953F?text=USC-E%0AAmpoule"
                  alt="USC-E 外泌體原液"
                  className="w-full h-full object-contain relative z-10"
                />
                {/* 光暈 */}
                <div className="absolute inset-0 -m-8 rounded-full bg-brand/5 blur-3xl" />
                <div className="absolute inset-0 -m-4 rounded-full bg-gold/5 blur-2xl" />
              </div>
            </div>

            {/* 右：文字 */}
            <div className="space-y-6">
              <p className="text-overline text-brand-light uppercase tracking-[0.25em] font-body">
                Core Product
              </p>
              <h2 className="font-serif-tc text-h2 text-ivory leading-tight">
                ExoGiov® 臍帶間質<br />幹細胞外泌體原液
              </h2>
              <p className="font-elegant italic text-lg text-gold/60">
                1mL Lyophilized Ampoule
              </p>
              <div className="w-12 h-px bg-brand/30" />
              <p className="font-sans-tc text-body-lg text-ivory/40 leading-[1.9] max-w-md">
                不是疊加一層保養，<br />
                是送一封訊息給妳的細胞。
              </p>
            </div>
          </div>
        </div>

        {/* Panel 2：數據 */}
        <div className="w-screen h-full flex items-center justify-center px-8 lg:px-20">
          <div className="max-w-4xl w-full">
            <p className="text-overline text-gold/50 uppercase tracking-[0.25em] font-body mb-12 text-center">
              By the Numbers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-8 border border-ivory/5 rounded-lg bg-ivory/[0.02]">
                  <div className="text-[clamp(2rem,4vw,3rem)] mb-3">
                    <CountUp target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <p className="font-sans-tc text-caption text-ivory/30">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 font-body text-caption text-ivory/20">
              TFDA 衛部醫器製字第 008446 號
            </p>
          </div>
        </div>

        {/* Panel 3 已移至獨立的 SkinLayers 元件 */}
      </div>
    </section>
  );
}
