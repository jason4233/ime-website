import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// === Seamless loop helpers ===
// sin wave 週期 = durationInFrames，保證 frame 0 與 frame duration 視覺完全相同 → 無縫 loop
const sinLoop = (frame: number, duration: number, phase = 0) =>
  Math.sin((frame / duration) * Math.PI * 2 + phase);
const cosLoop = (frame: number, duration: number, phase = 0) =>
  Math.cos((frame / duration) * Math.PI * 2 + phase);

// 金絲筆觸生命週期：draw 0~60、hold 60~80、fade 80~100，超過 100 消失
const goldLineState = (frame: number, startFrame: number, duration: number) => {
  const local = (frame - startFrame + duration) % duration;
  if (local >= 100) return { drawProgress: 0, opacity: 0 };
  const drawProgress = Math.min(1, local / 60);
  let opacity = 1;
  if (local < 10) opacity = local / 10; // fade in
  else if (local > 80) opacity = Math.max(0, 1 - (local - 80) / 20); // fade out
  return { drawProgress, opacity };
};

// 偽隨機（seeded）— 確保每次 render 塵粒位置一致
const pseudo = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const HeroAmbient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // === Layer 1: 紫色星雲（雙點 breathing） ===
  const nebula1Opacity = 0.18 + sinLoop(frame, durationInFrames, 0) * 0.06;
  const nebula2Opacity = 0.12 + sinLoop(frame, durationInFrames, Math.PI / 2) * 0.05;
  const nebula1X = 25 + sinLoop(frame, durationInFrames, 0) * 3;
  const nebula1Y = 72 + cosLoop(frame, durationInFrames, 0) * 2;
  const nebula2X = 78 + sinLoop(frame, durationInFrames, Math.PI) * 3;
  const nebula2Y = 28 + cosLoop(frame, durationInFrames, Math.PI) * 2;

  // === Layer 2: 遠處金霧 ===
  const goldHazeOpacity = 0.1 + sinLoop(frame, durationInFrames) * 0.03;
  const goldHazeX = 50 + cosLoop(frame, durationInFrames) * 8;
  const goldHazeY = 50 + sinLoop(frame, durationInFrames) * 5;

  // === Layer 3: 3 條金絲筆觸，錯開 60 frames 出現 ===
  const lineA = goldLineState(frame, 0, durationInFrames);
  const lineB = goldLineState(frame, 60, durationInFrames);
  const lineC = goldLineState(frame, 120, durationInFrames);

  // === Layer 4: 金塵（18 顆） ===
  const dustCount = 18;
  const dust = Array.from({ length: dustCount }, (_, i) => {
    const rx = pseudo(i * 1.7);
    const ry = pseudo(i * 2.9);
    const rs = pseudo(i * 3.3);
    const rp = pseudo(i * 4.1);
    const baseX = rx * width;
    const baseY = ry * height;
    const driftX = sinLoop(frame, durationInFrames, rp * Math.PI * 2) * 25;
    const driftY = cosLoop(frame, durationInFrames, rp * Math.PI * 2) * 30;
    const breathing =
      0.35 + sinLoop(frame, durationInFrames, rp * Math.PI * 4) * 0.25;
    const size = 2 + rs * 2.5; // 2~4.5px
    return {
      x: baseX + driftX,
      y: baseY + driftY,
      opacity: breathing,
      size,
    };
  });

  return (
    <AbsoluteFill>
      {/* === 底：暗紫黑漸層（跟 Hero CSS 完全對齊） === */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, #0A0510 0%, #150820 50%, #0A0510 100%)",
        }}
      />

      {/* === Layer 1: 紫色星雲（filter blur + screen 混色） === */}
      <AbsoluteFill style={{ filter: "blur(80px)", mixBlendMode: "screen" }}>
        <div
          style={{
            position: "absolute",
            left: `${nebula1X}%`,
            top: `${nebula1Y}%`,
            width: 800,
            height: 800,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(155, 93, 212, ${nebula1Opacity}) 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${nebula2X}%`,
            top: `${nebula2Y}%`,
            width: 1000,
            height: 1000,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(155, 93, 212, ${nebula2Opacity}) 0%, transparent 70%)`,
          }}
        />
      </AbsoluteFill>

      {/* === Layer 2: 遠處金霧 === */}
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        <div
          style={{
            position: "absolute",
            left: `${goldHazeX}%`,
            top: `${goldHazeY}%`,
            width: 1400,
            height: 1400,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(212, 179, 106, ${goldHazeOpacity}) 0%, transparent 60%)`,
            filter: "blur(60px)",
          }}
        />
      </AbsoluteFill>

      {/* === Layer 3: 3 條金絲筆觸（SVG path + strokeDashoffset） === */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
        }}
      >
        <defs>
          <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4B36A" stopOpacity="0" />
            <stop offset="20%" stopColor="#D4B36A" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#E6C77A" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#D4B36A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4B36A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Line A — 中央水平，略上彎 */}
        <path
          d={`M -100 540 Q 480 400 960 560 T ${width + 100} 500`}
          stroke="url(#goldStroke)"
          strokeWidth={1.6}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - lineA.drawProgress}
          style={{
            opacity: lineA.opacity,
            filter: "drop-shadow(0 0 4px rgba(212, 179, 106, 0.8))",
          }}
        />

        {/* Line B — 斜下穿越 */}
        <path
          d={`M -100 200 Q 600 600 1200 300 T ${width + 100} 700`}
          stroke="url(#goldStroke)"
          strokeWidth={1}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - lineB.drawProgress}
          style={{
            opacity: lineB.opacity * 0.7,
            filter: "drop-shadow(0 0 3px rgba(212, 179, 106, 0.7))",
          }}
        />

        {/* Line C — 下半 */}
        <path
          d={`M -100 800 Q 480 920 960 750 T ${width + 100} 820`}
          stroke="url(#goldStroke)"
          strokeWidth={1.3}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - lineC.drawProgress}
          style={{
            opacity: lineC.opacity * 0.85,
            filter: "drop-shadow(0 0 3px rgba(212, 179, 106, 0.75))",
          }}
        />
      </svg>

      {/* === Layer 4: 金塵粒（screen 混色，各自 breathing） === */}
      <AbsoluteFill style={{ mixBlendMode: "screen" }}>
        {dust.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: "#D4B36A",
              opacity: d.opacity,
              boxShadow: `0 0 ${d.size * 4}px #D4B36A`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* === Layer 5: 邊緣暗角（vignette） === */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 35%, rgba(10, 5, 20, 0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
