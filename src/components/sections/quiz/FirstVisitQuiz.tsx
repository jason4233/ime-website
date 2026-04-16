"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, quizResults, calculateResult } from "./quizData";
import { QuizCard } from "./QuizCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { ResultType } from "./quizData";

const STORAGE_KEY = "ime_quiz_completed";
const EXPIRY_HOURS = 48;

function isQuizSuppressed(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  const { timestamp } = JSON.parse(stored);
  const elapsed = Date.now() - timestamp;
  return elapsed < EXPIRY_HOURS * 60 * 60 * 1000;
}

function markQuizCompleted() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ timestamp: Date.now() })
  );
}

export function FirstVisitQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ResultType | null>(null);
  const [direction, setDirection] = useState(1); // 1: forward, -1: back

  // 首次造訪 1.5 秒後浮現
  useEffect(() => {
    if (isQuizSuppressed()) return;
    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({ ...prev, [currentQ]: optionId }));

      // 選中後 0.6 秒自動下一題
      setTimeout(() => {
        if (currentQ < quizQuestions.length - 1) {
          setDirection(1);
          setCurrentQ((prev) => prev + 1);
        } else {
          // 最後一題 → 計算結果
          const finalAnswers = { ...answers, [currentQ]: optionId };
          setResult(calculateResult(finalAnswers));
          markQuizCompleted();
        }
      }, 600);
    },
    [currentQ, answers]
  );

  const handleClose = () => {
    setIsOpen(false);
    markQuizCompleted();
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setDirection(1);
    setIsOpen(true);
  };

  const question = quizQuestions[currentQ];
  const resultData = result ? quizResults[result] : null;

  // slide 動畫變體
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <>
      {/* Quiz Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          >
            {/* 背景遮罩 — 玻璃擬態 */}
            <div
              className="absolute inset-0 bg-night/70 backdrop-blur-xl"
              onClick={handleClose}
            />

            {/* Quiz 面板 */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg bg-[#111111]/95 border border-ivory/5
                         rounded-2xl p-8 md:p-10 shadow-floating noise-overlay"
              style={{
                boxShadow: "0 0 80px -20px rgba(184, 149, 63, 0.08)",
              }}
            >
              {/* 關閉按鈕 */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 group
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 rounded-full p-1"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="text-ivory/20 group-hover:text-ivory/50 transition-colors duration-300"
                >
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {/* 關閉提示文字 */}
              <p className="absolute top-5 left-6 text-[0.6rem] text-ivory/15 font-body max-w-[200px] leading-snug hidden md:block">
                先隨意逛逛<br />
                <span className="text-ivory/10">（這份 3 分鐘的自我對話結果，之後不會再出現）</span>
              </p>

              {/* 內容區 */}
              <div className="mt-8">
                <AnimatePresence mode="wait" custom={direction}>
                  {result === null ? (
                    /* 題目 */
                    <motion.div
                      key={currentQ}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.3 },
                      }}
                    >
                      {/* 題號 */}
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="font-display text-2xl text-gold/80 font-semibold">
                          {String(question.id).padStart(2, "0")}
                        </span>
                        <span className="text-ivory/15 font-body text-xs">
                          / {String(quizQuestions.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* 題目 */}
                      <h2 className="font-serif-tc text-[clamp(1.3rem,3vw,1.6rem)] text-ivory/85 leading-relaxed mb-8 text-balance">
                        {question.question}
                      </h2>

                      {/* 選項 */}
                      <div className="space-y-3">
                        {question.options.map((opt, i) => (
                          <QuizCard
                            key={opt.id}
                            option={opt}
                            selected={answers[currentQ] === opt.id}
                            onSelect={handleSelect}
                            index={i}
                          />
                        ))}
                      </div>

                      {/* 進度條 */}
                      <div className="mt-8 h-px bg-ivory/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gold/40"
                          initial={{ width: `${(currentQ / quizQuestions.length) * 100}%` }}
                          animate={{
                            width: `${((currentQ + 1) / quizQuestions.length) * 100}%`,
                          }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    /* 結果頁 */
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-center py-4"
                    >
                      {/* 結果裝飾 */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="w-16 h-16 mx-auto mb-8 rounded-full border border-gold/20
                                   flex items-center justify-center"
                        style={{
                          boxShadow: "0 0 40px -10px rgba(184, 149, 63, 0.3)",
                        }}
                      >
                        <span className="text-gold text-2xl">✦</span>
                      </motion.div>

                      {/* 結果標題 */}
                      <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="font-serif-tc text-[clamp(1.3rem,3vw,1.6rem)] text-ivory/85
                                   leading-relaxed mb-10 text-balance"
                      >
                        {resultData?.title}
                      </motion.h2>

                      {/* CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                      >
                        <MagneticButton
                          href={resultData?.cta1.href}
                          variant="gold"
                          onClick={handleClose}
                        >
                          {resultData?.cta1.text}
                        </MagneticButton>
                        <MagneticButton
                          href={resultData?.cta2.href}
                          variant="ghost"
                          className="text-ivory/40 border-ivory/10 hover:text-ivory/70 hover:border-ivory/25"
                          onClick={handleClose}
                        >
                          {resultData?.cta2.text}
                        </MagneticButton>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 頁尾重做按鈕 — 只在已完成測驗後顯示 */}
      {!isOpen && (
        <button
          onClick={handleRestart}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 text-xs font-body
                     text-ivory/20 bg-night/60 backdrop-blur-sm border border-ivory/5
                     rounded-full hover:text-ivory/40 hover:border-ivory/10
                     transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30"
        >
          重做一次自我對話
        </button>
      )}
    </>
  );
}
