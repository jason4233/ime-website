"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const benefits = [
  {
    icon: "🧬",
    title: "國際認證的外泌體產品",
    desc: "星誠研發 × 博訊製造，INCI 登錄、TFDA 核准設備、台美三方檢驗。妳推薦的每一瓶都經得起問。",
  },
  {
    icon: "💰",
    title: "不用備庫存、不用租店面",
    desc: "不用卡現金流。輕資產創業模式，用專業和口碑賺錢，不用先賠錢。",
  },
  {
    icon: "🤝",
    title: "創始總代理 1 對 1 帶",
    desc: "帶到妳真的會為止。從產品知識、銷講技巧、客戶經營到結業認證，完整培訓體系。",
  },
];

function RecruitForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // 模擬送出（之後接 API）
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand/10 border border-brand/20
                     flex items-center justify-center"
        >
          <span className="text-3xl">✓</span>
        </motion.div>
        <h3 className="font-serif-tc text-xl text-ivory font-medium mb-3">
          申請已送出
        </h3>
        <p className="font-sans-tc text-body text-ivory/40 mb-6">
          我們會在 48 小時內與妳聯繫。
        </p>
        <button onClick={onClose} className="text-caption text-brand-light hover:text-brand transition-colors font-body">
          關閉
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-serif-tc text-xl text-ivory font-medium mb-2">
        申請成為經銷美容師
      </h3>
      <p className="font-sans-tc text-caption text-ivory/30 mb-6">
        填寫以下資訊，創始總代理將親自與妳聯繫。
      </p>

      {[
        { name: "name", label: "姓名", type: "text", required: true },
        { name: "phone", label: "電話", type: "tel", required: true },
        { name: "lineId", label: "Line ID", type: "text", required: false },
        { name: "occupation", label: "目前職業", type: "text", required: false },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
            {field.label} {field.required && <span className="text-brand">*</span>}
          </label>
          <input
            name={field.name}
            type={field.type}
            required={field.required}
            className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                       text-ivory font-body text-sm placeholder:text-ivory/15
                       focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20
                       transition-all duration-300"
          />
        </div>
      ))}

      <div>
        <label className="block text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
          為什麼想加入？
        </label>
        <textarea
          name="motivation"
          rows={3}
          className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                     text-ivory font-body text-sm placeholder:text-ivory/15 resize-none
                     focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20
                     transition-all duration-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold py-4 text-sm disabled:opacity-50"
      >
        {loading ? "送出中..." : "提交申請"}
      </button>
    </form>
  );
}

export function RecruitSection() {
  const [formOpen, setFormOpen] = useState(false);

  const acts = [
    {
      bg: "bg-night",
      content: (
        <TextReveal>
          <h2 className="font-handwriting text-[clamp(2rem,5vw,3.5rem)] text-ivory leading-[1.2] text-center">
            妳是不是，已經對自己<br />目前的工作累了？
          </h2>
        </TextReveal>
      ),
    },
    {
      bg: "bg-ivory",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <TextReveal>
            <h2 className="font-serif-tc text-h2 text-night leading-snug">
              妳不缺努力，<br />缺的是一個值得妳努力的舞台。
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans-tc text-body-lg text-night/45 leading-[1.9]">
              在美業打拼的妳，每天用雙手照顧別人的臉，<br />
              卻很少有人問妳：「妳累不累？」<br /><br />
              如果有一個品牌，產品夠硬、制度夠好、<br />
              而且真的有人帶——妳願不願意試一次？
            </p>
          </TextReveal>
        </div>
      ),
    },
  ];

  const benefitsRef = useRef<HTMLDivElement>(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-10%" });

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Act 1: 痛點 */}
        <div className={`${acts[0].bg} py-section-lg px-6 flex items-center justify-center noise-overlay`}>
          {acts[0].content}
        </div>

        {/* Act 2: 認同 */}
        <div className={`${acts[1].bg} py-section-lg px-6`}>
          {acts[1].content}
        </div>

        {/* Act 3: 方案 */}
        <div className="bg-deep-purple py-section-lg px-6 noise-overlay" ref={benefitsRef}>
          <div className="max-w-5xl mx-auto">
            <TextReveal>
              <h2 className="font-serif-tc text-h2 text-ivory text-center mb-14">
                成為 i me 經銷美容師，<br />妳同時擁有三件事
              </h2>
            </TextReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 rounded-xl border border-ivory/5 bg-ivory/[0.02]
                             hover:border-brand/20 transition-colors duration-300"
                >
                  <span className="text-3xl mb-4 block">{b.icon}</span>
                  <h4 className="font-serif-tc text-lg text-ivory font-medium mb-3">
                    {b.title}
                  </h4>
                  <p className="font-sans-tc text-caption text-ivory/35 leading-relaxed">
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Act 4: 行動 */}
        <div className="bg-deep-rose py-section-lg px-6 noise-overlay">
          <div className="max-w-3xl mx-auto text-center">
            <TextReveal>
              <h2 className="font-serif-tc text-h1 text-ivory mb-6">
                不是我們需要妳加入，<br />是妳值得被這樣對待。
              </h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <div className="mt-10">
                <MagneticButton variant="gold" onClick={() => setFormOpen(true)}>
                  申請成為經銷美容師
                </MagneticButton>
              </div>
            </TextReveal>
          </div>
        </div>
      </section>

      {/* 表單 Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-night/70 backdrop-blur-xl" onClick={() => setFormOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md bg-[#111] border border-ivory/5
                         rounded-2xl p-8 shadow-floating noise-overlay max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setFormOpen(false)}
                className="absolute top-4 right-4 text-ivory/20 hover:text-ivory/50 transition-colors
                           focus-visible:outline-none focus-visible:text-gold"
              >
                ✕
              </button>
              <RecruitForm onClose={() => setFormOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
