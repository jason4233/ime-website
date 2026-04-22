import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌色系
        ivory: "#FAF7F2",
        night: "#0A0A0A",
        gold: {
          DEFAULT: "#B8953F",
          light: "#D4B96A",
          dark: "#8C6F2A",
        },
        brand: {
          DEFAULT: "#7B2FBE",
          light: "#9B5DD4",
          dark: "#5E1F96",
          glow: "rgba(123, 47, 190, 0.15)",
        },
        mist: "#E8E2D8",
        rose: {
          nude: "#D4A89B",
          light: "#E8C4BA",
        },
        // 品牌深色變體（溫柔不壓迫，適合長時間閱讀）
        deep: {
          purple: "#3A2A4E",     // 中深紫 — 柔霧莓紫
          amber: "#4A3E32",      // 中深琥珀 — 溫暖焦糖
          rose: "#4F3A3A",       // 中深玫瑰 — 親密可可
          forest: "#2F3E38",     // 中深森林 — 沉穩綠灰
        },
        cream: {
          warm: "#F5EBE5",       // 暖米
          rose: "#F0E2DC",       // 玫瑰米
          amber: "#F2E9D5",      // 琥珀米
        },
        // 功能色
        surface: {
          base: "#FAF7F2",
          elevated: "#FFFFFF",
          floating: "#FFFCF8",
        },
        // ═══════════════════════════════════════════════════
        // V3 — Oriental Atelier
        // "Sulwhasoo 人蔘暖意 + Tatcha 宣紙寧靜 + Whoo 朱砂印 + 台灣藥鋪卷軸"
        // ═══════════════════════════════════════════════════
        vermillion: {
          DEFAULT: "#B8322C",    // 朱砂紅 — 印章 accent，只用在最重要時刻
          light: "#D14A3F",
          dark: "#8E1F1C",
        },
        ink: {
          DEFAULT: "#1A1514",    // 墨黑 — 比純黑更暖，適合大面積
          deep: "#0D0908",
          brush: "#3A2F2C",
        },
        aubergine: {
          DEFAULT: "#2E1C3A",    // 深茄紫 — Hero + Product 信號色
          deep: "#1F1228",
          light: "#4A2F5E",
        },
        plum: {                  // agent brief 指定的奢華紫
          DEFAULT: "#5B2A6E",
          dark: "#3F1A4D",
          light: "#7B2FBE",
        },
        paper: {
          cream: "#F7F2E9",      // 宣紙 — 主背景
          warm: "#EFE6D5",       // 老紙 — 進階底色
          rice: "#FAF5EC",       // 米白 — 最淺
        },
        leaf: {
          gold: "#C9A46B",       // 金箔 — 啞光材質感
          goldLight: "#E6CFA0",  // 柔金
          goldDeep: "#8E6F3B",   // 沉金
        },
        jade: {                  // 認證信任色 — agent brief 新增
          DEFAULT: "#7A9B84",
          light: "#A0BBA8",
          dark: "#5A7A64",
        },
      },
      fontFamily: {
        "serif-tc": ["var(--font-serif-tc)", "serif"],
        "sans-tc": ["var(--font-sans-tc)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        elegant: ["var(--font-elegant)", "serif"],
        handwriting: ['"ChenYuluoyan"', '"Noto Serif TC"', "serif"],
      },
      fontSize: {
        // 標題系統
        "hero": ["clamp(3rem, 8vw, 7.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h1": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h2": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "h3": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "subtitle": ["clamp(1.125rem, 1.5vw, 1.5rem)", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.7" }],
        "caption": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        "overline": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.15em" }],
      },
      spacing: {
        // 區塊間距 token
        "section": "clamp(5rem, 12vh, 8rem)",
        "section-lg": "clamp(6rem, 15vh, 10rem)",
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        "brand": "0.375rem",
      },
      boxShadow: {
        "elevated": "0 4px 24px -2px rgba(10, 10, 10, 0.06), 0 2px 8px -2px rgba(10, 10, 10, 0.04)",
        "floating": "0 12px 48px -4px rgba(10, 10, 10, 0.1), 0 4px 16px -2px rgba(10, 10, 10, 0.06)",
        "gold-glow": "0 0 24px -4px rgba(184, 149, 63, 0.3)",
        "brand-glow": "0 0 24px -4px rgba(123, 47, 190, 0.3)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scroll-hint": {
          "0%, 100%": { opacity: "0.4", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s var(--spring) forwards",
        "fade-in": "fade-in 0.6s var(--smooth) forwards",
        "scroll-hint": "scroll-hint 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
