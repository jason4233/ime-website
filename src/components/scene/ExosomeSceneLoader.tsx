"use client";

/**
 * dynamic(ssr: false) loader for ExosomeScene
 * 必要:R3F + WebGL 只能在瀏覽器跑,SSR 階段完全不渲染避免 hydration mismatch
 */
import dynamic from "next/dynamic";

const ExosomeScene = dynamic(
  () => import("./ExosomeScene").then((m) => m.ExosomeScene),
  { ssr: false }
);

export function ExosomeSceneLoader() {
  return <ExosomeScene />;
}
