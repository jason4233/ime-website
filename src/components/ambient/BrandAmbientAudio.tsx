"use client";

/**
 * BrandAmbientAudio — I ME 品牌專屬 Web Audio 合成
 *
 * 不用任何 mp3 檔案，完全由瀏覽器 Web Audio API 即時合成：
 *   • 3 個 sine oscillator → C major 開放和弦 drone (C2 + G2 + E3)
 *   • 1 個 sub bass (C1) 很低量，給溫度
 *   • Slow LFO → gain breathing (呼吸感，12 秒週期)
 *   • 金色 chime：每 8-14 秒隨機選一個五聲音階 (C5 D5 E5 G5 A5)
 *     搭配 feedback delay (模擬大廳殘響)
 *   • 整體 lowpass 過 cutoff ~1400 Hz → 溫暖、無高頻刺耳
 *
 * UI: 右下浮動 🎵 toggle。
 * 第一次點擊 → resume AudioContext + 啟動合成
 * 再點 → suspend 靜音
 * localStorage: ime.music.on = "1" | "0"
 */

import { useCallback, useEffect, useRef, useState } from "react";

const LS_KEY = "ime.music.on";

export function BrandAmbientAudio() {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    masterGain: GainNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    chimeTimerId: number | null;
  } | null>(null);

  useEffect(() => setMounted(true), []);

  // ── 建立音訊圖 ──────────────────────────────
  const ensureContext = useCallback(async () => {
    if (ctxRef.current) return ctxRef.current;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();

    // Master gain — 整體音量 18% (溫和 ambient)
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Warm lowpass filter
    const warmth = ctx.createBiquadFilter();
    warmth.type = "lowpass";
    warmth.frequency.value = 1400;
    warmth.Q.value = 0.6;
    warmth.connect(master);

    // Feedback delay → 大廳殘響
    const delay = ctx.createDelay(4);
    delay.delayTime.value = 0.4;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.38;
    const wetMix = ctx.createGain();
    wetMix.gain.value = 0.35;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetMix);
    wetMix.connect(warmth);

    // ── Drone 和弦：C2 (65.41) + G2 (98) + E3 (164.81) + sub C1 (32.7) ──
    const notes = [
      { freq: 32.7, gain: 0.12, type: "sine" as const }, // C1 sub
      { freq: 65.41, gain: 0.22, type: "sine" as const }, // C2
      { freq: 98, gain: 0.18, type: "sine" as const }, // G2
      { freq: 164.81, gain: 0.14, type: "triangle" as const }, // E3 triangle 多點泛音
    ];

    notes.forEach(({ freq, gain, type }) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      // 微微 detune 避免呆板
      osc.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g);
      g.connect(warmth);
      osc.start();
    });

    // ── Slow LFO 控 master 呼吸 (0 ↔ 0.18)，12 秒週期 ──
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 12; // 12s period
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04; // breathing amplitude
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    nodesRef.current = {
      masterGain: master,
      lfo,
      lfoGain,
      chimeTimerId: null,
    };

    ctxRef.current = ctx;
    return ctx;
  }, []);

  // ── 金色 chime：每 8-14 秒隨機一顆 ──────────
  const scheduleChime = useCallback(() => {
    if (!ctxRef.current || !nodesRef.current) return;
    const ctx = ctxRef.current;
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880]; // C5 D5 E5 G5 A5
    const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = note;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.28, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    // 高通讓 chime 只剩金屬感
    const hp = ctx.createBiquadFilter();
    hp.type = "bandpass";
    hp.frequency.value = note * 1.2;
    hp.Q.value = 3;

    osc.connect(env);
    env.connect(hp);
    hp.connect(nodesRef.current.masterGain); // 接到 master（已經接 destination）

    osc.start(now);
    osc.stop(now + 4.6);

    // schedule 下一顆
    const nextDelay = 8000 + Math.random() * 6000; // 8-14s
    nodesRef.current.chimeTimerId = window.setTimeout(scheduleChime, nextDelay);
  }, []);

  // ── Play / Stop ────────────────────────────
  const turnOn = useCallback(async () => {
    const ctx = await ensureContext();
    if (ctx.state === "suspended") await ctx.resume();
    if (nodesRef.current) {
      // fade in
      const now = ctx.currentTime;
      nodesRef.current.masterGain.gain.cancelScheduledValues(now);
      nodesRef.current.masterGain.gain.setValueAtTime(
        nodesRef.current.masterGain.gain.value,
        now,
      );
      nodesRef.current.masterGain.gain.linearRampToValueAtTime(0.18, now + 2.5);
    }
    // 第一顆 chime 延遲 3-8 秒
    if (nodesRef.current?.chimeTimerId == null) {
      nodesRef.current!.chimeTimerId = window.setTimeout(
        scheduleChime,
        3000 + Math.random() * 5000,
      );
    }
    setOn(true);
    localStorage.setItem(LS_KEY, "1");
  }, [ensureContext, scheduleChime]);

  const turnOff = useCallback(() => {
    if (!ctxRef.current || !nodesRef.current) {
      setOn(false);
      localStorage.setItem(LS_KEY, "0");
      return;
    }
    const ctx = ctxRef.current;
    const now = ctx.currentTime;
    // fade out
    nodesRef.current.masterGain.gain.cancelScheduledValues(now);
    nodesRef.current.masterGain.gain.setValueAtTime(
      nodesRef.current.masterGain.gain.value,
      now,
    );
    nodesRef.current.masterGain.gain.linearRampToValueAtTime(0, now + 1.2);

    if (nodesRef.current.chimeTimerId) {
      clearTimeout(nodesRef.current.chimeTimerId);
      nodesRef.current.chimeTimerId = null;
    }
    setOn(false);
    localStorage.setItem(LS_KEY, "0");
  }, []);

  const toggle = useCallback(() => {
    if (on) turnOff();
    else turnOn();
  }, [on, turnOn, turnOff]);

  // ── 不 autoplay，但若上次使用者開過 → 顯示 icon 已點亮狀態
  // 真正啟動仍需 click（瀏覽器限制）
  useEffect(() => {
    if (!mounted) return;
    // 不自動 resume AudioContext，只讀取 UI 狀態
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "1") {
      // 顯示「曾經開啟」的視覺，但實際等 user click 才播
      // （瀏覽器 autoplay policy 禁止 no-gesture 播放）
    }
  }, [mounted]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (nodesRef.current?.chimeTimerId) {
        clearTimeout(nodesRef.current.chimeTimerId);
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? "關閉背景音樂" : "開啟背景音樂"}
      className="fixed bottom-5 right-5 z-[60] group"
    >
      <div
        className={`relative w-11 h-11 rounded-full backdrop-blur-md border transition-all duration-500 flex items-center justify-center ${
          on
            ? "bg-gold/20 border-gold/50 shadow-[0_0_24px_rgba(212,179,106,0.5)]"
            : "bg-night/30 border-ivory/20 hover:bg-night/40"
        }`}
      >
        {/* 音波環 — on 時脈動 */}
        {on && (
          <>
            <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping-slow" />
            <span
              className="absolute inset-0 rounded-full border border-gold/30 animate-ping-slow"
              style={{ animationDelay: "1.5s" }}
            />
          </>
        )}
        {/* Icon SVG */}
        <svg
          viewBox="0 0 24 24"
          className={`w-5 h-5 transition-colors ${on ? "text-gold" : "text-ivory/70"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {on ? (
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </>
          ) : (
            <>
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
              <line x1="2" y1="2" x2="22" y2="22" strokeWidth="1.8" />
            </>
          )}
        </svg>
      </div>
      <span className="sr-only">{on ? "背景音樂開啟中" : "點擊開啟背景音樂"}</span>
    </button>
  );
}
