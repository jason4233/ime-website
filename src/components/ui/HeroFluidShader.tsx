"use client";

/**
 * HeroFluidShader — WebGL fragment shader，紫金水彩流體
 *
 * 技術：
 *   • 兩個 triangle fullscreen quad
 *   • Fragment shader 用 domain warping + simplex-like noise
 *   • Uniforms: iTime（秒）、iMouse（滑鼠 0-1）、iScroll（整頁捲動 0-1）
 *   • Color palette: deep aubergine → amber gold → warm cream，按 noise 值 map
 *   • 滑鼠移動 → 流體中心被吸引 → domain warp 偏移
 *   • Scroll → 色溫偏移（上方冷紫、下方暖金）
 *
 * 效能：canvas 尺寸為 device size，但 shader 就幾行，GPU 跑得很輕鬆。
 */

import { useEffect, useRef, useState } from "react";

const VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;   // 0-1
uniform float iScroll; // 0-1

// ── Simplex-like hash noise ─────────
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash2(i + 0.0)),
    dot(b, hash2(i + o)),
    dot(c, hash2(i + 1.0))
  );
  return dot(n, vec3(70.0));
}

// Fractal brownian motion
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Domain warping — 柔滑流體感
float pattern(vec2 p, vec2 mouse, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.03),
                fbm(p + vec2(5.2, 1.3) - t * 0.02));
  // 滑鼠吸引
  vec2 toMouse = mouse - p * 0.5 - 0.5;
  q += toMouse * 0.3;

  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.05),
                fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.04));
  return fbm(p + 4.0 * r);
}

// Color palette — I ME 紫金
vec3 palette(float t, float scroll) {
  // 三個 keypoint 顏色（linear RGB）
  vec3 aubergine = vec3(0.09, 0.04, 0.18);    // #17 0A 2E 深紫
  vec3 purple    = vec3(0.48, 0.22, 0.68);    // #7B 38 AE 品牌紫
  vec3 gold      = vec3(0.83, 0.70, 0.41);    // #D4 B3 6A 金
  vec3 cream     = vec3(0.96, 0.90, 0.78);    // #F5 E6 C6 米

  // t 0→1 混色
  vec3 c;
  if (t < 0.33) {
    c = mix(aubergine, purple, t / 0.33);
  } else if (t < 0.66) {
    c = mix(purple, gold, (t - 0.33) / 0.33);
  } else {
    c = mix(gold, cream, (t - 0.66) / 0.34);
  }
  // scroll 偏移色溫
  c = mix(c, cream, scroll * 0.2);
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

  float n = pattern(p * 0.7, iMouse, iTime);
  float t = smoothstep(-0.4, 0.4, n);

  vec3 col = palette(t, iScroll);

  // 邊緣暗角
  float vig = 1.0 - smoothstep(0.6, 1.3, length(p));
  col *= mix(0.7, 1.0, vig);

  // 金色光點閃爍（沒有 mouse 時 p*3 隨機分佈）
  float sparkle = smoothstep(0.92, 1.0, fbm(p * 3.0 + iTime * 0.15));
  col += vec3(0.9, 0.72, 0.4) * sparkle * 0.35;

  outColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function HeroFluidShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    // Compile
    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }
    const prog = gl.createProgram();
    if (!prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      setFailed(true);
      return;
    }

    // Fullscreen quad (two triangles covering clip space)
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes = gl.getUniformLocation(prog, "iResolution");
    const uTime = gl.getUniformLocation(prog, "iTime");
    const uMouse = gl.getUniformLocation(prog, "iMouse");
    const uScroll = gl.getUniformLocation(prog, "iScroll");

    gl.useProgram(prog);

    // State
    let mouseX = 0.5;
    let mouseY = 0.5;
    let scroll = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width;
      mouseY = 1 - (e.clientY - r.top) / r.height;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  if (failed) {
    // WebGL fallback — 仍給個 gradient 不要全黑
    return (
      <div
        className={className}
        style={{
          background:
            "linear-gradient(135deg, #0A0510 0%, #3B1A5C 40%, #7B2FBE 70%, #D4B36A 100%)",
        }}
      />
    );
  }

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
