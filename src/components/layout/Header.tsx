// Pure server/static Header — no state, no effect, no motion
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "品牌故事", href: "/about" },
  { label: "核心技術", href: "/products" },
  { label: "培訓課程", href: "/training" },
  { label: "聯繫我們", href: "/contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Logo variant="light" showSlogan />

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-caption font-sans-tc font-medium text-ivory/70 hover:text-ivory transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-gold text-caption">
            預約體驗
          </Link>
        </nav>
      </div>
    </header>
  );
}
