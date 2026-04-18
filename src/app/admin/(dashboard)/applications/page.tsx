"use client";

import { useState, useEffect, useCallback } from "react";

/* ──────────────────────────── Types ──────────────────────────── */

type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

interface Application {
  id: string;
  name: string;
  phone: string;
  background: string;
  motivation: string;
  status: ApplicationStatus;
  createdAt: string;
}

const STATUS_TABS: { label: string; value: ApplicationStatus | "ALL" }[] = [
  { label: "全部", value: "ALL" },
  { label: "待處理", value: "PENDING" },
  { label: "審核中", value: "REVIEWING" },
  { label: "已核准", value: "APPROVED" },
  { label: "已拒絕", value: "REJECTED" },
];

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; bg: string; text: string }> = {
  PENDING:   { label: "待處理", bg: "bg-gold/10",          text: "text-gold" },
  REVIEWING: { label: "審核中", bg: "bg-brand/10",         text: "text-brand-light" },
  APPROVED:  { label: "已核准", bg: "bg-emerald-500/10",   text: "text-emerald-400" },
  REJECTED:  { label: "已拒絕", bg: "bg-rose-nude/10",     text: "text-rose-nude" },
};

/* ──────────────────────────── Page ──────────────────────────── */

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "ALL">("ALL");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications?limit=500");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /* ── Status change ── */
  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    try {
      await fetch(`/api/admin/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  }

  /* ── Filtered list ── */
  const filtered = activeTab === "ALL" ? items : items.filter((i) => i.status === activeTab);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif-tc text-2xl text-ivory font-semibold flex items-center gap-3">
            <span>🤝</span> 加盟申請
          </h1>
          <p className="text-caption text-ivory/30 mt-1 font-body">
            共 {filtered.length} 筆申請
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 text-xs font-body rounded-full border transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/40
              ${
                activeTab === tab.value
                  ? "bg-brand/15 text-brand-light border-brand/30"
                  : "bg-ivory/[0.02] text-ivory/40 border-ivory/8 hover:bg-ivory/5"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-ivory/20 font-body text-sm py-12 text-center">載入中...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-ivory/10 rounded-lg p-12 text-center">
          <p className="text-ivory/20 font-body text-sm">目前沒有符合條件的申請</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ivory/5 bg-ivory/[0.01]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ivory/8">
                {["姓名", "電話", "背景", "動機", "狀態", "建立時間"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const sc = STATUS_CONFIG[item.status];
                return (
                  <tr
                    key={item.id}
                    className="border-b border-ivory/5 hover:bg-ivory/[0.02]"
                  >
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.name}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.phone}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.background}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">
                      {item.motivation?.slice(0, 40) +
                        (item.motivation?.length > 40 ? "..." : "")}
                    </td>
                    <td className="px-3 py-3 text-sm font-body">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as ApplicationStatus)
                        }
                        className={`px-2 py-0.5 text-[0.7rem] rounded-full border-0 cursor-pointer
                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/40
                          ${sc.bg} ${sc.text}`}
                      >
                        <option value="PENDING">待處理</option>
                        <option value="REVIEWING">審核中</option>
                        <option value="APPROVED">已核准</option>
                        <option value="REJECTED">已拒絕</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 text-sm text-ivory/40 font-body">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("zh-TW")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
