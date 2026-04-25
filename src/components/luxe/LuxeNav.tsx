"use client";

import { useEffect, useState } from "react";

export function LuxeNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
        ${scrolled
          ? "bg-luxe-bgBase/70 backdrop-blur-2xl border-b border-luxe-ivory/5"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <a href="/luxe" className="group inline-flex items-baseline gap-2.5">
          <span className="font-display italic text-2xl tracking-tight text-luxe-ivory">
            i me
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.4em] text-luxe-gold/80 sm:inline">
            Luxe
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {[
            ["品牌", "#promise"],
            ["分子", "#molecule"],
            ["皮膚旅程", "#skin"],
            ["產品", "#vial"],
            ["見證", "#proof"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="group relative font-sans text-[0.78rem] font-light tracking-[0.16em] uppercase text-luxe-ivoryDim transition-colors duration-300 hover:text-luxe-ivory"
            >
              {label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-luxe-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#appointment"
          className="group inline-flex items-center gap-2 rounded-pill border border-luxe-gold/40 bg-luxe-gold/5 px-5 py-2.5 font-sans text-[0.78rem] font-medium tracking-[0.14em] uppercase text-luxe-gold transition-all duration-500 hover:border-luxe-gold hover:bg-luxe-gold hover:text-luxe-ink hover:shadow-[0_0_30px_-5px_rgba(202,138,4,0.5)]"
        >
          <span>預約</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-500 group-hover:translate-x-0.5">
            <path d="M2 6h8m0 0L6 2m4 4L6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}
