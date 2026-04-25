// /luxe — bypass the root marketing chrome (Header/Footer/FloatingCTA/CustomCursor)
// by hiding them via a body class. This keeps root layout untouched
// while letting the luxe route own its full canvas.

export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide root-level chrome on /luxe — they'd clash with LuxeNav and the
          Lenis smooth-scroll instance owned by LuxeClient. */}
      <style>{`
        body > main > header,
        body > main > footer,
        body > a[href="#contact"],
        body > div.fixed.bottom-6,
        body > .fixed.top-0.left-0.right-0:not(#luxe-nav),
        body > main > * > header,
        body > main > * > footer,
        header.fixed.top-0,
        footer.bg-night,
        a.fixed.bottom-6.right-6 {
          display: none !important;
        }
        html { scroll-behavior: auto !important; }
      `}</style>
      {children}
    </>
  );
}
