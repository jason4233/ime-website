"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

type Member = {
  name: string;
  title: string;
  img: string;
  phone?: string;
  intro: string;
  rotate: string;
};

const members: Member[] = [
  {
    name: "Moli Chou",
    title: "CEO / 執行長",
    img: "/images/653613_0.jpg",
    intro: "25 年中醫五行底蘊、銷講教練、國際美業評審。i me 的靈魂人物。",
    rotate: "-rotate-[1.5deg]",
  },
  {
    name: "Louis Shieh",
    title: "秘書長",
    img: "/images/41509_0.jpg",
    intro: "策略佈局與資源整合。讓品牌跑得穩，也跑得遠。",
    rotate: "rotate-[1deg]",
  },
  {
    name: "林于喬",
    title: "護理師 / 執行長特別助理",
    img: "/images/42701_0.jpg",
    phone: "0976-282-794",
    intro: "臨床護理背景，最懂妳身體的聲音。第一線的溫柔守護。",
    rotate: "-rotate-[1deg]",
  },
  {
    name: "邱婕玲",
    title: "南區業務協理",
    img: "/images/42702_0.jpg",
    phone: "0916-373-003",
    intro: "南台灣的負責人。從高雄到屏東，一通電話就能見面談。",
    rotate: "rotate-[1.5deg]",
  },
  {
    name: "黃揚仁",
    title: "中區業務協理",
    img: "/images/42708_0.jpg",
    phone: "0958-688-959",
    intro: "中台灣的在地夥伴。細膩又實在，幫妳把事情完成。",
    rotate: "-rotate-[2deg]",
  },
];

const offices = [
  { city: "台北", label: "北部營運中心", address: "台北市中正區忠孝西路一段 6 號 3 樓" },
  { city: "台中", label: "中部據點", address: "台中市北屯區文心路四段 696 號 12F" },
  { city: "高雄", label: "南部據點", address: "高雄市新興區中正三路 55 號 27 樓" },
];

export function ContactPageClient() {
  return (
    <>
      <HeroSection />
      <MembersSection />
      <OfficesSection />
      <QuickFormSection />
      <SocialSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 md:pt-44 pb-section bg-ivory overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-brand/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <TextReveal>
          <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-6">
            GET IN TOUCH
          </p>
        </TextReveal>
        <TextReveal delay={0.15}>
          <h1 className="font-handwriting text-[clamp(2.8rem,8vw,6.5rem)] leading-[1.1] text-night text-balance">
            找到對的人，
            <br />
            <span className="text-brand">事情就解決了</span>
          </h1>
        </TextReveal>
        <TextReveal delay={0.35}>
          <p className="mt-10 max-w-xl mx-auto text-body-lg text-night/65 font-sans-tc">
            妳不用自己摸索。我們的團隊，會陪妳走。
          </p>
        </TextReveal>
      </div>
    </section>
  );
}

function MembersSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              OUR TEAM
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">
              每一位，都是妳的<span className="text-brand">人</span>
            </h2>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {members.map((m, i) => (
            <MemberCard key={m.name} member={m} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, delay }: { member: Member; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-50, 50], [6, -6]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-50, 50], [-6, 6]), { stiffness: 150, damping: 15 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={`group relative bg-surface-elevated rounded-brand p-8 border border-mist/60 shadow-elevated hover:shadow-floating transition-shadow duration-500 ${member.rotate}`}
    >
      <div className="relative w-full aspect-[4/5] mb-6 rounded-brand overflow-hidden bg-mist/40 ring-2 ring-gold/20 group-hover:ring-gold/60 transition-all duration-500">
        <Image
          src={member.img}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-spring"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent" />
      </div>

      <h3 className="font-serif-tc text-h3 text-night">{member.name}</h3>
      <p className="mt-1 font-elegant italic text-gold text-caption tracking-widest">
        {member.title}
      </p>
      <div className="my-4 h-px w-12 bg-gold group-hover:w-24 transition-all duration-500" />
      <p className="text-body text-night/65 font-sans-tc leading-[1.85]">
        {member.intro}
      </p>

      <div className="mt-6 flex items-center gap-4 text-caption text-night/60">
        {member.phone && (
          <a
            href={`tel:${member.phone.replace(/-/g, "")}`}
            className="inline-flex items-center gap-2 hover:text-brand transition-colors focus-visible:outline-none focus-visible:text-brand"
          >
            <PhoneIcon />
            <span className="font-number tracking-wider">{member.phone}</span>
          </a>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <SocialChip label="Line" />
        <SocialChip label="IG" />
        <SocialChip label="Email" />
      </div>
    </motion.div>
  );
}

function SocialChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center px-3 py-1 text-[0.7rem] tracking-widest font-elegant italic text-night/50 border border-night/15 rounded-full hover:text-brand hover:border-brand/40 transition-colors duration-300 cursor-pointer">
      {label}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function OfficesSection() {
  return (
    <section className="py-section bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              OFFICES
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">全台三地，
              <span className="font-handwriting text-brand">都有我們</span>
            </h2>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {offices.map((o, i) => (
            <OfficeCard key={o.city} office={o} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficeCard({
  office,
  delay,
}: {
  office: { city: string; label: string; address: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="group relative bg-surface-elevated border border-mist/60 rounded-brand p-10 hover:border-gold/50 hover:shadow-floating transition-all duration-500"
    >
      <span className="font-elegant italic text-gold text-overline tracking-[0.3em]">
        {office.label}
      </span>
      <h3 className="mt-3 font-serif-tc text-h2 text-night leading-none">
        {office.city}
      </h3>
      <div className="my-5 h-px w-10 bg-gold group-hover:w-20 transition-all duration-500" />
      <p className="text-body text-night/65 font-sans-tc leading-[1.85]">
        {office.address}
      </p>
    </motion.div>
  );
}

function QuickFormSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <TextReveal>
          <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
            QUICK BOOKING
          </p>
        </TextReveal>
        <TextReveal delay={0.1}>
          <h2 className="font-serif-tc text-h2 text-night">
            直接預約一次諮詢
          </h2>
        </TextReveal>
        <TextReveal delay={0.2}>
          <p className="mt-6 text-body-lg text-night/60 font-sans-tc">
            不用想太多。填個表、留下聯絡方式，我們會主動聯繫妳。
          </p>
        </TextReveal>
        <TextReveal delay={0.35}>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <MagneticButton href="/#appointment" variant="gold">
              前往預約表單
            </MagneticButton>
            <MagneticButton href="tel:0976282794" variant="ghost">
              直撥電話
            </MagneticButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}

function SocialSection() {
  const socials = [
    { name: "Line", desc: "最即時，業務直接回妳。", href: "#" },
    { name: "Instagram", desc: "看課程、看學員、看品牌日常。", href: "#" },
    { name: "Facebook", desc: "完整活動與新品發布。", href: "#" },
  ];
  return (
    <section className="py-section-lg bg-night text-ivory relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-brand/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <h2 className="font-serif-tc text-h2 text-ivory">或者，在這些地方找我們</h2>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {socials.map((s, i) => (
            <SocialCard key={s.name} social={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialCard({
  social,
  delay,
}: {
  social: { name: string; desc: string; href: string };
  delay: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.a
      ref={ref}
      href={social.href}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="group block relative rounded-brand p-10 border border-ivory/10 bg-ivory/[0.02] hover:border-gold/40 hover:bg-ivory/[0.05] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <h3 className="font-serif-tc text-h3 text-ivory group-hover:text-gold-light transition-colors duration-500">
        {social.name}
      </h3>
      <p className="mt-3 text-body text-ivory/55 font-sans-tc leading-[1.8]">
        {social.desc}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 text-caption text-gold">
        <span>前往</span>
        <span className="text-lg group-hover:translate-x-1 transition-transform duration-500">→</span>
      </div>
    </motion.a>
  );
}
