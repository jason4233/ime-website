"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

// placeholder 創始人資料（之後由後台 API 適配後替換 — 見 FounderSection 下方 signature）
const founders = [
  {
    id: "moli",
    name: "Moli Chou",
    chineseName: "周沫璃",
    title: "i me 創始總代理",
    quote: "我花了 20 年學會的事：配得感，是女人最好的保養品。",
    paragraphs: [
      "25 年中醫五行營養學的底蘊，讓她看見美不只是表皮的事，而是氣血、情緒、信念共同編織的結果。她把東方養生智慧與現代生技結合，找到了外泌體——一種從細胞層級重寫肌膚訊息的方式。",
      "曾以 60 分鐘的舞台銷講，創造 700 萬保養品業績。但她說，讓她真正驕傲的不是數字，是台下那些眼睛亮起來的女人。",
      "「我想陪每一個還在將就的女人，走回那個她本來就值得的位置。」",
    ],
    photoUrl: "https://placehold.co/600x800/1a1a1a/B8953F?text=Founder",
    socials: { ig: "#", line: "#", fb: "#" },
  },
  {
    id: "louis",
    name: "Louis Shieh",
    chineseName: "",
    title: "秘書長",
    quote: "教育是品牌最有力的推動引擎。",
    paragraphs: [
      "資深美業管理經驗，統籌品牌營運與教育培訓體系，確保每一位加入 i me 的夥伴都能獲得完整的知識與技術支持。",
      "他相信，當每位美容師都能用科學語言與客人對話，信任就不需要話術。",
      "「我們不賣產品，我們培養能說服自己的專業人。」",
    ],
    photoUrl: "https://placehold.co/600x800/1a1a1a/7B2FBE?text=Secretary",
    socials: { ig: "#", line: "#" },
  },
];

function FounderCard({ founder, index }: { founder: typeof founders[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-15%" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[900px] snap-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center"
      >
        {/* 左側：照片 */}
        <div
          className="relative group"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            animate={{ rotateX: tilt.y, rotateY: tilt.x }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative aspect-[3/4] rounded-lg overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "0 4px 40px -8px rgba(123, 47, 190, 0.15), 0 0 0 1px rgba(184, 149, 63, 0.15)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.photoUrl}
              alt={founder.name}
              className="w-full h-full object-cover"
            />

            {/* 漸層覆蓋 */}
            <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />

            {/* 徽章 */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-night/70 backdrop-blur-sm
                           border border-gold/20 rounded-full">
              <span className="text-[0.6rem] text-gold font-body tracking-[0.1em] uppercase">
                創始總代理 Founder Partner
              </span>
            </div>
          </motion.div>
        </div>

        {/* 右側：文字 */}
        <div className="space-y-6">
          <TextReveal>
            <p className="text-overline text-brand uppercase tracking-[0.2em] font-body">
              {founder.title}
            </p>
          </TextReveal>

          <TextReveal delay={0.1}>
            <h3 className="font-serif-tc text-h2 text-night">
              {founder.chineseName || founder.name}
            </h3>
            {founder.chineseName && (
              <p className="font-elegant text-lg text-night/40 mt-1">{founder.name}</p>
            )}
          </TextReveal>

          <TextReveal delay={0.2}>
            <blockquote className="font-serif-tc text-subtitle text-night/70 border-l-2 border-brand/30 pl-5 italic leading-relaxed">
              {founder.quote}
            </blockquote>
          </TextReveal>

          {founder.paragraphs.map((p, i) => (
            <TextReveal key={i} delay={0.3 + i * 0.1}>
              <p className="font-sans-tc text-body text-night/50 leading-[1.8]">
                {p}
              </p>
            </TextReveal>
          ))}

          {/* 社群連結 */}
          <TextReveal delay={0.6}>
            <div className="flex items-center gap-4 pt-2">
              {founder.socials.ig && (
                <a href={founder.socials.ig} className="w-9 h-9 rounded-full border border-night/10
                  flex items-center justify-center text-night/30 hover:text-brand hover:border-brand/30
                  transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {founder.socials.line && (
                <a href={founder.socials.line} className="w-9 h-9 rounded-full border border-night/10
                  flex items-center justify-center text-night/30 hover:text-brand hover:border-brand/30
                  transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  aria-label="LINE"
                >
                  <span className="text-xs font-bold">L</span>
                </a>
              )}
              {founder.socials.fb && (
                <a href={founder.socials.fb} className="w-9 h-9 rounded-full border border-night/10
                  flex items-center justify-center text-night/30 hover:text-brand hover:border-brand/30
                  transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold">f</span>
                </a>
              )}
            </div>
          </TextReveal>
        </div>
      </motion.div>
    </div>
  );
}

export function FounderSection() {
  return (
    <section className="py-section-lg bg-ivory relative overflow-hidden noise-overlay">
      {/* 裝飾 */}
      <div className="absolute top-0 right-[18%] w-px h-[25vh] bg-gradient-to-b from-brand/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <TextReveal>
          <p className="text-overline text-brand uppercase tracking-[0.25em] font-body mb-4">
            Our Founders
          </p>
        </TextReveal>
        <TextReveal delay={0.1}>
          <h2 className="font-serif-tc text-h1 text-night">
            帶領妳走這條路的人
          </h2>
        </TextReveal>
      </div>

      {/* 水平滑動 */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-12 px-6 lg:px-12 pb-8 snap-x snap-mandatory"
          style={{ width: "max-content" }}
        >
          {founders.map((f, i) => (
            <FounderCard key={f.id} founder={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
