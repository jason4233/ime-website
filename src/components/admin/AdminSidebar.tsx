"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuItems = [
  { label: "總覽", href: "/admin", icon: "📊" },
  { label: "Hero 區塊", href: "/admin/hero", icon: "🎯" },
  { label: "品牌故事", href: "/admin/brand-story", icon: "📖" },
  { label: "創辦人", href: "/admin/founders", icon: "👤" },
  { label: "產品", href: "/admin/products", icon: "🧴" },
  { label: "課程", href: "/admin/courses", icon: "🎓" },
  { label: "認證文件", href: "/admin/certificates", icon: "📜" },
  { label: "媒體報導", href: "/admin/news", icon: "📰" },
  { label: "客戶見證", href: "/admin/testimonials", icon: "💬" },
  { label: "前後對比", href: "/admin/before-after", icon: "🔄" },
  { label: "工廠亮點", href: "/admin/factory", icon: "🏭" },
  { label: "預約管理", href: "/admin/appointments", icon: "📅" },
  { label: "加盟申請", href: "/admin/applications", icon: "🤝" },
  { label: "網站設定", href: "/admin/settings", icon: "⚙️" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [revalidateMsg, setRevalidateMsg] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-night border-r border-ivory/5 z-40
                   flex flex-col transition-all duration-300 ease-spring
                   ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-ivory/5 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          <span className="font-elegant text-xl font-semibold text-ivory shrink-0">
            I <span className="text-gold">M</span>
          </span>
          {!collapsed && (
            <span className="font-elegant text-xl font-semibold text-gold">
              E
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                         transition-all duration-200
                         ${isActive
                           ? "bg-brand/10 text-brand-light"
                           : "text-ivory/50 hover:text-ivory/80 hover:bg-ivory/5"
                         }
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="truncate font-sans-tc">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-ivory/5 p-2 shrink-0 space-y-1">
        <button
          onClick={async () => {
            setRevalidating(true);
            try {
              const res = await fetch("/api/admin/revalidate", { method: "POST" });
              if (res.ok) {
                setRevalidateMsg("✓ 前台已更新");
              } else {
                setRevalidateMsg("✗ 更新失敗");
              }
            } catch {
              setRevalidateMsg("✗ 網路錯誤");
            }
            setRevalidating(false);
            setTimeout(() => setRevalidateMsg(null), 2500);
          }}
          disabled={revalidating}
          title={collapsed ? "立即更新前台" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                     text-gold/70 hover:text-gold hover:bg-gold/5
                     transition-all duration-200 disabled:opacity-40
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          <span className="text-base shrink-0">{revalidating ? "⏳" : "🔄"}</span>
          {!collapsed && (
            <span className="font-body truncate">
              {revalidateMsg ?? (revalidating ? "更新中..." : "立即更新前台")}
            </span>
          )}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                     text-ivory/30 hover:text-ivory/60 hover:bg-ivory/5
                     transition-all duration-200
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
        >
          <span className="text-base shrink-0">{collapsed ? "→" : "←"}</span>
          {!collapsed && <span className="font-body">收合</span>}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                     text-ivory/30 hover:text-rose-nude/80 hover:bg-rose-nude/5
                     transition-all duration-200
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-nude/40"
        >
          <span className="text-base shrink-0">🚪</span>
          {!collapsed && <span className="font-body">登出</span>}
        </button>
      </div>
    </aside>
  );
}
