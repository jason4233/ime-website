"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "品牌故事", href: "/about" },
  { label: "核心技術", href: "/products" },
  { label: "培訓課程", href: "/training" },
  { label: "聯繫我們", href: "/contact" },
];

// 純 CSS/state Header — 移除 Framer Motion + AnimatePresence
// 保留 scroll-based theme (home dark hero → scrolled light) + 漢堡選單
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const onDarkHero = isHome && !scrolled;

  const navTextColor = onDarkHero ? "text-ivory/70 hover:text-ivory" : "text-night/70 hover:text-night";
  const hamburgerColor = onDarkHero ? "bg-ivory" : "bg-night";

  return (
    <>
      <header
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

          {/* Mobile menu button — pure CSS 漢堡 */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[60]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-brand"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
          >
            <span
              className={`w-5 h-[1.5px] rounded-full transition-all duration-300 ease-spring ${
                menuOpen ? "bg-ivory rotate-45 translate-y-[4.5px]" : `${hamburgerColor} rotate-0 translate-y-0`
              }`}
            />
            <span
              className={`w-5 h-[1.5px] rounded-full transition-all duration-300 ease-spring ${
                menuOpen ? "bg-ivory -rotate-45 -translate-y-[4.5px]" : `${hamburgerColor} rotate-0 translate-y-0`
              }`}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu — 用 opacity/pointer-events 切換，不用 AnimatePresence */}
      <div
        className={`fixed inset-0 z-[55] bg-night/95 backdrop-blur-2xl flex flex-col items-center justify-center noise-overlay
                    transition-opacity duration-400 ease-spring
                    ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute top-0 left-[20%] w-px h-[30vh] bg-gradient-to-b from-gold/15 to-transparent" />
        <div className="absolute bottom-0 right-[25%] w-px h-[20vh] bg-gradient-to-t from-gold/10 to-transparent" />

        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`font-serif-tc text-h3 text-ivory/70 hover:text-ivory
                         transition-all duration-500 ease-spring
                         focus-visible:outline-none focus-visible:text-gold
                         ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: menuOpen ? `${100 + i * 80}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className={`btn-gold text-base px-10 py-4 mt-4 transition-all duration-500 ease-spring
                       ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: menuOpen ? `${100 + navItems.length * 80}ms` : "0ms" }}
          >
            預約體驗
          </Link>

          <p className="mt-8 font-elegant italic text-sm text-gold/40 tracking-[0.15em]">
            Exosome Beauty for you
          </p>
        </nav>
      </div>
    </>
  );
}
