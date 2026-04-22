"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { TextReveal } from "@/components/ui/TextReveal";
import "react-day-picker/style.css";

const timeSlots = ["10:00", "13:00", "15:00", "17:00", "19:00"];

const courseOptions = [
  { value: "experience", label: "泌容術｜初次體驗（90 分鐘）" },
  { value: "repair", label: "煥膚修護療程（120 分鐘）" },
  { value: "antiaging", label: "深度抗老療程（150 分鐘）" },
];

export function AppointmentSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 未來 60 天
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);

  // 週日公休
  const disabledDays = [{ dayOfWeek: [0] }];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section id="appointment" className="py-section-lg bg-ivory relative overflow-hidden noise-overlay">
      <div className="absolute top-0 right-[20%] w-px h-[20vh] bg-gradient-to-b from-brand/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand uppercase tracking-[0.25em] font-body mb-4">
              Book Now
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-night">
              預約妳的第一次泌容術
            </h2>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="font-sans-tc text-body text-night/40 mt-3 max-w-md mx-auto">
              選一個妳方便的日子，剩下的交給我們。
            </p>
          </TextReveal>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            >
              {/* 左：日曆 */}
              <div className="flex justify-center">
                <div className="rounded-xl border border-night/8 bg-surface-elevated p-6 shadow-elevated
                               [&_.rdp]:font-body [&_.rdp-day_button]:rounded-md
                               [&_.rdp-selected_.rdp-day_button]:bg-brand [&_.rdp-selected_.rdp-day_button]:text-ivory
                               [&_.rdp-today]:font-bold [&_.rdp-today]:text-brand
                               [&_.rdp-day_button:hover]:bg-brand/10
                               [&_.rdp-disabled]:opacity-20">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    fromDate={today}
                    toDate={maxDate}
                  />
                </div>
              </div>

              {/* 右：表單 */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {selectedDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-sans-tc text-caption text-brand font-medium mb-2"
                  >
                    已選擇：{selectedDate.toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
                  </motion.p>
                )}

                {[
                  { name: "name", label: "姓名", type: "text", required: true },
                  { name: "phone", label: "電話", type: "tel", required: true },
                  { name: "email", label: "Email", type: "email", required: false },
                  { name: "lineId", label: "Line ID", type: "text", required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-[0.65rem] text-night/40 uppercase tracking-wider font-body mb-1">
                      {field.label} {field.required && <span className="text-brand">*</span>}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      required={field.required}
                      className="w-full px-4 py-3 bg-night/[0.02] border border-night/8 rounded-md
                                 text-night font-body text-sm placeholder:text-night/20
                                 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20
                                 transition-colors duration-300"
                    />
                  </div>
                ))}

                {/* 課程選擇 */}
                <div>
                  <label className="block text-[0.65rem] text-night/40 uppercase tracking-wider font-body mb-1">
                    選擇課程
                  </label>
                  <select
                    name="courseId"
                    className="w-full px-4 py-3 bg-night/[0.02] border border-night/8 rounded-md
                               text-night font-body text-sm
                               focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20
                               transition-colors duration-300"
                  >
                    <option value="">請選擇...</option>
                    {courseOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* 時段 */}
                <div>
                  <label className="block text-[0.65rem] text-night/40 uppercase tracking-wider font-body mb-2">
                    首選時段
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <label key={slot} className="cursor-pointer">
                        <input type="radio" name="timeSlot" value={slot} className="peer sr-only" />
                        <span className="inline-block px-4 py-2 text-caption font-body rounded-md border border-night/8
                                        text-night/40 peer-checked:border-brand peer-checked:text-brand peer-checked:bg-brand/5
                                        hover:border-night/20 transition-colors duration-200">
                          {slot}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 備註 */}
                <div>
                  <label className="block text-[0.65rem] text-night/40 uppercase tracking-wider font-body mb-1">
                    備註
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full px-4 py-3 bg-night/[0.02] border border-night/8 rounded-md
                               text-night font-body text-sm resize-none
                               focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20
                               transition-colors duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-4 text-sm disabled:opacity-50"
                >
                  {loading ? "送出中..." : "確認預約"}
                </button>

                <p className="text-[0.6rem] text-night/20 text-center font-body">
                  送出後我們會在 24 小時內與妳聯繫確認
                </p>
              </form>
            </motion.div>
          ) : (
            /* 成功畫面 */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand/10 border border-brand/20
                           flex items-center justify-center"
              >
                <span className="text-4xl text-brand">✓</span>
              </motion.div>
              <h3 className="font-serif-tc text-2xl text-night font-medium mb-3">
                預約已送出
              </h3>
              <p className="font-sans-tc text-body text-night/40 mb-8">
                我們會在 24 小時內與妳聯繫確認時間。<br />
                期待見到妳 ✦
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-caption text-brand hover:text-brand-dark transition-colors font-body
                           focus-visible:outline-none focus-visible:text-gold"
              >
                重新預約
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
