"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({ children, className = "", delay = 0, once = true }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}
