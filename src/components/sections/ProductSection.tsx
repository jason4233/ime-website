"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { stripFocalPoint, urlToObjectPosition } from "@/lib/utils/focal-point";

// 改版：移除 GSAP ScrollTrigger pin（DOM 突變導致 React insertBefore 崩潰）
// 改用 CSS position:sticky + 原生 scroll progress 驅動 translateX，實現水平滾動效果

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

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ProductSectionProps {
  // CMS 產品陣列，第一筆用於主視覺 panel
  data?: any[];
}

export function ProductSection({ data }: ProductSectionProps = {}) {
  // 取第一筆為主打產品；DB 沒資料就用硬編 fallback
  const main = data && data.length > 0 ? data[0] : null;
  const productName = main?.name ?? "ExoGiov® 臍帶間質幹細胞外泌體原液";
  const productTagline = main?.tagline ?? "1mL Lyophilized Ampoule";
  const productDesc =
    main?.description ?? "不是疊加一層保養,\n是送一封訊息給妳的細胞。";
  // 圖片優先順序:gallery 第一張(後台拖拉排序的主圖) → imageUrl(向下相容) → placeholder
  const productImage =
    (main?.gallery && main.gallery.length > 0 ? main.gallery[0] : null) ??
    main?.imageUrl ??
    "https://placehold.co/400x500/111111/B8953F?text=USC-E%0AAmpoule";

  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1, -rect.top / total));
      setProgress(raw);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 水平位移 = progress × (內容寬度 - 視窗寬度) ≈ progress × 100vw (2 panel)
  // 用 100vw 當總 offset (1 panel 寬度)
  const translateX = `-${progress * 100}vw`;

  return (
    // 外層 200vh 提供 1 panel 寬度的滾動距離
    <div ref={outerRef} style={{ height: "200vh" }} className="relative">
      <section className="sticky top-0 h-screen overflow-hidden bg-deep-purple noise-overlay">
        {/* 裝飾 */}
        <div className="absolute top-0 left-[20%] w-px h-[20vh] bg-gradient-to-b from-brand/10 to-transparent z-10" />
        <div className="absolute bottom-0 right-[15%] w-px h-[15vh] bg-gradient-to-t from-gold/10 to-transparent z-10" />

        <div
          className="flex h-full"
          style={{ width: "200vw", transform: `translateX(${translateX})`, willChange: "transform" }}
        >
          {/* Panel 1：產品主視覺 */}
          <div className="w-screen h-full flex items-center justify-center px-8 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl">
              {/* 左：產品圖 */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-64 h-80 md:w-80 md:h-[400px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stripFocalPoint(productImage)}
                    alt={productName}
                    className="w-full h-full object-contain relative z-10"
                    style={{ objectPosition: urlToObjectPosition(productImage) }}
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
                <h2 className="font-serif-tc text-h2 text-ivory leading-tight whitespace-pre-line">
                  {productName}
                </h2>
                <p className="font-elegant italic text-lg text-gold/60">
                  {productTagline}
                </p>
                <div className="w-12 h-px bg-brand/30" />
                <p className="font-sans-tc text-body-lg text-ivory/40 leading-[1.9] max-w-md whitespace-pre-line">
                  {productDesc}
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
        </div>
      </section>
    </div>
  );
}
