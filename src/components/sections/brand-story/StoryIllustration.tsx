"use client";

import { motion } from "framer-motion";

/**
 * 精緻版 · 小王子風格插畫
 * 參考 Saint-Exupéry 原版水彩墨線風格
 * 特色：手繪墨線輪廓 + 水彩柔邊色塊 + 星辰裝飾 + 紙質紋理
 */

// 共用 SVG defs — 紙質紋理 + 水彩模糊 filter
function StoryDefs({ id }: { id: string }) {
  return (
    <defs>
      {/* 紙質紋理 */}
      <filter id={`${id}-paper`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
        <feColorMatrix in="noise" type="matrix"
          values="0 0 0 0 0.9  0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0.04 0" />
      </filter>
      {/* 水彩柔邊 */}
      <filter id={`${id}-watercolor`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        <feColorMatrix in="blur" type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.2 -0.1" />
      </filter>
      {/* 手繪粗糙邊 */}
      <filter id={`${id}-rough`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" />
        <feDisplacementMap in="SourceGraphic" scale="1.5" />
      </filter>
    </defs>
  );
}

// 手繪風墨線路徑（用 stroke-dasharray 呈現手繪不連續感）
const handDrawnStyle = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ═══════════════════════════════════════════════════
// ACT 1 — 鏡前獨自的女孩（對自己的迴避）
// ═══════════════════════════════════════════════════
export function MirrorIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <StoryDefs id="act1" />

      {/* 水彩暈染的背景色塊 */}
      <g opacity="0.35" filter="url(#act1-watercolor)">
        <ellipse cx="300" cy="340" rx="240" ry="180" fill="#E8C4BA" opacity="0.4" />
        <ellipse cx="320" cy="300" rx="180" ry="160" fill="#F5D9C6" opacity="0.5" />
      </g>

      {/* 星空 */}
      {[
        { x: 80, y: 80, r: 1.8, d: 0 },
        { x: 520, y: 100, r: 2.2, d: 0.5 },
        { x: 480, y: 200, r: 1.5, d: 1 },
        { x: 60, y: 250, r: 2, d: 1.5 },
        { x: 540, y: 380, r: 1.8, d: 2 },
        { x: 100, y: 420, r: 1.2, d: 2.5 },
        { x: 250, y: 60, r: 1.5, d: 0.3 },
        { x: 400, y: 50, r: 2, d: 1.2 },
      ].map((s, i) => (
        <motion.g key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + s.d, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
        >
          {/* 4 角星芒 */}
          <path
            d={`M ${s.x} ${s.y - s.r * 4} L ${s.x + s.r * 0.7} ${s.y - s.r * 0.7} L ${s.x + s.r * 4} ${s.y} L ${s.x + s.r * 0.7} ${s.y + s.r * 0.7} L ${s.x} ${s.y + s.r * 4} L ${s.x - s.r * 0.7} ${s.y + s.r * 0.7} L ${s.x - s.r * 4} ${s.y} L ${s.x - s.r * 0.7} ${s.y - s.r * 0.7} Z`}
            fill="#D4B96A"
          />
          <circle cx={s.x} cy={s.y} r={s.r * 1.5} fill="#D4B96A" opacity="0.25" />
        </motion.g>
      ))}

      {/* 小星球地平線（黃色沙丘） */}
      <motion.path
        d="M 30 480 Q 150 460, 300 465 Q 450 470, 570 475"
        stroke="#B8953F"
        strokeWidth="1.5"
        strokeDasharray="0 1"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {/* 地面水彩陰影 */}
      <motion.ellipse
        cx="300" cy="485" rx="260" ry="20"
        fill="#B8953F" opacity="0.15"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />

      {/* ━━━━━━ 立式鏡 ━━━━━━ */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        {/* 鏡架底座 */}
        <line x1="395" y1="470" x2="395" y2="395" stroke="#3A1F16" strokeWidth="2.5" fill="none" {...handDrawnStyle} />
        <ellipse cx="395" cy="475" rx="22" ry="5" fill="#3A1F16" opacity="0.5" />
        {/* 底座小腳 */}
        <line x1="380" y1="478" x2="372" y2="482" stroke="#3A1F16" strokeWidth="2" fill="none" {...handDrawnStyle} />
        <line x1="410" y1="478" x2="418" y2="482" stroke="#3A1F16" strokeWidth="2" fill="none" {...handDrawnStyle} />

        {/* 鏡框（橢圓 + 外框兩層） */}
        <ellipse cx="395" cy="290" rx="62" ry="90"
          {...handDrawnStyle}
          fill="rgba(245,217,198,0.2)"
          stroke="#3A1F16" strokeWidth="2.5" />
        <ellipse cx="395" cy="290" rx="55" ry="82"
          fill="none"
          stroke="#B8953F" strokeWidth="1" opacity="0.6" />

        {/* 鏡內倒影（模糊的她） */}
        <motion.g
          filter="url(#act1-watercolor)"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {/* 模糊頭影 */}
          <ellipse cx="395" cy="270" rx="18" ry="22" fill="#C99885" opacity="0.5" />
          {/* 模糊身影 */}
          <path d="M 365 310 Q 395 340, 425 310 L 430 355 L 360 355 Z" fill="#7B2FBE" opacity="0.2" />
        </motion.g>

        {/* 鏡面高光 */}
        <path d="M 355 255 Q 375 230, 395 240" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" {...handDrawnStyle} />
        <path d="M 425 340 Q 430 355, 420 365" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" {...handDrawnStyle} />
      </motion.g>

      {/* ━━━━━━ 女孩（側身，背對鏡子） ━━━━━━ */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, delay: 0.8 }}
      >
        {/* 頭髮（深褐色長髮） */}
        <path
          d="M 220 255
             Q 200 235, 205 205
             Q 215 175, 250 168
             Q 285 168, 290 200
             Q 295 225, 285 250
             Q 285 280, 278 315
             Q 272 350, 265 380"
          fill="#4A2F22"
          stroke="#3A1F16" strokeWidth="1.8" {...handDrawnStyle}
        />
        {/* 頭髮高光 */}
        <path d="M 225 195 Q 240 180, 260 180" stroke="#6A4A36" strokeWidth="1.5" fill="none" {...handDrawnStyle} opacity="0.6" />

        {/* 臉龐（側面） */}
        <path
          d="M 235 215
             Q 228 228, 232 248
             Q 240 263, 258 265
             Q 275 261, 282 245
             Q 286 228, 280 213
             Q 270 200, 255 200
             Q 242 202, 235 215 Z"
          fill="#F5D9C6"
          stroke="#C99885" strokeWidth="1.2" {...handDrawnStyle}
        />

        {/* 側面五官 */}
        {/* 眉 */}
        <path d="M 268 222 Q 275 220, 280 223" stroke="#3A1F16" strokeWidth="1.8" fill="none" {...handDrawnStyle} />
        {/* 眼（閉眼一條線） */}
        <path d="M 270 234 Q 278 234, 282 236" stroke="#3A1F16" strokeWidth="1.5" fill="none" {...handDrawnStyle} />
        {/* 鼻 */}
        <path d="M 283 236 Q 286 244, 283 250" stroke="#C99885" strokeWidth="1" fill="none" {...handDrawnStyle} />
        {/* 唇 */}
        <path d="M 277 254 Q 282 256, 279 259" stroke="#D4A89B" strokeWidth="1.8" fill="none" {...handDrawnStyle} />
        {/* 腮紅 */}
        <ellipse cx="270" cy="248" rx="5" ry="3" fill="#E8B8AA" opacity="0.5" />

        {/* 頸部 */}
        <path d="M 258 265 L 260 285" stroke="#F5D9C6" strokeWidth="12" strokeLinecap="round" />
        <path d="M 258 265 L 260 285" stroke="#C99885" strokeWidth="1" fill="none" {...handDrawnStyle} opacity="0.4" />

        {/* 身體（紫色長袍） */}
        <path
          d="M 225 290
             Q 215 305, 210 340
             L 195 420
             Q 195 435, 208 438
             L 290 438
             Q 303 438, 300 425
             L 285 345
             Q 280 305, 275 290
             Q 268 285, 250 285
             Q 232 285, 225 290 Z"
          fill="#7B2FBE" opacity="0.6"
          stroke="#5E1F96" strokeWidth="1.8" {...handDrawnStyle}
        />
        {/* 長袍褶皺 */}
        <path d="M 235 305 Q 240 350, 235 410" stroke="#5E1F96" strokeWidth="1" fill="none" {...handDrawnStyle} opacity="0.4" />
        <path d="M 265 305 Q 270 355, 267 415" stroke="#5E1F96" strokeWidth="1" fill="none" {...handDrawnStyle} opacity="0.4" />
        {/* 領口 */}
        <path d="M 240 287 Q 250 298, 262 287" stroke="#5E1F96" strokeWidth="1.5" fill="none" {...handDrawnStyle} />

        {/* 手（下垂輕握） */}
        <circle cx="210" cy="395" r="5" fill="#F5D9C6" stroke="#C99885" strokeWidth="1" />
      </motion.g>

      {/* 飄落的花瓣（象徵流逝的時光） */}
      {[
        { x: 330, y: 180, delay: 0 },
        { x: 345, y: 210, delay: 1.2 },
        { x: 318, y: 240, delay: 2.4 },
        { x: 355, y: 270, delay: 3.6 },
      ].map((p, i) => (
        <motion.g key={i}
          animate={{
            y: [0, 60, 120],
            x: [0, 8, -4],
            opacity: [0, 0.7, 0],
            rotate: [0, 120, 240],
          }}
          transition={{
            duration: 6,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        >
          <ellipse cx={p.x} cy={p.y} rx="3.5" ry="6" fill="#D4A89B" opacity="0.85" />
          <path d={`M ${p.x} ${p.y - 5} L ${p.x} ${p.y + 5}`} stroke="#C99885" strokeWidth="0.8" fill="none" {...handDrawnStyle} />
        </motion.g>
      ))}

      {/* 詩句（法文斜體感） */}
      <motion.text
        x="70" y="540"
        fill="#3A1F16"
        opacity="0.45"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="15"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2, delay: 1.8 }}
      >
        ＂when did I stop looking?＂
      </motion.text>

      {/* 紙質紋理疊加 */}
      <rect width="600" height="600" filter="url(#act1-paper)" opacity="0.5" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// ACT 2 — 小王子在星球間送信（細胞間的郵差）
// ═══════════════════════════════════════════════════
export function CellMessengerIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <StoryDefs id="act2" />
      <defs>
        <radialGradient id="planet-violet" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#D4A3F5" />
          <stop offset="60%" stopColor="#9B5DD4" />
          <stop offset="100%" stopColor="#5E1F96" />
        </radialGradient>
        <radialGradient id="planet-amber" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#F5E6B8" />
          <stop offset="60%" stopColor="#D4B96A" />
          <stop offset="100%" stopColor="#8C6F2A" />
        </radialGradient>
        <radialGradient id="sky-bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#2C1D4A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 夜空水彩底 */}
      <rect width="600" height="600" fill="url(#sky-bg)" />

      {/* 星空 — 更多更細緻 */}
      {[
        { x: 60, y: 60, r: 2 }, { x: 540, y: 80, r: 2.5 },
        { x: 90, y: 180, r: 1.5 }, { x: 510, y: 200, r: 1.8 },
        { x: 40, y: 310, r: 2.2 }, { x: 560, y: 300, r: 1.6 },
        { x: 120, y: 440, r: 1.8 }, { x: 490, y: 460, r: 2 },
        { x: 300, y: 40, r: 2.5 }, { x: 200, y: 70, r: 1.4 },
        { x: 420, y: 60, r: 1.6 }, { x: 360, y: 130, r: 1.2 },
        { x: 170, y: 140, r: 1.3 },
      ].map((s, i) => (
        <motion.g key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <path
            d={`M ${s.x} ${s.y - s.r * 3.5} L ${s.x + s.r * 0.6} ${s.y - s.r * 0.6} L ${s.x + s.r * 3.5} ${s.y} L ${s.x + s.r * 0.6} ${s.y + s.r * 0.6} L ${s.x} ${s.y + s.r * 3.5} L ${s.x - s.r * 0.6} ${s.y + s.r * 0.6} L ${s.x - s.r * 3.5} ${s.y} L ${s.x - s.r * 0.6} ${s.y - s.r * 0.6} Z`}
            fill="#D4B96A"
          />
          <circle cx={s.x} cy={s.y} r={s.r * 2} fill="#D4B96A" opacity="0.2" />
        </motion.g>
      ))}

      {/* 小星雲（像小王子原畫的雲朵輪廓） */}
      <motion.path
        d="M 120 480 Q 150 470, 180 478 Q 200 478, 210 485 Q 195 495, 170 495 Q 140 495, 120 490 Z"
        fill="#E8C4BA" opacity="0.25"
        initial={{ opacity: 0 }} animate={{ opacity: 0.25 }}
        transition={{ duration: 2, delay: 1 }}
      />
      <motion.path
        d="M 420 510 Q 450 500, 480 510 Q 490 515, 475 520 Q 445 520, 420 515 Z"
        fill="#C99885" opacity="0.2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
        transition={{ duration: 2, delay: 1.3 }}
      />

      {/* ━━━━━━ 星球 A（紫色，來源細胞） ━━━━━━ */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 陰影 */}
        <ellipse cx="140" cy="390" rx="88" ry="14" fill="#5E1F96" opacity="0.3" />
        {/* 星球本體 */}
        <circle cx="140" cy="320" r="78" fill="url(#planet-violet)" />
        {/* 光澤高光 */}
        <ellipse cx="118" cy="298" rx="28" ry="18" fill="rgba(255,255,255,0.35)" />
        <circle cx="125" cy="305" r="6" fill="rgba(255,255,255,0.7)" />

        {/* 星球環（土星環感） */}
        <ellipse cx="140" cy="325" rx="105" ry="16"
          fill="none" stroke="#9B5DD4" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="140" cy="327" rx="115" ry="14"
          fill="none" stroke="#C8A8E8" strokeWidth="1" opacity="0.35" />

        {/* 星球表面紋路 */}
        <path d="M 80 330 Q 140 345, 200 325" stroke="#5E1F96" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 90 355 Q 140 370, 190 350" stroke="#5E1F96" strokeWidth="1" fill="none" opacity="0.3" />

        {/* 星球上的小樹（小王子風） */}
        <motion.g
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: "backOut" }}
          style={{ transformOrigin: "140px 265px" }}
        >
          <line x1="140" y1="245" x2="140" y2="265" stroke="#3A1F16" strokeWidth="2" fill="none" {...handDrawnStyle} />
          {/* 橢圓樹冠 */}
          <ellipse cx="140" cy="235" rx="14" ry="10" fill="#4A7C4A" />
          <ellipse cx="134" cy="232" rx="8" ry="6" fill="#6A9C6A" opacity="0.7" />
          {/* 小果實 */}
          <circle cx="144" cy="232" r="2" fill="#D4A89B" />
        </motion.g>
      </motion.g>

      {/* ━━━━━━ 星球 B（金色，接收細胞） ━━━━━━ */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 陰影 */}
        <ellipse cx="460" cy="390" rx="88" ry="14" fill="#8C6F2A" opacity="0.3" />
        {/* 星球本體 */}
        <circle cx="460" cy="320" r="78" fill="url(#planet-amber)" />
        {/* 高光 */}
        <ellipse cx="438" cy="298" rx="28" ry="18" fill="rgba(255,255,255,0.4)" />
        <circle cx="445" cy="305" r="6" fill="rgba(255,255,255,0.8)" />

        {/* 星球環 */}
        <ellipse cx="460" cy="325" rx="105" ry="16"
          fill="none" stroke="#D4B96A" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="460" cy="327" rx="115" ry="14"
          fill="none" stroke="#F5E6B8" strokeWidth="1" opacity="0.35" />

        {/* 星球表面紋路 */}
        <path d="M 400 330 Q 460 345, 520 325" stroke="#8C6F2A" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M 410 355 Q 460 370, 510 350" stroke="#8C6F2A" strokeWidth="1" fill="none" opacity="0.3" />

        {/* 小王子的玫瑰（放在玻璃罩下） */}
        <motion.g
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "backOut" }}
          style={{ transformOrigin: "460px 255px" }}
        >
          {/* 莖 */}
          <line x1="460" y1="265" x2="460" y2="235" stroke="#4A7C4A" strokeWidth="2" fill="none" {...handDrawnStyle} />
          {/* 葉 */}
          <path d="M 457 250 Q 448 245, 446 240 Q 455 244, 457 250 Z" fill="#4A7C4A" />
          {/* 花 */}
          <circle cx="460" cy="230" r="7" fill="#D4A89B" />
          <circle cx="457" cy="228" r="3" fill="#E8C4BA" />
          <circle cx="462" cy="228" r="3" fill="#E8C4BA" />
          <circle cx="460" cy="232" r="3" fill="#F5D9C6" />
          <circle cx="460" cy="229" r="1.5" fill="#B8953F" />
          {/* 玻璃罩 */}
          <path d="M 445 245 Q 445 215, 460 210 Q 475 215, 475 245 Z"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <ellipse cx="460" cy="245" rx="15" ry="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </motion.g>
      </motion.g>

      {/* ━━━━━━ 飛行軌跡 ━━━━━━ */}
      <motion.path
        d="M 200 260 Q 300 80, 400 260"
        stroke="#D4B96A"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 1 }}
      />

      {/* ━━━━━━ 小王子站在紫色星球上（Saint-Exupéry 原版比例） ━━━━━━ */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        {/* 金色蓬亂頭髮（多簇放射狀） */}
        <g fill="#D4B96A" stroke="#8C6F2A" strokeWidth="0.8" {...handDrawnStyle}>
          <path d="M 128 200 Q 130 188, 136 184 Q 140 180, 145 184 Q 148 188, 150 196 Q 152 185, 149 177 Q 147 172, 153 175 Q 156 179, 156 186 Q 158 180, 161 184 Q 162 192, 158 200 Q 160 208, 156 214 L 126 214 Q 122 208, 125 200 Z" />
          <path d="M 122 198 Q 120 190, 124 186 Q 128 184, 127 193 Z" opacity="0.85" />
        </g>
        {/* 頭 */}
        <ellipse cx="140" cy="212" rx="9" ry="10" fill="#F5D9C6" stroke="#C99885" strokeWidth="1" {...handDrawnStyle} />
        {/* 腮紅 */}
        <ellipse cx="134" cy="216" rx="2" ry="1.5" fill="#E8B8AA" opacity="0.6" />
        <ellipse cx="146" cy="216" rx="2" ry="1.5" fill="#E8B8AA" opacity="0.6" />
        {/* 眼 */}
        <circle cx="137" cy="211" r="0.9" fill="#3A1F16" />
        <circle cx="144" cy="211" r="0.9" fill="#3A1F16" />
        {/* 微笑 */}
        <path d="M 137 217 Q 140 219, 144 217" stroke="#3A1F16" strokeWidth="0.9" fill="none" {...handDrawnStyle} />

        {/* 長袍外套（墨綠，下擺外展） */}
        <path d="M 128 222
                 L 120 238
                 Q 116 252, 118 262
                 L 162 262
                 Q 164 252, 160 238
                 L 152 222
                 Q 148 226, 140 226 Q 132 226, 128 222 Z"
          fill="#7A8A6A"
          stroke="#4A5A3A" strokeWidth="1.1" {...handDrawnStyle} />
        {/* 紅色內裡（下擺微露） */}
        <path d="M 124 253 Q 128 258, 135 259 L 135 263 L 124 263 Z" fill="#B54F3A" opacity="0.9" />
        <path d="M 156 253 Q 152 258, 145 259 L 145 263 L 156 263 Z" fill="#B54F3A" opacity="0.9" />
        {/* 領口 V 字紅線 */}
        <path d="M 134 222 L 140 228 L 146 222" stroke="#B54F3A" strokeWidth="1" fill="none" {...handDrawnStyle} />

        {/* 紅色腰帶 */}
        <path d="M 121 244 Q 140 246, 159 244 L 159 248 Q 140 250, 121 248 Z" fill="#B54F3A" stroke="#8A3A28" strokeWidth="0.7" />
        <circle cx="140" cy="246" r="1.2" fill="#D4B96A" stroke="#8C6F2A" strokeWidth="0.4" />

        {/* 金色圍巾飄動 */}
        <motion.path
          d="M 150 224 Q 168 218, 180 225 Q 182 232, 178 234"
          stroke="#D4B96A" strokeWidth="3"
          fill="none" {...handDrawnStyle}
          animate={{ d: [
            "M 150 224 Q 168 218, 180 225 Q 182 232, 178 234",
            "M 150 224 Q 166 214, 176 222 Q 180 229, 174 232",
            "M 150 224 Q 168 218, 180 225 Q 182 232, 178 234",
          ] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />

        {/* 左手（舉起，送外泌體信） */}
        <path d="M 128 232 Q 120 226, 115 220" stroke="#7A8A6A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="114" cy="219" r="2.2" fill="#F5D9C6" stroke="#C99885" strokeWidth="0.6" />

        {/* 右手（下垂握劍） */}
        <path d="M 152 234 Q 158 240, 162 248" stroke="#7A8A6A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="163" cy="249" r="2.2" fill="#F5D9C6" stroke="#C99885" strokeWidth="0.6" />
        {/* 短劍（銀色，斜下指） */}
        <line x1="163" y1="250" x2="173" y2="266" stroke="#A8A8A8" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="161" y1="251" x2="166" y2="254" stroke="#8C6F2A" strokeWidth="1.8" strokeLinecap="round" />

        {/* 肩上裝飾星星 */}
        <path d="M 125 230 L 126 226 L 128 230 L 126 232 Z" fill="#D4B96A" />
        <path d="M 155 230 L 156 226 L 158 230 L 156 232 Z" fill="#D4B96A" opacity="0.8" />

        {/* 褲腿 */}
        <path d="M 128 262 L 126 272 L 135 272 L 137 263 Z" fill="#2F2420" stroke="#1A1410" strokeWidth="0.8" {...handDrawnStyle} />
        <path d="M 143 263 L 145 272 L 152 272 L 152 262 Z" fill="#2F2420" stroke="#1A1410" strokeWidth="0.8" {...handDrawnStyle} />
        {/* 黑靴 */}
        <ellipse cx="131" cy="274" rx="5" ry="2.5" fill="#1A1410" />
        <ellipse cx="148" cy="274" rx="5" ry="2.5" fill="#1A1410" />
      </motion.g>

      {/* ━━━━━━ 外泌體（金色氣泡沿拋物線飛行） ━━━━━━ */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.5,
            delay: 1.5 + i * 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            offsetPath: "path('M 200 260 Q 300 80, 400 260')",
            offsetRotate: "auto",
          }}
        >
          {/* 外泌體粒子 */}
          <circle cx="0" cy="0" r="10" fill="#D4B96A" opacity="0.2" />
          <circle cx="0" cy="0" r="6" fill="#D4B96A" opacity="0.6" />
          <circle cx="0" cy="0" r="4" fill="#F5E6B8" />
          <circle cx="-1.5" cy="-1.5" r="1.5" fill="rgba(255,255,255,0.9)" />
        </motion.g>
      ))}

      {/* 詩句 */}
      <motion.text
        x="300" y="100" textAnchor="middle"
        fill="#D4B96A"
        opacity="0.7"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="17"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 2, delay: 2.5 }}
      >
        ＂a letter between cells＂
      </motion.text>

      {/* 紙質紋理 */}
      <rect width="600" height="600" filter="url(#act2-paper)" opacity="0.4" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// ACT 3 — 小王子在重生的星球上綻放
// ═══════════════════════════════════════════════════
export function BloomIllustration() {
  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <StoryDefs id="act3" />
      <defs>
        <radialGradient id="dawn-glow" cx="50%" cy="70%">
          <stop offset="0%" stopColor="#F5E6B8" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#D4B96A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#B8953F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="planet-rebirth" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5D9C6" />
          <stop offset="50%" stopColor="#E8C4BA" />
          <stop offset="100%" stopColor="#C99885" />
        </linearGradient>
        <linearGradient id="sky-rebirth" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2C1D4A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7B2FBE" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* 天空漸層 */}
      <rect width="600" height="600" fill="url(#sky-rebirth)" />

      {/* 中央光芒（像日出） */}
      <motion.circle
        cx="300" cy="400" r="220"
        fill="url(#dawn-glow)"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "300px 400px" }}
      />

      {/* 光芒射線 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 300 + Math.cos(angle) * 180;
        const y1 = 400 + Math.sin(angle) * 180;
        const x2 = 300 + Math.cos(angle) * 260;
        const y2 = 400 + Math.sin(angle) * 260;
        return (
          <motion.line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#D4B96A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.25"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3, delay: i * 0.1, repeat: Infinity }}
          />
        );
      })}

      {/* 星星 */}
      {[
        { x: 80, y: 80, r: 2 }, { x: 520, y: 100, r: 2.5 },
        { x: 130, y: 200, r: 1.8 }, { x: 470, y: 180, r: 2 },
        { x: 50, y: 300, r: 1.5 }, { x: 550, y: 280, r: 1.8 },
        { x: 180, y: 50, r: 1.4 }, { x: 400, y: 40, r: 2.2 },
        { x: 250, y: 120, r: 1.2 }, { x: 350, y: 150, r: 1.5 },
      ].map((s, i) => (
        <motion.g key={i}
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <path
            d={`M ${s.x} ${s.y - s.r * 4} L ${s.x + s.r * 0.6} ${s.y - s.r * 0.6} L ${s.x + s.r * 4} ${s.y} L ${s.x + s.r * 0.6} ${s.y + s.r * 0.6} L ${s.x} ${s.y + s.r * 4} L ${s.x - s.r * 0.6} ${s.y + s.r * 0.6} L ${s.x - s.r * 4} ${s.y} L ${s.x - s.r * 0.6} ${s.y - s.r * 0.6} Z`}
            fill="#D4B96A"
          />
        </motion.g>
      ))}

      {/* 小雲朵 */}
      <motion.path
        d="M 140 340 Q 165 330, 190 335 Q 215 335, 225 345 Q 200 355, 165 355 Q 140 352, 140 340 Z"
        fill="#F5D9C6" opacity="0.6"
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 0.6 }}
        transition={{ duration: 2, delay: 0.8 }}
      />
      <motion.path
        d="M 400 370 Q 425 360, 455 365 Q 475 365, 470 378 Q 440 380, 415 378 Q 398 375, 400 370 Z"
        fill="#E8C4BA" opacity="0.5"
        initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 0.5 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* ━━━━━━ 星球（底部半圓） ━━━━━━ */}
      <motion.g
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* 星球主體 */}
        <ellipse cx="300" cy="540" rx="220" ry="130" fill="url(#planet-rebirth)" />
        {/* 星球邊緣高光 */}
        <path d="M 120 505 Q 200 490, 300 495" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* 地面紋路 */}
        <path d="M 90 510 Q 300 530, 510 510" stroke="#C99885" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M 110 540 Q 300 555, 490 540" stroke="#C99885" strokeWidth="0.8" fill="none" opacity="0.3" />
        {/* 小草叢 */}
        {[150, 200, 420, 460].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 500 L ${x - 2} 492 M ${x} 500 L ${x + 2} 491 M ${x} 500 L ${x} 490`}
              stroke="#4A7C4A" strokeWidth="1" fill="none" {...handDrawnStyle} />
          </g>
        ))}
      </motion.g>

      {/* ━━━━━━ 盛開的花朵（5 朵環繞） ━━━━━━ */}
      {[
        { x: 140, y: 490, delay: 1.2, color: "#7B2FBE", dark: "#5E1F96", size: 1 },
        { x: 215, y: 510, delay: 1.4, color: "#D4A89B", dark: "#B88A7A", size: 0.85 },
        { x: 380, y: 505, delay: 1.6, color: "#E8B8AA", dark: "#D49B8C", size: 0.95 },
        { x: 450, y: 490, delay: 1.8, color: "#B8953F", dark: "#8C6F2A", size: 1 },
        { x: 505, y: 510, delay: 2, color: "#9B5DD4", dark: "#7B2FBE", size: 0.8 },
      ].map((f, i) => (
        <motion.g key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: f.size, rotate: 0 }}
          transition={{ duration: 1, delay: f.delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${f.x}px ${f.y}px` }}
        >
          {/* 莖 */}
          <path d={`M ${f.x} ${f.y} Q ${f.x + 2} ${f.y - 25}, ${f.x} ${f.y - 50}`}
            stroke="#4A7C4A" strokeWidth="2" fill="none" {...handDrawnStyle} />
          {/* 葉 */}
          <path d={`M ${f.x} ${f.y - 25} Q ${f.x - 10} ${f.y - 30}, ${f.x - 12} ${f.y - 22} Q ${f.x - 6} ${f.y - 20}, ${f.x} ${f.y - 25} Z`}
            fill="#4A7C4A" stroke="#2F4F2F" strokeWidth="0.8" {...handDrawnStyle} />
          {/* 花瓣（6 片） */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={f.x}
              cy={f.y - 58}
              rx="5.5"
              ry="9"
              fill={f.color}
              opacity="0.85"
              stroke={f.dark} strokeWidth="0.8"
              transform={`rotate(${angle} ${f.x} ${f.y - 50})`}
            />
          ))}
          {/* 花心 */}
          <circle cx={f.x} cy={f.y - 50} r="4" fill="#B8953F" stroke="#8C6F2A" strokeWidth="0.8" />
          <circle cx={f.x - 0.5} cy={f.y - 51} r="1.5" fill="#F5E6B8" />
        </motion.g>
      ))}

      {/* ━━━━━━ 小王子站在星球中央 ━━━━━━ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        {/* 腳下陰影 */}
        <ellipse cx="300" cy="498" rx="24" ry="4" fill="#3A1F16" opacity="0.32" />

        {/* 金色放射蓬亂頭髮 */}
        <g fill="#D4B96A" stroke="#8C6F2A" strokeWidth="1" {...handDrawnStyle}>
          <path d="M 283 408 Q 287 390, 294 384 Q 300 378, 306 384 Q 312 388, 316 400 Q 320 385, 316 375 Q 322 378, 323 388 Q 325 380, 329 382 Q 330 392, 325 405 Q 328 414, 322 420 L 278 420 Q 273 412, 277 403 Z" />
          <path d="M 272 405 Q 268 395, 272 388 Q 278 384, 277 398 Z" opacity="0.85" />
        </g>
        {/* 頭髮高光 */}
        <path d="M 290 392 Q 300 386, 310 392" stroke="#F5E6B8" strokeWidth="1.1" fill="none" {...handDrawnStyle} opacity="0.75" />
        {/* 頭 */}
        <ellipse cx="300" cy="418" rx="16" ry="17" fill="#F5D9C6" stroke="#C99885" strokeWidth="1.2" {...handDrawnStyle} />
        {/* 眼 */}
        <circle cx="295" cy="416" r="1.4" fill="#3A1F16" />
        <circle cx="305" cy="416" r="1.4" fill="#3A1F16" />
        {/* 腮紅 */}
        <ellipse cx="290" cy="422" rx="3.2" ry="2.2" fill="#E8B8AA" opacity="0.6" />
        <ellipse cx="310" cy="422" rx="3.2" ry="2.2" fill="#E8B8AA" opacity="0.6" />
        {/* 微笑 */}
        <path d="M 294 427 Q 300 431, 306 427" stroke="#3A1F16" strokeWidth="1.4" fill="none" {...handDrawnStyle} />

        {/* 長袍外套（墨綠，大擺寬鬆） */}
        <path
          d="M 284 436
             L 274 460
             Q 268 480, 270 492
             L 330 492
             Q 332 480, 326 460
             L 316 436
             Q 308 442, 300 442 Q 292 442, 284 436 Z"
          fill="#7A8A6A"
          stroke="#4A5A3A" strokeWidth="1.4" {...handDrawnStyle}
        />
        {/* 紅色內裡（衣襟外展時露出） */}
        <path d="M 278 478 Q 284 488, 292 490 L 292 494 L 278 494 Z" fill="#B54F3A" opacity="0.9" />
        <path d="M 322 478 Q 316 488, 308 490 L 308 494 L 322 494 Z" fill="#B54F3A" opacity="0.9" />
        {/* 衣領 V */}
        <path d="M 290 436 L 300 446 L 310 436" stroke="#B54F3A" strokeWidth="1.3" fill="none" {...handDrawnStyle} />

        {/* 紅色腰帶（橫繞） */}
        <path d="M 276 467 Q 300 470, 324 467 L 324 472 Q 300 475, 276 472 Z" fill="#B54F3A" stroke="#8A3A28" strokeWidth="0.9" />
        <circle cx="300" cy="469.5" r="1.8" fill="#D4B96A" stroke="#8C6F2A" strokeWidth="0.5" />

        {/* 金色扣 */}
        <circle cx="300" cy="450" r="1.5" fill="#D4B96A" />
        <circle cx="300" cy="460" r="1.5" fill="#D4B96A" />

        {/* 褲腿 */}
        <path d="M 284 492 L 282 502 L 293 502 L 296 493 Z" fill="#2F2420" stroke="#1A1410" strokeWidth="0.9" {...handDrawnStyle} />
        <path d="M 304 493 L 307 502 L 318 502 L 316 492 Z" fill="#2F2420" stroke="#1A1410" strokeWidth="0.9" {...handDrawnStyle} />

        {/* 靴子 */}
        <ellipse cx="288" cy="503" rx="8" ry="3.5" fill="#1A1410" stroke="#0F0A08" strokeWidth="0.6" />
        <ellipse cx="312" cy="503" rx="8" ry="3.5" fill="#1A1410" stroke="#0F0A08" strokeWidth="0.6" />

        {/* 手張開擁抱陽光（動畫擺動） */}
        <motion.g
          animate={{ rotate: [-2, 3, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "300px 440px" }}
        >
          <path d="M 282 444 Q 262 434, 250 426" stroke="#7A8A6A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="248" cy="425" r="3.5" fill="#F5D9C6" stroke="#C99885" strokeWidth="0.8" />
          <path d="M 318 444 Q 338 434, 350 426" stroke="#7A8A6A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="352" cy="425" r="3.5" fill="#F5D9C6" stroke="#C99885" strokeWidth="0.8" />
        </motion.g>

        {/* 金色圍巾（飄動） */}
        <motion.path
          d="M 284 438 Q 264 448, 252 460"
          stroke="#D4B96A" strokeWidth="4"
          fill="none" {...handDrawnStyle}
          animate={{ d: [
            "M 284 438 Q 264 448, 252 460",
            "M 284 438 Q 262 444, 248 454",
            "M 284 438 Q 264 448, 252 460",
          ] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />

        {/* 肩部星星裝飾 */}
        <path d="M 278 445 L 279 441 L 281 445 L 279 447 Z" fill="#D4B96A" />
        <path d="M 322 445 L 323 441 L 325 445 L 323 447 Z" fill="#D4B96A" opacity="0.9" />
      </motion.g>

      {/* ━━━━━━ 上升的光點（新生能量） ━━━━━━ */}
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={260 + i * 14}
          r="2.5"
          fill="#D4B96A"
          filter="drop-shadow(0 0 6px #F5E6B8)"
          initial={{ cy: 480, opacity: 0 }}
          animate={{ cy: [480, 150], opacity: [0, 1, 0] }}
          transition={{
            duration: 5,
            delay: 2 + i * 0.4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 詩句 */}
      <motion.text
        x="300" y="130" textAnchor="middle"
        fill="#8C6F2A"
        opacity="0.85"
        fontFamily="'Cormorant Garamond', serif"
        fontSize="18"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 2, delay: 2 }}
      >
        ＂a choice, to bloom again＂
      </motion.text>

      {/* 紙質紋理 */}
      <rect width="600" height="600" filter="url(#act3-paper)" opacity="0.4" />
    </svg>
  );
}
