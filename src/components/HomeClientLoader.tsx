"use client";

// Client Component wrapper for dynamic(ssr:false).
// Next.js 14: dynamic({ ssr: false }) only works from Client Components — Server Components silently ignore it.
import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("@/components/HomeClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-night">
      <div className="text-ivory/30 font-display text-sm tracking-[0.3em]">LOADING</div>
    </div>
  ),
});

export default function HomeClientLoader() {
  return <HomeClient />;
}
