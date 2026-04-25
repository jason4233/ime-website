// /luxe — bypass the root marketing chrome (Header/Footer/FloatingCTA/CustomCursor)
// They live as direct children of <body>, sibling to <main>.

export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        /* Hide everything that root layout renders as siblings of <main> */
        body > header,
        body > footer,
        body > a,
        body > .fixed:not(#luxe-nav),
        body > div.fixed,
        body > section.fixed {
          display: none !important;
        }
        /* Cancel root smooth-scroll hijack so Lenis (luxe) takes over cleanly */
        html { scroll-behavior: auto !important; }
        /* Make sure body bg is luxe dark even before client mounts */
        body { background-color: #0A0A0D !important; color: #F5F0E8 !important; }
        /* Pad <main> back to 0 — root may have padding for fixed header */
        body > main { padding: 0 !important; margin: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
