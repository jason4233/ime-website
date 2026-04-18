"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const specs = [
  { num: "200", unit: "億顆 / mL", label: "每毫升粒子數（第三方檢測）" },
  { num: "76.8", unit: "-99.4 nm", label: "平均粒徑" },
  { num: "CD9", unit: "/ CD63", label: "表面標誌表達" },
  { num: "3", unit: "年", label: "USC-D 凍晶常溫保存" },
];

const dualForms = [
  {
    code: "USC-E",
    name: "修秘晶露",
    form: "液態安瓶",
    desc: "每 mL 200 億顆外泌體粒子，水感質地，作為肌膚保養方案的核心原料。",
  },
  {
    code: "USC-D",
    name: "修秘凍晶",
    form: "粉末凍晶",
    desc: "凍晶型態、常溫可存 3 年，使用時還原為活性型，適合長效保存與專業場域調配。",
  },
];

const stellar = [
  {
    title: "王俊翔 — 創始董事長",
    desc: "「星誠不只是研發者，更是連結製程與臨床的橋樑。」2022 年切入外泌體原料研發，串連台中榮總神經外科技術源頭與博訊生技的自動化製程，建立台灣再生醫學研發到量產的新鏈結。",
  },
  {
    title: "台中榮總技轉源頭",
    desc: "技術源自台中榮總神經外科楊孟寅醫師團隊，以醫學中心級研究為核心，完整取得細胞分離、純化、保存方法之技術轉移。",
  },
  {
    title: "INCI Mono ID 40148",
    desc: "2025.06.23 取得國際化妝品原料命名委員會正式登錄，取得全球原料應用場景通行資格。",
  },
  {
    title: "1.2 億募資 × 2025 興櫃",
    desc: "第二期募資超過新台幣 1.2 億元，規劃 2025 年登錄興櫃，與海內外逾 100 間醫療單位、美容中心建立合作。",
  },
];

const process = [
  {
    step: "01",
    title: "3A-GTP 技術平台",
    desc: "AI + AR + Auto 三軸整合。AI 即時判讀細胞狀態、AR 輔助製程視覺化、Auto 全自動無人化備製，每天累積上萬筆製程參數。",
  },
  {
    step: "02",
    title: "10 倍產量 × 1/10 成本",
    desc: "細胞產量較傳統人工 GTP 提升 10 倍，每億顆細胞備製成本降至人工產線的十分之一，以半導體代工邏輯重新定義再生醫療商業化。",
  },
  {
    step: "03",
    title: "iCellPro-3A1000",
    desc: "2022 年建置全球第一座無人化細胞備製系統。南科新廠規劃 2,000 坪、12 條模組化產線、2026 年動工。2025.04 取得衛福部第二類醫材許可。",
  },
  {
    step: "04",
    title: "秘心吾 — 創辦人",
    desc: "原為執業牙醫師，從高齡患者齒槽骨再生困境出發，回到台大攻讀博士，跨修應用力學與分子生物學。2013 年創立博訊生技，成為全球第一家以細胞備製 CDMO 為主營運模式的生技公司。",
  },
];

const certs = [
  {
    label: "INCI 國際命名",
    title: "Mono ID 40148",
    desc: "2025.06.23 正式登錄國際化妝品原料命名資料庫，取得全球原料應用通行資格。",
    src: "/images/660081_0.jpg",
  },
  {
    label: "TFDA 醫器製字",
    title: "台灣衛福部醫療器材許可",
    desc: "通過台灣食品藥物管理署審核，符合第二類醫療器材製造規範。",
    src: "/images/660174_0.jpg",
  },
  {
    label: "發明專利",
    title: "中華民國 × 大韓民國",
    desc: "核心分離、純化、保存方法獲中韓兩國發明專利授權。",
    src: "/images/660083_0.jpg",
  },
];

export function ProductsPageClient() {
  return (
    <>
      <HeroSection />
      <ProductIntro />
      <DualFormSection />
      <StellarSection />
      <ProcessSection />
      <CertificateSection />
      <CTASection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 md:pt-44 pb-section bg-night text-ivory overflow-hidden min-h-[80vh] flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand/20 blur-[120px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 text-center w-full">
        <TextReveal>
          <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-6">
            CORE TECHNOLOGY
          </p>
        </TextReveal>
        <TextReveal delay={0.15}>
          <h1 className="font-serif-tc text-hero leading-[1.05] text-ivory text-balance">
            從<span className="text-gradient-gold">醫學中心</span>
            <br />
            到妳的肌膚
          </h1>
        </TextReveal>
        <TextReveal delay={0.35}>
          <p className="mt-10 max-w-2xl mx-auto text-body-lg text-ivory/65 font-sans-tc">
            每一支安瓶背後，是一整條醫療器材等級的細胞備製產線，
            <br className="hidden md:block" />
            與一支沉默十年的研發團隊。
          </p>
        </TextReveal>
      </div>
    </section>
  );
}

function ProductIntro() {
  return (
    <section className="py-section bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              FLAGSHIP
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-night leading-[1.1]">
              USC-E / USC-D
              <br />
              <span className="text-brand">修秘 SIUPI</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-6 text-body-lg text-night/70 font-sans-tc leading-[1.9]">
              臍帶間質幹細胞外泌體原料，雙劑型並行：
              <span className="text-brand font-medium">USC-E 液態晶露</span>
              與
              <span className="text-brand font-medium">USC-D 粉末凍晶</span>
              。每 mL 封存 200 億顆粒徑穩定的外泌體，
              凍晶型態於常溫下完整保存 3 年——
              溫柔、安靜、隨時準備好。
            </p>
          </TextReveal>

          <div className="mt-12 grid grid-cols-2 gap-6">
            {specs.map((s, i) => (
              <SpecCard key={s.label} spec={s} delay={i * 0.08} />
            ))}
          </div>

          <TextReveal delay={0.4}>
            <p className="mt-8 text-caption text-night/50 font-sans-tc">
              第三方檢測機構：台美檢驗、圖爾思生技 · INCI 認證原料
            </p>
          </TextReveal>
        </div>

        <div className="md:col-span-6 relative">
          <TextReveal delay={0.2}>
            <div className="relative aspect-square rounded-brand overflow-hidden bg-gradient-to-br from-mist/40 to-rose-nude/20">
              <Image
                src="/images/42706_0.jpg"
                alt="修秘 SIUPI 產品形象"
                fill
                className="object-cover mix-blend-multiply"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/20 via-transparent to-transparent" />
              <div className="absolute top-6 right-6 px-4 py-2 bg-night/85 backdrop-blur-sm rounded-brand">
                <span className="font-elegant italic text-gold text-caption tracking-widest">
                  Exosome Dual Form
                </span>
              </div>
            </div>
          </TextReveal>
        </div>
      </div>
    </section>
  );
}

function SpecCard({
  spec,
  delay,
}: {
  spec: { num: string; unit: string; label: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [displayNum, setDisplayNum] = useState(spec.num);

  useEffect(() => {
    if (!inView) return;
    const target = parseFloat(spec.num.replace(/,/g, ""));
    if (Number.isNaN(target)) return;
    const duration = 1200;
    const startTime = performance.now();
    const raf = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      const decimals = spec.num.includes(".") ? 1 : 0;
      const formatted = current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      setDisplayNum(formatted);
      if (t < 1) requestAnimationFrame(raf);
      else setDisplayNum(spec.num);
    };
    requestAnimationFrame(raf);
  }, [inView, spec.num]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="border-l-2 border-gold/40 pl-5 py-2"
    >
      <div className="font-number text-3xl text-night flex items-baseline gap-1">
        <span>{displayNum}</span>
        <span className="text-sm text-gold font-sans-tc">{spec.unit}</span>
      </div>
      <p className="mt-1 text-caption text-night/55 font-sans-tc">{spec.label}</p>
    </motion.div>
  );
}

function DualFormSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              DUAL FORMULATION
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">
              液態 × 凍晶 · 雙劑型
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-6 max-w-2xl mx-auto text-body text-night/60 font-sans-tc">
              針對不同保養場域與保存條件，提供兩種並行劑型。
            </p>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {dualForms.map((item, i) => (
            <DualFormCard key={item.code} item={item} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DualFormCard({
  item,
  delay,
}: {
  item: { code: string; name: string; form: string; desc: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-surface-elevated rounded-brand p-10 border border-mist hover:border-brand/30 hover:shadow-floating transition-all duration-500"
    >
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-number text-4xl text-brand">{item.code}</span>
        <span className="font-elegant italic text-gold text-overline tracking-[0.3em]">
          {item.form}
        </span>
      </div>
      <h3 className="font-serif-tc text-h2 text-night">{item.name}</h3>
      <p className="mt-4 text-body text-night/65 font-sans-tc leading-[1.9]">
        {item.desc}
      </p>
      <div className="mt-8 h-px w-10 bg-gold/60 group-hover:w-20 transition-all duration-500" />
    </motion.div>
  );
}

function StellarSection() {
  return (
    <section className="py-section relative overflow-hidden" style={{ backgroundColor: "#1a0f24" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand/10 via-transparent to-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand/10 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              R&D PARTNER
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-ivory">
              星誠細胞生醫
              <span className="block mt-2 font-elegant italic text-gold-light text-h3">
                StellarCell BioMedicine
              </span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.25}>
            <p className="mt-6 max-w-2xl mx-auto text-body text-ivory/60 font-sans-tc leading-[1.9]">
              成立於 2022 年，定位為「皮膚能量術後修護原料專家」，
              專注幹細胞與外泌體應用研究，擁有核心分離純化技術與國際認證資格。
            </p>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stellar.map((s, i) => (
            <StellarCard key={s.title} item={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StellarCard({
  item,
  delay,
}: {
  item: { title: string; desc: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-brand p-8 border border-ivory/10 bg-ivory/[0.02] backdrop-blur-sm hover:border-gold/40 hover:bg-ivory/[0.04] transition-all duration-500"
    >
      <div className="w-10 h-10 mb-6 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-ivory/90" />
      </div>
      <h3 className="font-serif-tc text-h3 text-ivory">{item.title}</h3>
      <p className="mt-3 text-body text-ivory/60 font-sans-tc leading-[1.8]">
        {item.desc}
      </p>
      <div className="mt-6 h-px w-8 bg-gold/50 group-hover:w-16 transition-all duration-500" />
    </motion.div>
  );
}

function ProcessSection() {
  return (
    <section className="py-section relative overflow-hidden" style={{ backgroundColor: "#0F1412" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/8 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              CDMO PROCESS
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-ivory">
              博訊生物科技
              <span className="block mt-2 font-elegant italic text-gold-light text-h3">
                Dr.SIGNAL CDMO
              </span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.25}>
            <p className="mt-6 max-w-3xl mx-auto text-body-lg text-ivory/65 font-sans-tc leading-[1.9]">
              <span className="text-gold-light">全球第一家</span>
              以細胞備製 CDMO 為主營運模式的生技公司，
              也是世界上第一間自主建置先進智能自動化細胞備製產線的團隊。
              <br className="hidden md:block" />
              <span className="italic text-gold-light/80">
                &ldquo;We make stem cells work for you.&rdquo;
              </span>
            </p>
          </TextReveal>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden md:block" />
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
            {process.map((p, i) => (
              <ProcessStep key={p.step} step={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: { step: string; title: string; desc: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const isLeft = index % 2 === 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-brand p-7 border border-ivory/10 bg-ivory/[0.02] hover:border-gold/40 transition-colors duration-500 ${
        isLeft ? "md:mr-4" : "md:ml-4 md:mt-16"
      }`}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-number text-4xl text-gold">{step.step}</span>
        <h3 className="font-serif-tc text-h3 text-ivory">{step.title}</h3>
      </div>
      <p className="mt-4 text-body text-ivory/60 font-sans-tc leading-[1.8]">
        {step.desc}
      </p>
    </motion.div>
  );
}

function CertificateSection() {
  return (
    <section className="py-section bg-surface-floating">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="font-elegant italic text-gold tracking-[0.3em] text-overline mb-4">
              VERIFICATION
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h2 text-night">三方把關的信任</h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mt-6 max-w-2xl mx-auto text-body text-night/60 font-sans-tc">
              原廠製程、第三方檢測機構、政府主管機關，三層獨立驗證。
            </p>
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certs.map((c, i) => (
            <CertCard key={c.title} cert={c} delay={i * 0.1} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            "/images/660082_0.jpg",
            "/images/660084_0.jpg",
            "/images/660085_0.jpg",
            "/images/660086_0.jpg",
            "/images/660087_0.jpg",
          ].map((src, i) => (
            <CertThumb key={src} src={src} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CertCard({
  cert,
  delay,
}: {
  cert: { label: string; title: string; desc: string; src: string };
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
      className="group bg-surface-elevated rounded-brand overflow-hidden border border-mist hover:shadow-floating transition-shadow duration-500"
    >
      <div className="relative aspect-[4/5] bg-mist/40 overflow-hidden">
        <Image
          src={cert.src}
          alt={cert.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-spring"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/40 via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <span className="font-elegant italic text-gold text-overline tracking-[0.3em]">
          {cert.label}
        </span>
        <h3 className="mt-2 font-serif-tc text-h3 text-night">{cert.title}</h3>
        <p className="mt-3 text-body text-night/65 font-sans-tc leading-[1.8]">
          {cert.desc}
        </p>
      </div>
    </motion.div>
  );
}

function CertThumb({ src, delay }: { src: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative aspect-[3/4] rounded-brand overflow-hidden border border-mist bg-surface-elevated group"
    >
      <Image
        src={src}
        alt="專利與認證"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(min-width: 768px) 20vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/30 via-transparent to-transparent" />
    </motion.div>
  );
}

function CTASection() {
  return (
    <section className="py-section-lg bg-ivory">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <TextReveal>
          <h2 className="font-serif-tc text-h2 text-night leading-tight">
            想更深入了解<br />我們的技術？
          </h2>
        </TextReveal>
        <TextReveal delay={0.2}>
          <p className="mt-6 text-body-lg text-night/60 font-sans-tc">
            完整技術資料、原料 SOP、第三方檢測報告，歡迎來信索取。
          </p>
        </TextReveal>
        <TextReveal delay={0.35}>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <MagneticButton href="/contact" variant="gold">
              索取技術資料
            </MagneticButton>
            <MagneticButton href="/training" variant="ghost">
              查看培訓課程
            </MagneticButton>
          </div>
        </TextReveal>
      </div>
    </section>
  );
}
