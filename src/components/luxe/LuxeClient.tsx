"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { LuxeNav } from "./LuxeNav";

// All R3F sections lazy-loaded with SSR off (per design-system rule:
// no SSR for R3F to avoid hydration MotionValue null errors)
const LuxeHero = dynamic(() => import("./LuxeHero").then((m) => m.LuxeHero), {
  ssr: false,
  loading: () => <HeroPoster />,
});
const LuxeMolecule = dynamic(
  () => import("./LuxeMolecule").then((m) => m.LuxeMolecule),
  { ssr: false, loading: () => <SectionPoster label="The Molecule" /> }
);
const LuxeSkinJourney = dynamic(
  () => import("./LuxeSkinJourney").then((m) => m.LuxeSkinJourney),
  { ssr: false, loading: () => <SectionPoster label="Skin Journey" /> }
);
const LuxeVial = dynamic(
  () => import("./LuxeVial").then((m) => m.LuxeVial),
  { ssr: false, loading: () => <SectionPoster label="The Vial" /> }
);
const LuxeProof = dynamic(
  () => import("./LuxeProof").then((m) => m.LuxeProof),
  { ssr: true }
);
const LuxeAppointment = dynamic(
  () => import("./LuxeAppointment").then((m) => m.LuxeAppointment),
  { ssr: true }
);

/* eslint-disable @typescript-eslint/no-explicit-any */
interface LuxeClientProps {
  cms?: {
    hero?: any;
    products?: any[];
    founders?: any[];
    testimonials?: any[];
  };
}

export default function LuxeClient({ cms }: LuxeClientProps) {
  // Smooth scroll via Lenis (already in deps) — fluid 60fps scroll
  useEffect(() => {
    let lenis: any;
    let rafId = 0;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    })();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-luxe-bgBase text-luxe-ivory antialiased">
      <LuxeNav />
      <LuxeHero data={cms?.hero} />
      <LuxeBrandPromise />
      <LuxeMolecule />
      <LuxeSkinJourney />
      <LuxeVial product={cms?.products?.[0]} />
      <LuxeProof />
      <LuxeAppointment />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
//   Posters: shown while R3F lazy loads (skill rule:
//   reserve space, no CLS, FOIT-free)
// ─────────────────────────────────────────────────────────────

function HeroPoster() {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-luxe-bgBase">
      {/* Gradient placeholder while 3D mounts */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202,138,4,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(122,77,142,0.12),transparent_50%)]" />
      </div>
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="font-display italic text-2xl text-luxe-ivory/40 tracking-wider">
          loading
        </div>
      </div>
    </section>
  );
}

function SectionPoster({ label }: { label: string }) {
  return (
    <section className="relative h-[80dvh] w-full bg-luxe-bgElevated">
      <div className="flex h-full items-center justify-center">
        <p className="font-display italic text-luxe-ivory/30 text-sm tracking-[0.4em] uppercase">
          {label} — loading
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//   Static (non-3D) sections — kept inline for now
// ─────────────────────────────────────────────────────────────

function LuxeBrandPromise() {
  return (
    <section className="relative bg-luxe-bgBase py-section overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 lg:px-12 text-center">
        <p className="font-italic text-luxe-gold/70 text-sm tracking-[0.4em] uppercase mb-6">
          Cellular Atelier
        </p>
        <h2 className="font-serif text-h1 leading-[1.1] tracking-tight text-luxe-ivory mb-8">
          細胞層級的訊息，
          <br />
          <span className="font-display italic text-luxe-gold">
            包覆在最溫柔的工藝裡。
          </span>
        </h2>
        <div className="mx-auto h-px w-16 bg-luxe-gold/50 my-10" />
        <p className="font-sans-tc text-body-lg text-luxe-ivoryDim max-w-2xl mx-auto leading-loose font-light">
          外泌體不只是分子，是一封封細胞之間的信。
          <br />
          我們把醫學中心的工藝，封進每一支安瓶。
        </p>
      </div>
    </section>
  );
}
