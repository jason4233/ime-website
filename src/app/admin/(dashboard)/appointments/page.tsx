"use client";

import { useState, useEffect, useCallback } from "react";

/* ──────────────────────────── Types ──────────────────────────── */

type AppointmentStatus = "PENDING" | "CONFIRMED" | "DONE" | "CANCELLED";

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseName: string;
  preferredDate: string;
  status: AppointmentStatus;
  createdAt: string;
  notes?: string;
}

const STATUS_TABS: { label: string; value: AppointmentStatus | "ALL" }[] = [
  { label: "全部", value: "ALL" },
  { label: "待處理", value: "PENDING" },
  { label: "已確認", value: "CONFIRMED" },
  { label: "已完成", value: "DONE" },
  { label: "已取消", value: "CANCELLED" },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  PENDING:   { label: "待處理", bg: "bg-gold/10",          text: "text-gold" },
  CONFIRMED: { label: "已確認", bg: "bg-brand/10",         text: "text-brand-light" },
  DONE:      { label: "已完成", bg: "bg-emerald-500/10",   text: "text-emerald-400" },
  CANCELLED: { label: "已取消", bg: "bg-rose-nude/10",     text: "text-rose-nude" },
};

/* ──────────────────────────── Page ──────────────────────────── */

export default function AdminAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppointmentStatus | "ALL">("ALL");
  const [detailItem, setDetailItem] = useState<Appointment | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments?limit=500");
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
  async function handleStatusChange(id: string, newStatus: AppointmentStatus) {
    try {
      await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (detailItem?.id === id) {
        setDetailItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  }

  /* ── CSV export ── */
  async function handleExport() {
    try {
      const res = await fetch("/api/admin/appointments/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
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
            <span>📅</span> 預約管理
          </h1>
          <p className="text-caption text-ivory/30 mt-1 font-body">
            共 {filtered.length} 筆預約
          </p>
        </div>
        <button onClick={handleExport} className="btn-gold text-sm">
          匯出 CSV
        </button>
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
          <p className="text-ivory/20 font-body text-sm">目前沒有符合條件的預約</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ivory/5 bg-ivory/[0.01]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ivory/8">
                {["姓名", "電話", "Email", "課程", "偏好日期", "狀態", "建立時間"].map((h) => (
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
                    onClick={() => setDetailItem(item)}
                    className="border-b border-ivory/5 hover:bg-ivory/[0.02] cursor-pointer"
                  >
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.name}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.phone}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.email}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">{item.courseName}</td>
                    <td className="px-3 py-3 text-sm text-ivory/60 font-body">
                      {item.preferredDate ? new Date(item.preferredDate).toLocaleDateString("zh-TW") : "—"}
                    </td>
                    <td className="px-3 py-3 text-sm font-body">
                      {/* Status dropdown — stop row click propagation */}
                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, e.target.value as AppointmentStatus);
                        }}
                        className={`px-2 py-0.5 text-[0.7rem] rounded-full border-0 cursor-pointer
                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/40
                          ${sc.bg} ${sc.text}`}
                      >
                        <option value="PENDING">待處理</option>
                        <option value="CONFIRMED">已確認</option>
                        <option value="DONE">已完成</option>
                        <option value="CANCELLED">已取消</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 text-sm text-ivory/40 font-body">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("zh-TW") : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detail slide-over panel ── */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-night/60 backdrop-blur-sm"
            onClick={() => setDetailItem(null)}
          />
          <div className="relative z-10 w-full max-w-lg h-full bg-[#111] border-l border-ivory/5 overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-tc text-xl text-ivory font-medium">預約詳情</h2>
              <button
                onClick={() => setDetailItem(null)}
                className="text-ivory/30 hover:text-ivory/60 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              {[
                { label: "姓名", value: detailItem.name },
                { label: "電話", value: detailItem.phone },
                { label: "Email", value: detailItem.email },
                { label: "課程名稱", value: detailItem.courseName },
                {
                  label: "偏好日期",
                  value: detailItem.preferredDate
                    ? new Date(detailItem.preferredDate).toLocaleDateString("zh-TW")
                    : "—",
                },
                {
                  label: "建立時間",
                  value: detailItem.createdAt
                    ? new Date(detailItem.createdAt).toLocaleString("zh-TW")
                    : "—",
                },
                { label: "備註", value: detailItem.notes || "—" },
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
                    {row.label}
                  </p>
                  <p className="text-sm text-ivory/70 font-body">{row.value}</p>
                </div>
              ))}

              {/* Status changer in panel */}
              <div>
                <p className="text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
                  狀態
                </p>
                <select
                  value={detailItem.status}
                  onChange={(e) =>
                    handleStatusChange(detailItem.id, e.target.value as AppointmentStatus)
                  }
                  className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                             text-ivory font-body text-sm
                             focus:outline-none focus:border-brand/40 transition-colors"
                >
                  <option value="PENDING">待處理</option>
                  <option value="CONFIRMED">已確認</option>
                  <option value="DONE">已完成</option>
                  <option value="CANCELLED">已取消</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
