"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "品牌故事", href: "/about" },
  { label: "核心技術", href: "/products" },
  { label: "培訓課程", href: "/training" },
  { label: "聯繫我們", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  // 只有首頁 Hero 未滾動時才用淺色字（Hero 背景是深色）
  // 其他頁面頂部是淺色背景 → 永遠用深色字
  const isHome = pathname === "/";
  const onDarkHero = isHome && !scrolled;

  const navTextColor = onDarkHero ? "text-ivory/70 hover:text-ivory" : "text-night/70 hover:text-night";
  const hamburgerColor = onDarkHero ? "bg-ivory" : "bg-night";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-spring ${
          onDarkHero
            ? "py-6 bg-transparent"
            : "py-3 bg-ivory/85 backdrop-blur-xl shadow-elevated"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Logo variant={onDarkHero ? "light" : "dark"} showSlogan={onDarkHero} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-caption font-sans-tc font-medium transition-colors duration-300
                           after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px]
                           after:bg-brand after:transition-all after:duration-500 after:ease-spring
                           hover:after:w-full
                           focus-visible:outline-none focus-visible:text-gold
                           ${navTextColor}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-gold text-caption">
              預約體驗
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[60]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-brand"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-5 h-[1.5px] rounded-full transition-colors duration-300 ${
                menuOpen ? "bg-ivory" : hamburgerColor
              }`}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-5 h-[1.5px] rounded-full transition-colors duration-300 ${
                menuOpen ? "bg-ivory" : hamburgerColor
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-night/95 backdrop-blur-2xl flex flex-col items-center justify-center noise-overlay"
          >
            <div className="absolute top-0 left-[20%] w-px h-[30vh] bg-gradient-to-b from-gold/15 to-transparent" />
            <div className="absolute bottom-0 right-[25%] w-px h-[20vh] bg-gradient-to-t from-gold/10 to-transparent" />

            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif-tc text-h3 text-ivory/70 hover:text-ivory
                               transition-colors duration-300
                               focus-visible:outline-none focus-visible:text-gold"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + navItems.length * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-4"
              >
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold text-base px-10 py-4"
                >
                  預約體驗
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 font-elegant italic text-sm text-gold/40 tracking-[0.15em]"
              >
                Exosome Beauty for you
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
