"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Masonry from "react-masonry-css";
import { TextReveal } from "@/components/ui/TextReveal";

// Placeholder 證書（之後由後台 API 提供）
const certificates = [
  { id: 1, title: "INCI 國際原料登錄", issuer: "Personal Care Products Council", aspect: "4/3", imageUrl: "https://placehold.co/400x300/1a1a1a/B8953F?text=INCI%0AMono+ID+40148" },
  { id: 2, title: "衛部醫器製字第 008446 號", issuer: "台灣衛生福利部", aspect: "3/4", imageUrl: "https://placehold.co/300x400/1a1a1a/7B2FBE?text=TFDA%0A008446" },
  { id: 3, title: "中國發明專利 — 組織細胞裝置設備", issuer: "中國國家知識產權局", aspect: "3/4", imageUrl: "https://placehold.co/300x400/1a1a1a/D4B96A?text=CN+Patent" },
  { id: 4, title: "中國發明專利 — 細胞分注儲存裝置", issuer: "中國國家知識產權局", aspect: "3/4", imageUrl: "https://placehold.co/300x400/1a1a1a/D4B96A?text=CN+Patent+2" },
  { id: 5, title: "韓國發明專利 10-1793032", issuer: "Korean Intellectual Property Office", aspect: "3/4", imageUrl: "https://placehold.co/300x400/1a1a1a/9B5DD4?text=KR+Patent" },
  { id: 6, title: "韓國發明專利 10-2242615", issuer: "Korean Intellectual Property Office", aspect: "3/4", imageUrl: "https://placehold.co/300x400/1a1a1a/9B5DD4?text=KR+Patent+2" },
  { id: 7, title: "中國發明專利 — 細胞培養裝置", issuer: "中國國家知識產權局", aspect: "4/3", imageUrl: "https://placehold.co/400x300/1a1a1a/D4B96A?text=CN+Patent+3" },
];

function CertCard({ cert, index, onClick }: {
  cert: typeof certificates[0];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -10,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="mb-4 cursor-pointer group"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <motion.div
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ duration: 0.2 }}
        className="relative rounded-lg overflow-hidden border border-ivory/5
                   group-hover:border-brand/20 transition-colors duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.imageUrl}
          alt={cert.title}
          className="w-full h-auto"
          style={{ aspectRatio: cert.aspect }}
        />
        {/* 玻璃反光效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0
                       opacity-0 group-hover:opacity-100 transition-opacity duration-500
                       pointer-events-none" />
        {/* 底部資訊 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-night/80 to-transparent">
          <p className="font-sans-tc text-[0.7rem] text-ivory/80 font-medium truncate">
            {cert.title}
          </p>
          <p className="font-body text-[0.6rem] text-ivory/30 truncate">
            {cert.issuer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CertificateSection() {
  const [lightbox, setLightbox] = useState<typeof certificates[0] | null>(null);

  const breakpoints = { default: 3, 768: 2, 480: 1 };

  return (
    <section className="py-section-lg bg-ivory relative overflow-hidden noise-overlay">
      <div className="absolute top-0 left-[22%] w-px h-[20vh] bg-gradient-to-b from-brand/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <TextReveal>
            <p className="text-overline text-brand uppercase tracking-[0.25em] font-body mb-4">
              Certifications & Patents
            </p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h2 className="font-serif-tc text-h1 text-night">
              每一張證書，都是一份承諾
            </h2>
          </TextReveal>
        </div>

        <Masonry
          breakpointCols={breakpoints}
          className="flex gap-4 -ml-4"
          columnClassName="pl-4"
        >
          {certificates.map((cert, i) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={i}
              onClick={() => setLightbox(cert)}
            />
          ))}
        </Masonry>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0 bg-night/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 max-w-2xl w-full max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="font-serif-tc text-xl text-ivory font-medium">
                  {lightbox.title}
                </h3>
                <p className="font-body text-caption text-ivory/40 mt-1">
                  {lightbox.issuer}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-night/60 border border-ivory/10
                           flex items-center justify-center text-ivory/50 hover:text-ivory
                           transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
