"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const missions = [
  {
    label: "01",
    title: "專業",
    desc: "以 CDMO 等級原料、TFDA 醫器認證為起點，把醫學中心級的細胞科技，轉譯為妳能日常使用的保養語言。",
  },
  {
    label: "02",
    title: "教育",
    desc: "從技術師培訓到客戶溝通，i me 相信知識是最高級的售後服務。每一位夥伴，都是品牌的延伸。",
  },
  {
    label: "03",
    title: "影響力",
    desc: "讓東方中醫五行的智慧、與西方細胞生技的精準，在妳的肌膚與生活裡同時發生。",
  },
];

export function AboutPageClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-44 pb-section bg-ivory overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[480px] h-[480px] rounded-full bg-brand/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-6">
              OUR STORY
            </p>
          </TextReveal>
          <TextReveal delay={0.15}>
            <h1 className="font-handwriting text-[clamp(3rem,9vw,7rem)] leading-[1.05] text-night text-balance">
              由內而外的
              <br />
              <span className="text-brand">科技美學</span>
            </h1>
          </TextReveal>
          <TextReveal delay={0.35}>
            <p className="mt-10 max-w-2xl mx-auto text-body-lg text-night/65 font-sans-tc leading-relaxed">
              i me 不只是品牌，是一段把東方中醫智慧與現代細胞生技
              <br className="hidden md:block" />
              縫合在一起的旅程。
            </p>
          </TextReveal>
        </div>
      </section>

      {/* 段落 1：i me 的誕生 */}
      <ChapterOne />

      {/* 段落 2：為什麼是外泌體 */}
      <ChapterTwo />

      {/* 段落 3：三大使命 */}
      <section className="py-section bg-ivory relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <TextReveal>
              <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
                OUR MISSION
              </p>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 className="font-serif-tc text-h2 text-night">
                我們相信的三件事
              </h2>
            </TextReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {missions.map((m, i) => (
              <MissionCard key={m.label} mission={m} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section-lg bg-gradient-to-b from-ivory via-mist/40 to-ivory">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <TextReveal>
            <h2 className="font-handwriting text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.1] text-night">
              預約一次，
              <br />
              <span className="text-brand">認識妳自己</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-8 text-body-lg text-night/60 font-sans-tc">
              一場深度對談，從妳的肌膚、體質、節律開始，找出最適合妳的保養路徑。
            </p>
          </TextReveal>
          <TextReveal delay={0.35}>
            <div className="mt-10">
              <MagneticButton href="/contact" variant="gold">
                預約專屬諮詢
              </MagneticButton>
            </div>
          </TextReveal>
        </div>
      </section>
    </>
  );
}

function ChapterOne() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5">
          <TextReveal>
            <p className="font-elegant italic text-brand tracking-[0.25em] text-overline mb-4">
              CHAPTER 01
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night leading-tight">
              i me 的誕生
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-6 font-handwriting text-2xl text-brand/80 leading-relaxed">
              一場 60 分鐘的銷講，
              <br />
              一個改寫產業的決定。
            </p>
          </TextReveal>
        </div>

        <div className="md:col-span-7 space-y-6 text-body-lg text-night/75 font-sans-tc leading-[1.9]">
          <TextReveal delay={0.3}>
            <p>
              在醫美產業快速變化的浪潮中，i me 應運而生。它的核心精神來自一位兼具
              <span className="text-brand font-medium">醫美企業顧問、銷講培訓教練、國際美業評審</span>
              的領導者——周沫璃。
            </p>
          </TextReveal>
          <TextReveal delay={0.4}>
            <p>
              25 年中醫五行營養學的深厚底蘊，讓她將東方智慧與現代生技結合，
              打造出獨特的健康美學理念。一場 60 分鐘的銷講，曾經創下 700 萬業績——
              那不是技巧，是對人、對產品、對使命的真誠。
            </p>
          </TextReveal>
          <TextReveal delay={0.5}>
            <p>
              她相信，真正的美，從來不是被加工出來的，
              而是被讀懂、被照顧、被理解後，自然發生的事。
            </p>
          </TextReveal>
        </div>
      </div>
    </section>
  );
}

function ChapterTwo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section ref={ref} className="py-section bg-night text-ivory relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-brand/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-6 text-center"
        >
          CHAPTER 02
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif-tc text-h2 text-center text-ivory leading-tight"
        >
          為什麼是<span className="text-brand-light">外泌體</span>？
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 font-handwriting text-3xl md:text-4xl text-center text-gold-light leading-[1.5]"
        >
          細胞與細胞之間，
          <br />
          有一種優雅的對話方式。
        </motion.p>

        <div className="mt-16 grid md:grid-cols-2 gap-12 text-body-lg text-ivory/70 font-sans-tc leading-[1.9]">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            外泌體（Exosome）是細胞釋放出來的微小囊泡，攜帶著訊息分子，
            在身體裡進行最原始也最精準的「細胞溝通」。
            它不是激烈的介入，而是輕聲的提醒——讓細胞回到它本來的節奏。
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            i me 選擇外泌體，不是因為它新潮，
            而是因為它的工作方式，呼應了東方哲學裡「不戰而屈人之兵」的智慧——
            最溫柔的力量，往往最深遠。
          </motion.p>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-20 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
        />
      </div>
    </section>
  );
}

function MissionCard({
  mission,
  delay,
}: {
  mission: { label: string; title: string; desc: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-surface-elevated border border-mist/60 rounded-brand p-10 hover:shadow-floating transition-shadow duration-500"
    >
      <span className="font-elegant italic text-gold/70 text-overline tracking-[0.3em]">
        {mission.label}
      </span>
      <h3 className="mt-4 font-serif-tc text-h3 text-night group-hover:text-brand transition-colors duration-500">
        {mission.title}
      </h3>
      <div className="mt-4 h-px w-10 bg-gold group-hover:w-20 transition-all duration-500" />
      <p className="mt-6 text-body text-night/65 font-sans-tc leading-[1.9]">
        {mission.desc}
      </p>
    </motion.div>
  );
}
