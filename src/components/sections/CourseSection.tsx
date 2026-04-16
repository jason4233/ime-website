"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const courses = [
  {
    id: "experience",
    tag: "初次體驗",
    name: "泌容術｜初次體驗",
    subtitle: "第一次，就讓皮膚自己感謝妳。",
    suitable: "第一次接觸外泌體 / 懷疑 + 想驗證的人",
    duration: "90 分鐘",
    includes: "深度潔淨 + 外泌體導入 + 舒緩修復",
    ctaText: "預約體驗",
    ctaHref: "/contact",
    imageUrl: "https://placehold.co/400x300/FAF7F2/7B2FBE?text=Course+A",
    color: "brand",
  },
  {
    id: "repair",
    tag: "術後修護",
    name: "煥膚修護療程",
    subtitle: "給那些，最近被自己臉色嚇到的日子。",
    suitable: "術後 / 雷射後 / 熬夜掉妝 / 膚況混亂期",
    duration: "120 分鐘",
    includes: "深層修護 + 外泌體密集導入 + 鎮定舒緩",
    ctaText: "了解詳情",
    ctaHref: "/contact",
    imageUrl: "https://placehold.co/400x300/FAF7F2/B8953F?text=Course+B",
    color: "gold",
  },
  {
    id: "antiaging",
    tag: "深度抗老",
    name: "深度抗老療程",
    subtitle: "不是讓時間倒退，是讓時間在妳臉上客氣一點。",
    suitable: "30+ / 鬆弛細紋明顯 / 想做長期管理",
    duration: "150 分鐘",
    includes: "全臉拉提 + 外泌體深導 + 修復面膜",
    ctaText: "預約諮詢",
    ctaHref: "/contact",
    imageUrl: "https://placehold.co/400x300/FAF7F2/D4A89B?text=Course+C",
    color: "rose-nude",
  },
];

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  const accentMap: Record<string, string> = {
    brand: "border-brand/20 hover:border-brand/40",
    gold: "border-gold/20 hover:border-gold/40",
    "rose-nude": "border-rose-nude/30 hover:border-rose-nude/50",
  };
  const tagMap: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    gold: "bg-gold/10 text-gold",
    "rose-nude": "bg-rose-nude/20 text-rose-nude",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-[300px] max-w-[400px] perspective-1000"
    >
      <div
        className={`relative w-full transition-transform duration-700 ease-spring cursor-pointer
          ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 正面 */}
        <div
          className={`relative rounded-xl border ${accentMap[course.color]} bg-surface-elevated
                     p-6 transition-all duration-300 shadow-elevated
                     [backface-visibility:hidden]`}
        >
          {/* 圖片 */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6 bg-mist">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.imageUrl}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tag */}
          <span className={`inline-block px-3 py-1 text-[0.65rem] font-body font-medium tracking-wider
                           rounded-full mb-4 ${tagMap[course.color]}`}>
            {course.tag}
          </span>

          {/* 名稱 */}
          <h3 className="font-serif-tc text-h3 text-night mb-2">
            {course.name}
          </h3>

          {/* 副標 */}
          <p className="font-sans-tc text-body text-night/40 mb-4 leading-relaxed">
            {course.subtitle}
          </p>

          {/* 時長 */}
          <div className="flex items-center gap-2 text-caption text-night/30 font-body">
            <span>⏱</span>
            <span>{course.duration}</span>
          </div>

          {/* 翻轉提示 */}
          <p className="text-[0.6rem] text-night/20 text-center mt-4 font-body">
            點擊查看詳情 →
          </p>
        </div>

        {/* 背面 */}
        <div
          className={`absolute inset-0 rounded-xl border ${accentMap[course.color]} bg-night
                     p-6 flex flex-col justify-between shadow-floating
                     [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <div>
            <span className={`inline-block px-3 py-1 text-[0.65rem] font-body font-medium tracking-wider
                             rounded-full mb-5 ${tagMap[course.color]}`}>
              {course.tag}
            </span>

            <h3 className="font-serif-tc text-xl text-ivory mb-2">
              {course.name}
            </h3>

            <p className="font-elegant italic text-sm text-ivory/30 mb-6">
              {course.subtitle}
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-overline text-ivory/25 uppercase font-body mb-1">適合對象</p>
                <p className="font-sans-tc text-caption text-ivory/50">{course.suitable}</p>
              </div>
              <div>
                <p className="text-overline text-ivory/25 uppercase font-body mb-1">時長</p>
                <p className="font-sans-tc text-caption text-ivory/50">{course.duration}</p>
              </div>
              <div>
                <p className="text-overline text-ivory/25 uppercase font-body mb-1">包含</p>
                <p className="font-sans-tc text-caption text-ivory/50">{course.includes}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <MagneticButton href={course.ctaHref} variant="gold" className="w-full justify-center text-sm">
              {course.ctaText}
            </MagneticButton>
            <button
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="text-caption text-ivory/25 hover:text-ivory/50 transition-colors font-body
                         focus-visible:outline-none focus-visible:text-gold"
            >
              ← 返回
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CourseSection() {
  return (
    <section className="py-section-lg bg-ivory relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-[25%] w-px h-[20vh] bg-gradient-to-b from-brand/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* 標題 */}
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand uppercase tracking-[0.25em] font-body mb-4">
              Courses
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-night mb-4">
              選一堂課，重新認識自己的皮膚
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans-tc text-body-lg text-night/40 max-w-lg mx-auto">
              每一堂課都是一次和肌膚的對話。不推銷，只讓妳的皮膚自己說話。
            </p>
          </TextReveal>
        </div>

        {/* 三張卡片 */}
        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
