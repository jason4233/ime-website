"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function LuxeAppointment() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim() || undefined,
    };
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(body?.message ?? body?.details?.[0]?.message ?? "送出失敗");
        setLoading(false);
        return;
      }
      form.reset();
      setSubmitted(true);
    } catch {
      setErrorMsg("網路錯誤，請稍後再試");
    }
    setLoading(false);
  }

  return (
    <section
      id="appointment"
      ref={ref}
      className="relative bg-luxe-bgBase py-section overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[radial-gradient(circle,rgba(202,138,4,0.18),transparent_60%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-3xl px-6 lg:px-12 relative z-10 text-center">
        <p className="font-italic italic text-luxe-gold/75 text-sm tracking-[0.45em] uppercase mb-4">
          VI · The Promise
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-display-xl text-luxe-ivory leading-[0.95] tracking-tight mb-8"
        >
          開始妳的，
          <br />
          <span className="font-display italic text-luxe-gold">
            細胞回信時間。
          </span>
        </motion.h2>
        <div className="h-px w-16 bg-luxe-gold/60 mx-auto mb-8" />
        <p className="font-sans text-luxe-ivoryDim text-body-lg leading-loose font-light max-w-md mx-auto mb-16">
          填一次表，剩下的我們會在 24 小時內聯繫妳。
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl mx-auto text-left"
          >
            {[
              ["name", "姓名", "text", true],
              ["phone", "電話", "tel", true],
              ["email", "Email", "email", false],
              ["lineId", "Line ID", "text", false],
            ].map(([name, label, type, required]) => (
              <div key={name as string}>
                <label
                  htmlFor={name as string}
                  className="block font-italic italic text-luxe-gold/70 text-[0.65rem] tracking-[0.3em] uppercase mb-2"
                >
                  {label}{" "}
                  {required && <span className="text-luxe-gold not-italic">*</span>}
                </label>
                <input
                  id={name as string}
                  name={name as string}
                  type={type as string}
                  required={required as boolean}
                  className="w-full bg-transparent border-b border-luxe-ivory/15 px-1 py-3
                             font-sans text-luxe-ivory placeholder:text-luxe-ivoryFade
                             focus:outline-none focus:border-luxe-gold
                             transition-colors duration-500"
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="block font-italic italic text-luxe-gold/70 text-[0.65rem] tracking-[0.3em] uppercase mb-2"
              >
                備註
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="w-full bg-transparent border-b border-luxe-ivory/15 px-1 py-3
                           font-sans text-luxe-ivory placeholder:text-luxe-ivoryFade
                           focus:outline-none focus:border-luxe-gold
                           transition-colors duration-500 resize-none"
              />
            </div>

            {errorMsg && (
              <p className="md:col-span-2 font-sans text-luxe-gold/90 text-sm text-center">
                {errorMsg}
              </p>
            )}

            <div className="md:col-span-2 mt-8 text-center">
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-pill border border-luxe-gold bg-luxe-gold/10 px-12 py-4 font-sans text-sm font-medium tracking-[0.18em] uppercase text-luxe-gold transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-luxe-ink disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxe-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxe-bgBase"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-luxe-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="relative">
                  {loading ? "送出中..." : "確認預約"}
                </span>
              </button>
              <p className="font-italic italic text-luxe-ivoryFade text-[0.65rem] tracking-[0.3em] uppercase mt-6">
                24 hours · in writing
              </p>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md mx-auto"
          >
            <div className="mx-auto w-20 h-20 rounded-full border border-luxe-gold/40 bg-luxe-gold/5 flex items-center justify-center mb-8">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M5 14L11 20L23 8"
                  stroke="#CA8A04"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-serif text-luxe-ivory text-3xl font-medium tracking-tight mb-4">
              妳的訊息已抵達
            </h3>
            <p className="font-sans text-luxe-ivoryDim leading-loose font-light">
              我們會在 24 小時內與妳聯繫確認。
              <br />
              期待見到妳。
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
