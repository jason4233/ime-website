import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const quickLinks = [
  { label: "課程介紹", href: "#courses" },
  { label: "預約體驗", href: "#appointment" },
  { label: "品牌故事", href: "/about" },
  { label: "經銷加盟", href: "#recruit" },
];

const socials = [
  { label: "LINE", icon: "L", href: "#" },
  { label: "Instagram", icon: "IG", href: "#" },
  { label: "Facebook", icon: "f", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-night text-ivory/70 relative overflow-hidden noise-overlay">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* 欄 1：品牌 */}
          <div>
            <Logo variant="light" className="mb-6" />
            <p className="font-handwriting text-xl text-ivory/30 leading-relaxed mt-4">
              妳配得上，重新出生的肌膚。
            </p>
            <p className="text-caption text-ivory/15 mt-4 font-body">
              源自台中榮總專利技術<br />
              星誠細胞生醫 × 博訊生技
            </p>
          </div>

          {/* 欄 2：快速連結 */}
          <div>
            <h4 className="text-overline text-brand-light uppercase mb-6 font-body tracking-[0.2em]">
              快速連結
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body text-ivory/40 hover:text-ivory transition-colors duration-300
                               focus-visible:outline-none focus-visible:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 欄 3：社群 + 聯絡 */}
          <div>
            <h4 className="text-overline text-brand-light uppercase mb-6 font-body tracking-[0.2em]">
              聯絡我們
            </h4>
            <div className="space-y-3 mb-6">
              <p className="text-caption text-ivory/40 font-body">
                📞 0976-282-794
              </p>
              <p className="text-caption text-ivory/40 font-body">
                ✉ contact@ime-beauty.com
              </p>
            </div>

            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-ivory/10
                             flex items-center justify-center
                             text-ivory/30 hover:text-brand hover:border-brand/30
                             transition-all duration-300
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <span className="text-xs font-bold font-body">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 分隔線 + Copyright */}
        <div className="border-t border-ivory/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[0.65rem] text-ivory/15 font-body">
            © 2026 i me｜研發：星誠細胞生醫｜製造：博訊生物科技
          </p>
          <p className="text-[0.65rem] text-ivory/15 font-body">
            Exosome Beauty for you
          </p>
        </div>
      </div>
    </footer>
  );
}
