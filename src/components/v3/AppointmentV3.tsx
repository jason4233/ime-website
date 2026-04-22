"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════════
//   AppointmentV3 — The Invitation
//   朱砂封蠟印浮水印 + 超大 "我想預約" serif +
//   金色 hairline-only 表單(無邊框盒子)
//   Submit: 朱砂紅方按鈕 + 金絲內邊
// ═══════════════════════════════════════════════════════════════

const courseOptions = [
  { value: "experience", label: "泌容術｜初次體驗(90 分鐘)" },
  { value: "repair", label: "煥膚修護療程(120 分鐘)" },
  { value: "antiaging", label: "深度抗老療程(150 分鐘)" },
];

const timeSlots = ["10:00", "13:00", "15:00", "17:00", "19:00"];

export function AppointmentV3() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // 模擬送出,實際串接 API 留給下一步
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <section
      ref={ref}
      id="appointment"
      className="relative bg-paper-warm paper-texture py-32 md:py-44 px-8 overflow-hidden"
    >
      {/* 朱砂封蠟印浮水印 — 大背景(手機縮到 55vw 避免壓表單) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 0.08, scale: 1 } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[min(55vw,620px)] h-[min(55vw,620px)] md:w-[min(70vw,620px)] md:h-[min(70vw,620px)]"
      >
        <div
          className="w-full h-full flex items-center justify-center bg-vermillion"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23s)'/></svg>")`,
            backgroundBlendMode: "overlay",
            borderRadius: "4px",
            transform: "rotate(-4deg)",
          }}
        >
          <span
            className="font-serif-tc text-paper-cream font-bold tracking-widest text-[clamp(8rem,22vw,22rem)]"
          >
            泌
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {!submitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="font-serif-tc text-vermillion/90 text-sm tracking-[0.55em] mb-5"
              >
                拾 · 邀請
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif-tc text-ink font-medium leading-tight"
                style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", letterSpacing: "0.1em" }}
              >
                我想預約
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.65 }}
                className="font-elegant italic text-leaf-goldDeep text-xl md:text-2xl mt-4 tracking-wide"
              >
                Begin your ritual.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-20 h-px bg-leaf-gold mx-auto mt-10 origin-center"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.95 }}
                className="font-sans-tc text-ink/60 text-base mt-8 font-light leading-loose"
              >
                留下資訊,我們會在 24 小時內與妳聯繫確認。
              </motion.p>
            </div>

            {/* Form — hairline underline inputs only */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* 2-column: name / phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { name: "name", label: "姓名", type: "text", required: true },
                  { name: "phone", label: "電話", type: "tel", required: true },
                ].map((f) => (
                  <div key={f.name} className="relative">
                    <label
                      htmlFor={f.name}
                      className="block font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.35em] uppercase mb-3"
                    >
                      {f.label} {f.required && <span className="text-vermillion">*</span>}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-vermillion focus:outline-none focus:ring-0 transition-colors duration-500 font-serif-tc text-ink text-lg py-2 placeholder:text-ink/25"
                      placeholder={f.label === "姓名" ? "請輸入妳的名字" : "0912-345-678"}
                    />
                  </div>
                ))}
              </div>

              {/* Email + Line ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { name: "email", label: "Email", type: "email", required: false },
                  { name: "lineId", label: "Line ID", type: "text", required: false },
                ].map((f) => (
                  <div key={f.name} className="relative">
                    <label
                      htmlFor={f.name}
                      className="block font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.35em] uppercase mb-3"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-vermillion focus:outline-none font-serif-tc text-ink text-lg py-2 placeholder:text-ink/25 transition-colors duration-500"
                      placeholder="選填"
                    />
                  </div>
                ))}
              </div>

              {/* Course selection */}
              <div>
                <label className="block font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.35em] uppercase mb-3">
                  療程選擇
                </label>
                <select
                  name="courseId"
                  className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-vermillion focus:outline-none font-serif-tc text-ink text-lg py-2 transition-colors duration-500"
                >
                  <option value="">請選擇...</option>
                  {courseOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Time slots as chips */}
              <div>
                <label className="block font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.35em] uppercase mb-4">
                  首選時段
                </label>
                <div className="flex flex-wrap gap-3">
                  {timeSlots.map((slot) => (
                    <label key={slot} className="cursor-pointer">
                      <input type="radio" name="timeSlot" value={slot} className="peer sr-only" />
                      <span
                        className="inline-block px-5 py-2.5 font-serif-tc text-ink/55 text-sm tracking-wider border border-ink/15 peer-checked:border-vermillion peer-checked:text-vermillion peer-checked:bg-vermillion/5 hover:border-ink/40 transition-colors duration-300"
                        style={{ borderRadius: "2px" }}
                      >
                        {slot}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-elegant italic text-leaf-goldDeep text-[0.65rem] tracking-[0.35em] uppercase mb-3">
                  備註
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full bg-transparent border-0 border-b border-ink/20 focus:border-vermillion focus:outline-none font-serif-tc text-ink text-lg py-2 resize-none placeholder:text-ink/25 transition-colors duration-500"
                  placeholder="想特別提的膚況或需求"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex items-center gap-3 px-12 py-4 bg-vermillion text-paper-cream font-serif-tc text-base tracking-[0.32em] hover:bg-vermillion-dark transition-colors duration-500 disabled:opacity-60 shadow-[0_4px_28px_-4px_rgba(184,50,44,0.45)]"
                  style={{ borderRadius: "2px" }}
                >
                  <span className="relative z-10">{loading ? "送出中…" : "確認預約"}</span>
                  {!loading && (
                    <svg
                      className="w-4 h-4 relative z-10 transition-transform duration-500 group-hover:translate-x-1.5"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M1 8h13M10 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span
                    aria-hidden
                    className="absolute inset-[3px] border border-leaf-gold/35 pointer-events-none"
                    style={{ borderRadius: "1px" }}
                  />
                </button>
                <p className="font-elegant italic text-ink/35 text-xs tracking-wider">
                  送出即同意依隱私權政策處理資料
                </p>
              </div>
            </motion.form>
          </>
        ) : (
          /* 成功畫面 */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-16 max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 1.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.3, 1.4, 0.5, 1] }}
              className="inline-flex w-20 h-20 bg-vermillion items-center justify-center mb-10"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.64  0 0 0 0 0.17  0 0 0 0 0.18  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23s)'/></svg>")`,
                backgroundBlendMode: "overlay",
                borderRadius: "3px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M7 16l6 6L25 10" stroke="#F7F2E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <h3 className="font-serif-tc text-ink text-3xl font-medium mb-4">
              妳的邀請,已送達。
            </h3>
            <p className="font-elegant italic text-leaf-goldDeep text-sm tracking-[0.35em] mb-8 uppercase">
              See you soon.
            </p>
            <p className="font-sans-tc text-ink/60 text-base leading-loose">
              我們的顧問會在 24 小時內與妳聯繫確認。
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
