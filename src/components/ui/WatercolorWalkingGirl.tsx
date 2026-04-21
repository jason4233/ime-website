"use client";

/**
 * WatercolorWalkingGirl — 真正會走路的水彩女生 SVG
 *
 * 技術：
 *   • 身體分 7 組（頭/髮/軀幹/裙/後臂/前臂/後腿/前腿）
 *   • 每組有獨立的 transform-origin 跟 CSS keyframe 動畫
 *   • Walk cycle 1.2s 循環：腿部 rotate ±22°、手臂 rotate ±18°（前後相位反向）
 *   • 身體 bob：1.2s 週期 y: 0/-3/0/-3/0，模擬踏地→身體下沉的物理感
 *   • SVG filter feTurbulence + feDisplacementMap → 邊緣水彩毛邊質感
 *   • linearGradient 做紫/金水彩漸層
 *
 * 為什麼不用 AI 生圖：AI 只能生靜止姿勢，腳沒法動。關節獨立 SVG 才做得到真走路。
 */

export function WatercolorWalkingGirl({
  variant = "purple",
  className = "",
}: {
  variant?: "purple" | "gold";
  className?: string;
}) {
  const isGold = variant === "gold";
  const bodyColor = isGold ? "#D4B36A" : "#5E2B8A";
  const bodyDark = isGold ? "#8C6F2A" : "#3A1555";
  const skinColor = "#F5D9C6";
  const hairColor = isGold ? "#3A2A1A" : "#2F2420";
  // seed 讓水彩 filter 對 purple / gold 產生略不同 pattern
  const seed = isGold ? 11 : 7;

  return (
    <svg
      viewBox="0 0 200 450"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* 水彩毛邊 filter */}
        <filter
          id={`wc-${variant}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="3.2" />
        </filter>
        {/* 水彩漸層 */}
        <linearGradient
          id={`body-${variant}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={bodyColor} stopOpacity="0.92" />
          <stop offset="100%" stopColor={bodyDark} stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* body-bob: 整個人上下起伏模擬步伐 */}
      <g className="wcgirl-bob">
        {/* ── 後腿（先畫，被前腿蓋） ── */}
        <g
          className="wcgirl-leg-back"
          style={{ transformOrigin: "100px 280px", transformBox: "fill-box" }}
        >
          <path
            d="M 94 280 L 86 420 L 100 420 L 108 280 Z"
            fill={`url(#body-${variant})`}
            filter={`url(#wc-${variant})`}
            opacity="0.78"
          />
          <ellipse
            cx="93"
            cy="426"
            rx="13"
            ry="4.5"
            fill={bodyDark}
            opacity="0.7"
          />
        </g>

        {/* ── 後手臂 ── */}
        <g
          className="wcgirl-arm-back"
          style={{ transformOrigin: "100px 165px", transformBox: "fill-box" }}
        >
          <path
            d="M 92 165 Q 82 215 88 275"
            stroke={`url(#body-${variant})`}
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
            filter={`url(#wc-${variant})`}
            opacity="0.72"
          />
        </g>

        {/* ── 裙子 / 斗篷 ── */}
        <path
          d="M 82 198 L 70 300 L 55 365 L 145 365 L 130 300 L 118 198 Z"
          fill={`url(#body-${variant})`}
          filter={`url(#wc-${variant})`}
          opacity="0.88"
        />
        {/* 裙擺飄動紋路 */}
        <path
          d="M 65 340 Q 100 350 135 340"
          stroke={bodyDark}
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
          filter={`url(#wc-${variant})`}
        />

        {/* ── 軀幹 ── */}
        <path
          d="M 86 100 L 82 200 L 118 200 L 114 100 Z"
          fill={`url(#body-${variant})`}
          filter={`url(#wc-${variant})`}
        />
        {/* 領口 V */}
        <path
          d="M 90 105 L 100 118 L 110 105"
          stroke={bodyDark}
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />

        {/* ── 頭 ── */}
        <circle
          cx="100"
          cy="70"
          r="26"
          fill={skinColor}
          filter={`url(#wc-${variant})`}
        />
        {/* 腮紅 */}
        <ellipse cx="86" cy="74" rx="5" ry="3" fill="#E8B8AA" opacity="0.5" />

        {/* ── 頭髮（側面長髮後拋） ── */}
        <path
          d="M 74 58 Q 78 40 100 38 Q 122 40 126 60 Q 130 80 128 100 L 118 100 L 118 60 Q 112 50 100 48 Q 85 52 82 65 Z"
          fill={hairColor}
          opacity="0.92"
          filter={`url(#wc-${variant})`}
        />
        {/* 飄揚的髮絲 */}
        <path
          d="M 118 55 Q 135 58 145 70"
          stroke={hairColor}
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
          className="wcgirl-hair-sway"
          style={{ transformOrigin: "118px 55px", transformBox: "fill-box" }}
        />

        {/* ── 前腿（蓋在後腿上） ── */}
        <g
          className="wcgirl-leg-front"
          style={{ transformOrigin: "100px 280px", transformBox: "fill-box" }}
        >
          <path
            d="M 96 280 L 92 420 L 108 420 L 112 280 Z"
            fill={`url(#body-${variant})`}
            filter={`url(#wc-${variant})`}
          />
          <ellipse
            cx="100"
            cy="425"
            rx="14"
            ry="4.8"
            fill={bodyDark}
            opacity="0.88"
          />
        </g>

        {/* ── 前手臂 ── */}
        <g
          className="wcgirl-arm-front"
          style={{ transformOrigin: "100px 165px", transformBox: "fill-box" }}
        >
          <path
            d="M 108 165 Q 120 218 113 275"
            stroke={`url(#body-${variant})`}
            strokeWidth="15"
            fill="none"
            strokeLinecap="round"
            filter={`url(#wc-${variant})`}
          />
          {/* 手 */}
          <circle cx="113" cy="275" r="6" fill={skinColor} opacity="0.85" />
        </g>
      </g>
    </svg>
  );
}
