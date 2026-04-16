"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="font-elegant text-2xl text-ivory/30 animate-pulse">
          I <span className="text-gold/50">ME</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <AdminSidebar />

      {/* 主內容區域 — sidebar 寬度 offset */}
      <div className="ml-60 transition-all duration-300">
        {/* Top Bar */}
        <header className="h-16 border-b border-ivory/5 bg-[#0F0F0F]/80 backdrop-blur-sm
                          flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="搜尋..."
              className="w-64 px-4 py-2 bg-ivory/5 border border-ivory/8 rounded-md
                         text-sm text-ivory placeholder:text-ivory/20 font-body
                         focus:outline-none focus:border-gold/30 focus:ring-1 focus:ring-gold/20
                         transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-caption text-ivory/40 font-body">
              {session.user?.name || session.user?.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-xs font-semibold">
                {(session.user?.name || "A")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
