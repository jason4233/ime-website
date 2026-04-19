"use client";

// 改用 mounted-guard 取代 dynamic(ssr:false)
// 原因：Next.js 14.2 + React 18 production 中，dynamic(ssr:false) 的 Suspense 轉場
// 在 body-root 有兄弟 sibling（Header/Footer）時會觸發 insertBefore HostRoot crash。
// mounted-guard 方式在 SSR 與 client 首次渲染都輸出相同的 placeholder（無 Suspense 介入），
// 接著 useEffect 觸發 re-render 換上真正的 HomeClient，走正常 React client-side update。
import { useState, useEffect } from "react";
import HomeClient from "@/components/HomeClient";

export default function HomeClientLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="text-ivory/30 font-display text-sm tracking-[0.3em]">LOADING</div>
      </div>
    );
  }

  return <HomeClient />;
}
