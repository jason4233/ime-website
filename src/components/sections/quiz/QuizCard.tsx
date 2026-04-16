"use client";

import { motion } from "framer-motion";
import type { QuizOption } from "./quizData";

interface QuizCardProps {
  option: QuizOption;
  selected: boolean;
  onSelect: (id: string) => void;
  index: number;
}

export function QuizCard({ option, selected, onSelect, index }: QuizCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onSelect(option.id)}
      className={`group relative w-full text-left px-6 py-5 rounded-lg border
                 transition-all duration-500 ease-spring
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50
                 ${
                   selected
                     ? "border-brand/40 bg-brand/8"
                     : "border-ivory/8 bg-ivory/3 hover:border-ivory/15 hover:bg-ivory/5"
                 }`}
      whileHover={{
        rotateX: -1,
        rotateY: 2,
        scale: 1.01,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.99 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* 選中時的金色光暈 */}
      {selected && (
        <motion.div
          layoutId="quiz-glow"
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: "0 0 30px -5px rgba(123, 47, 190, 0.2), 0 0 20px -5px rgba(184, 149, 63, 0.1), inset 0 1px 0 rgba(123, 47, 190, 0.15)",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <div className="relative z-10 flex items-start gap-4">
        {/* 選項標記 */}
        <span
          className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center
                     text-xs font-body font-medium transition-all duration-300
                     ${
                       selected
                         ? "border-brand bg-brand text-ivory"
                         : "border-ivory/15 text-ivory/30 group-hover:border-ivory/30"
                     }`}
        >
          {String.fromCharCode(65 + index)}
        </span>

        {/* 選項文字 */}
        <p
          className={`font-sans-tc text-[0.95rem] leading-relaxed transition-colors duration-300
                     ${selected ? "text-ivory/90" : "text-ivory/50 group-hover:text-ivory/70"}`}
        >
          {option.text}
        </p>
      </div>
    </motion.button>
  );
}
