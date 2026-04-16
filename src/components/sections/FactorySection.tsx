"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";

const steps = [
  { id: 1, title: "臍帶間質幹細胞來源取得", icon: "🧬", color: "#7B2FBE" },
  { id: 2, title: "進入 3A-GTP 全自動化製程平台", icon: "🏭", color: "#9B5DD4" },
  { id: 3, title: "iCellPro-3A1000 無人化細胞製備", icon: "🤖", color: "#B8953F" },
  { id: 4, title: "AOI 自動光學檢測 + IoT 即時監控", icon: "👁️", color: "#D4B96A" },
  { id: 5, title: "TFDA 核准設備封裝", icon: "✅", color: "#B8953F" },
  { id: 6, title: "台美檢驗、圖爾思生技 第三方驗證出廠", icon: "🔒", color: "#7B2FBE" },
];

function StepNode({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-start gap-6"
    >
      {/* 節點圓 + 連接線 */}
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.12 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10"
          style={{
            borderColor: isInView ? step.color : "rgba(255,255,255,0.1)",
            backgroundColor: isInView ? `${step.color}15` : "transparent",
            boxShadow: isInView ? `0 0 20px -4px ${step.color}30` : "none",
            transition: "all 0.5s ease",
          }}
        >
          <span className="text-xl">{step.icon}</span>
        </motion.div>
        {index < steps.length - 1 && (
          <motion.div
            className="w-px h-16 md:h-20"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.4 }}
            style={{ backgroundColor: `${step.color}25`, transformOrigin: "top" }}
          />
        )}
      </div>

      {/* 內容 */}
      <div className="pt-2 pb-8">
        <span className="text-[0.65rem] font-body tracking-[0.2em] uppercase mb-1 block"
          style={{ color: `${step.color}80` }}>
          Step {String(step.id).padStart(2, "0")}
        </span>
        <h4 className="font-serif-tc text-lg text-ivory font-medium leading-snug">
          {step.title}
        </h4>
      </div>
    </motion.div>
  );
}

export function FactorySection() {
  return (
    <section className="py-section-lg bg-[#0C0C0C] relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-[12%] w-px h-[30vh] bg-gradient-to-b from-gold/8 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-gold/50 uppercase tracking-[0.25em] font-body mb-4">
              CDMO Manufacturing
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-ivory">
              全球唯一的細胞工廠
            </h2>
          </TextReveal>
        </div>

        {/* 製程流程 */}
        <div className="max-w-md mx-auto">
          {steps.map((step, i) => (
            <StepNode key={step.id} step={step} index={i} />
          ))}
        </div>

        {/* 底部文案 */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <TextReveal>
            <div className="w-12 h-px bg-gold/30 mx-auto mb-8" />
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="font-sans-tc text-body-lg text-ivory/35 leading-[2]">
              博訊生物科技，是世界上第一間有能力<br />
              自主建置智能自動化細胞備製產線的 CDMO。<br />
              妳皮膚上的每一滴 ExoGiov®，都從這裡誕生。
            </p>
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
