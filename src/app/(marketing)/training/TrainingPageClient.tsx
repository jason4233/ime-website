"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const courses = [
  {
    sticker: "BASIC",
    title: "泌容術初次體驗",
    duration: "90 分鐘",
    desc: "從原理、實作到客戶溝通的入門課。適合美容從業人員、想了解外泌體應用的妳。",
    rotate: "-rotate-2",
    pin: "bg-rose-nude",
  },
  {
    sticker: "ADVANCED",
    title: "煥膚修護療程",
    duration: "120 分鐘",
    desc: "進階手技搭配 USC-E 凍晶溶配比例，學會為不同膚質設計屬於妳的療程節奏。",
    rotate: "rotate-1",
    pin: "bg-brand-light",
  },
  {
    sticker: "MASTER",
    title: "深度抗老療程",
    duration: "150 分鐘",
    desc: "完整的肌膚老化評估、療程規劃、客製化原料配比。結業可獨立執行高階療程。",
    rotate: "-rotate-1",
    pin: "bg-gold-light",
  },
];

const flow = [
  { step: "01", title: "報名", desc: "填寫資料、確認課程，繳交課程費用即完成預約。" },
  { step: "02", title: "培訓", desc: "創始總代理一對一現場指導，理論與實操並行。" },
  { step: "03", title: "結業", desc: "完成考核項目，現場演示通過即可獲得結業證書。" },
  { step: "04", title: "認證", desc: "頒發 i me 官方認證，開放接案資格與後續支援。" },
];

const photos = [
  { src: "/images/660147_0.jpg", caption: "結業合影", rotate: "-rotate-3", offset: "translate-y-2" },
  { src: "/images/660148_0.jpg", caption: "課程實況", rotate: "rotate-2", offset: "-translate-y-2" },
  { src: "/images/660161_0.jpg", caption: "技術示範", rotate: "-rotate-2", offset: "translate-y-1" },
  { src: "/images/660166_0.jpg", caption: "學員交流", rotate: "rotate-3", offset: "-translate-y-3" },
];

const reasons = [
  { num: "01", title: "CDMO 認證原料", desc: "TFDA 醫器製字 × INCI 國際登錄 × 中韓專利。從源頭就贏一半。" },
  { num: "02", title: "創始總代理 1 對 1", desc: "不是助教、不是錄影、不是線上。是創始人親自帶妳走完整套手感。" },
  { num: "03", title: "結業即可接案", desc: "拿到認證的同時，i me 開放案件媒合與品牌使用授權。" },
];

export function TrainingPageClient() {
  return (
    <div className="relative">
      {/* 紙張紋理 overlay */}
      <PaperTexture />
      <HeroSection />
      <CoursesSection />
      <FlowSection />
      <PhotosSection />
      <ReasonsSection />
      <CTASection />
    </div>
  );
}

function PaperTexture() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 md:pt-44 pb-section bg-surface-floating overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full bg-rose-nude/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <TextReveal>
          <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-6">
            TRAINING ACADEMY
          </p>
        </TextReveal>
        <TextReveal delay={0.15}>
          <h1 className="font-handwriting text-[clamp(2.4rem,6.5vw,5rem)] leading-[1.15] text-night text-balance">
            培訓不是教技術，
            <br />
            是養成<span className="text-brand">一個夠資格的妳</span>
          </h1>
        </TextReveal>
        <TextReveal delay={0.35}>
          <p className="mt-10 max-w-2xl mx-auto text-body-lg text-night/65 font-sans-tc">
            把外泌體交到妳手上之前，我們會花時間，讓妳成為值得信任的人。
          </p>
        </TextReveal>
      </div>
    </section>
  );
}

function CoursesSection() {
  return (
    <section className="py-section bg-ivory relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              CURRICULUM
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">三階段，一步一步來</h2>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {courses.map((c, i) => (
            <CourseCard key={c.title} course={c} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  course,
  delay,
}: {
  course: typeof courses[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, y: -6 }}
      className={`relative bg-surface-floating border border-mist/80 rounded-sm p-10 pt-14 shadow-elevated hover:shadow-floating transition-shadow duration-500 ${course.rotate}`}
      style={{ transformOrigin: "center" }}
    >
      {/* 迴紋針 */}
      <div className={`absolute -top-3 left-8 w-12 h-6 ${course.pin} rounded-sm shadow-md rotate-[-8deg] z-10`} />
      {/* 貼紙 */}
      <div className="absolute -top-2 right-6 px-3 py-1 bg-night text-ivory font-elegant italic text-caption tracking-widest rotate-3">
        {course.sticker}
      </div>

      <h3 className="font-handwriting text-3xl text-night leading-tight">
        {course.title}
      </h3>
      <p className="mt-3 font-elegant italic text-gold text-caption tracking-widest">
        {course.duration}
      </p>
      <div className="my-6 h-px w-full bg-night/10 border-dashed" style={{ borderTop: "1px dashed rgba(10,10,10,0.15)", height: 0 }} />
      <p className="text-body text-night/70 font-sans-tc leading-[1.9]">
        {course.desc}
      </p>

      <div className="mt-8 flex items-center gap-2 text-caption font-sans-tc text-brand">
        <span>了解詳情</span>
        <span className="text-lg">→</span>
      </div>
    </motion.div>
  );
}

function FlowSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              CERTIFICATION FLOW
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">
              從報名到認證，
              <span className="block mt-2 font-handwriting text-brand">四步抵達</span>
            </h2>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent hidden md:block" />
          {flow.map((f, i) => (
            <FlowStep key={f.step} flow={f} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowStep({
  flow,
  delay,
}: {
  flow: { step: string; title: string; desc: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="relative text-center"
    >
      <div className="relative mx-auto w-24 h-24 rounded-full bg-ivory border-2 border-gold flex items-center justify-center shadow-elevated">
        <span className="font-number text-2xl text-brand">{flow.step}</span>
      </div>
      <h3 className="mt-6 font-serif-tc text-h3 text-night">{flow.title}</h3>
      <p className="mt-3 text-body text-night/60 font-sans-tc leading-[1.8]">
        {flow.desc}
      </p>
    </motion.div>
  );
}

function PhotosSection() {
  return (
    <section className="py-section bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              GRADUATES
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-handwriting text-[clamp(2rem,5vw,3.5rem)] text-night">
              她們，已經在執業了
            </h2>
          </TextReveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {photos.map((p, i) => (
            <PolaroidCard key={p.src} photo={p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PolaroidCard({
  photo,
  delay,
}: {
  photo: { src: string; caption: string; rotate: string; offset: string };
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
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      className={`bg-surface-elevated p-3 pb-10 shadow-elevated hover:shadow-floating transition-shadow duration-500 ${photo.rotate} ${photo.offset}`}
      style={{ transformOrigin: "center" }}
    >
      <div className="relative aspect-square overflow-hidden bg-mist/40">
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 25vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/15 to-transparent mix-blend-multiply" />
      </div>
      <p className="mt-4 text-center font-handwriting text-xl text-night/80">
        {photo.caption}
      </p>
    </motion.div>
  );
}

function ReasonsSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              WHY US
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">
              為什麼選擇 <span className="text-brand">i me</span> 培訓
            </h2>
          </TextReveal>
        </div>

        <div className="space-y-6">
          {reasons.map((r, i) => (
            <ReasonRow key={r.num} reason={r} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonRow({
  reason,
  delay,
}: {
  reason: { num: string; title: string; desc: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="grid md:grid-cols-12 gap-6 py-8 border-b border-mist last:border-0 group"
    >
      <div className="md:col-span-2">
        <span className="font-number text-5xl text-gold/70 group-hover:text-gold transition-colors duration-500">
          {reason.num}
        </span>
      </div>
      <div className="md:col-span-4">
        <h3 className="font-serif-tc text-h3 text-night">{reason.title}</h3>
      </div>
      <div className="md:col-span-6">
        <p className="text-body-lg text-night/65 font-sans-tc leading-[1.9]">
          {reason.desc}
        </p>
      </div>
    </motion.div>
  );
}

function CTASection() {
  return (
    <section className="py-section-lg relative overflow-hidden bg-night text-ivory">
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/663112_0.jpg"
          alt=""
          fill
          className="object-cover opacity-25 mix-blend-soft-light"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/85 to-night" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <TextReveal>
          <h2 className="font-handwriting text-[clamp(2.5rem,6vw,4.5rem)] leading-tight text-ivory">
            準備好，<br />
            成為<span className="text-gold-light">那個被需要的人</span>了嗎？
          </h2>
        </TextReveal>
        <TextReveal delay={0.2}>
          <p className="mt-8 text-body-lg text-ivory/70 font-sans-tc">
            名額有限，採預約制。先報名、先安排。
          </p>
        </TextReveal>
        <TextReveal delay={0.35}>
          <div className="mt-10">
            <MagneticButton href="/contact" variant="gold">
              報名培訓
            </MagneticButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}
