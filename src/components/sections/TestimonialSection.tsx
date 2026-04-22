"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

const testimonials = [
  {
    id: 1,
    name: "L 小姐",
    age: 34,
    role: "上班族",
    course: "泌容術｜初次體驗",
    month: "2025 年 3 月",
    rating: 5,
    content: [
      "我一開始是完全不相信的，以為又是那種聽起來很炫、擦起來沒感覺的東西。",
      "做完幾次之後，發現這段保養時間變成我每週最期待的儀式。",
      "原來認真對待自己這件事，會讓整個人的底氣慢慢長回來。",
    ],
  },
  {
    id: 2,
    name: "H 小姐",
    age: 42,
    role: "兩個孩子的媽",
    course: "深度抗老療程",
    month: "2025 年 1 月",
    rating: 5,
    content: [
      "生完第二個之後我幾乎三年沒有看過自己。",
      "走進工作室那一刻，第一次有人問我「妳今天累不累」。",
      "原來我需要的不只是保養，是被好好對待的那個感覺。",
    ],
  },
  {
    id: 3,
    name: "J 小姐",
    age: 29,
    role: "保養新手",
    course: "煥膚修護療程",
    month: "2025 年 5 月",
    rating: 5,
    content: [
      "我以前覺得保養好麻煩，買了一堆東西都用不完。",
      "在這裡才發現，原來保養可以這麼簡單而專注。",
      "現在每次來都像給自己一個放假的小時，這比什麼都珍貴。",
    ],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-gold" : "text-ivory/10"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialSection() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const item = testimonials[active];

  return (
    <section ref={ref} className="py-section-lg bg-deep-rose relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-[18%] w-px h-[25vh] bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="absolute bottom-0 right-[22%] w-px h-[15vh] bg-gradient-to-t from-gold/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* 標題 */}
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand-light uppercase tracking-[0.25em] font-body mb-4">
              Testimonials
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory">
              她們的皮膚，自己說話
            </h2>
          </TextReveal>
        </div>

        {/* 卡片區域 */}
        <div className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, rotateY: 15, x: 60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -15, x: -60 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-ivory/5 bg-ivory/[0.03] p-8 md:p-12"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 60px -15px rgba(123, 47, 190, 0.08)",
              }}
            >
              {/* 引用符號 */}
              <span className="absolute top-4 left-6 font-serif-tc text-[6rem] text-brand/10 leading-none select-none">
                」
              </span>

              {/* 頭部資訊 */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20
                               flex items-center justify-center">
                  <span className="font-serif-tc text-lg text-brand font-semibold">
                    {item.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-sans-tc text-sm text-ivory/80 font-medium">
                    {item.name} · {item.age} · {item.role}
                  </p>
                  <StarRating rating={item.rating} />
                </div>
              </div>

              {/* 見證內容 */}
              <div className="relative z-10 space-y-3 mb-8">
                {item.content.map((p, i) => (
                  <p key={i} className="font-sans-tc text-body-lg text-ivory/50 leading-[1.9]">
                    {p}
                  </p>
                ))}
              </div>

              {/* 底部 */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 text-[0.65rem] font-body tracking-wider
                               rounded-full bg-brand/10 text-brand-light">
                  {item.course}
                </span>
                <span className="text-[0.65rem] text-ivory/20 font-body">
                  {item.month}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 導航 */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-[width,background-color] duration-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40
                  ${active === i
                    ? "w-8 bg-brand"
                    : "bg-ivory/15 hover:bg-ivory/25"
                  }`}
                aria-label={`見證 ${i + 1}`}
              />
            ))}
          </div>

          {/* 法規聲明 */}
          <p className="text-center text-[0.6rem] text-ivory/15 font-body mt-12 max-w-md mx-auto leading-relaxed">
            ※ 以上為個人主觀感受分享，不代表所有使用者實際體驗。每個人膚質與生活習慣不同，效果因人而異。
          </p>
        </div>
      </div>
    </section>
  );
}
