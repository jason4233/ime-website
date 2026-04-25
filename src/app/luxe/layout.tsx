import { LuxeBodyClass } from "@/components/luxe/LuxeBodyClass";

// /luxe — bypass the root marketing chrome (Header / Footer / FloatingCTA / etc.)
// Strategy: client-side adds `luxe-mode` to <html>, scoped CSS hides everything not in luxe.
export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxeBodyClass />
      <style>{`
        html.luxe-mode body > header,
        html.luxe-mode body > footer,
        html.luxe-mode body > a,
        html.luxe-mode body > div.fixed,
        html.luxe-mode body > section.fixed,
        html.luxe-mode body > .fixed:not([data-luxe]) {
          display: none !important;
          visibility: hidden !important;
        }
        html.luxe-mode { background-color: #0A0A0D !important; }
        html.luxe-mode body { background-color: #0A0A0D !important; color: #F5F0E8 !important; }
        html.luxe-mode body > main { padding: 0 !important; margin: 0 !important; }
        html.luxe-mode { scroll-behavior: auto !important; }
      `}</style>
      {children}
    </>
  );
}
