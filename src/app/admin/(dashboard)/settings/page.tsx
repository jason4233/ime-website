"use client";

import { useState, useEffect } from "react";

/* ──────────────────────────── Types ──────────────────────────── */

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  lineUrl: string;
  igUrl: string;
  fbUrl: string;
  contactPhone: string;
  contactEmail: string;
}

const FIELD_DEFS: {
  name: keyof SiteSettings;
  label: string;
  type: "text" | "textarea" | "email" | "tel";
  placeholder?: string;
}[] = [
  { name: "siteTitle", label: "網站標題", type: "text", placeholder: "I ME" },
  { name: "siteDescription", label: "網站描述", type: "textarea", placeholder: "Exosome Beauty for you" },
  { name: "lineUrl", label: "LINE 連結", type: "text", placeholder: "https://line.me/..." },
  { name: "igUrl", label: "Instagram 連結", type: "text", placeholder: "https://instagram.com/..." },
  { name: "fbUrl", label: "Facebook 連結", type: "text", placeholder: "https://facebook.com/..." },
  { name: "contactPhone", label: "聯絡電話", type: "tel", placeholder: "02-1234-5678" },
  { name: "contactEmail", label: "聯絡信箱", type: "email", placeholder: "info@example.com" },
];

const INITIAL: SiteSettings = {
  siteTitle: "",
  siteDescription: "",
  lineUrl: "",
  igUrl: "",
  fbUrl: "",
  contactPhone: "",
  contactEmail: "",
};

/* ──────────────────────────── Page ──────────────────────────── */

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SiteSettings>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* ── Fetch current settings ── */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  /* ── Save ── */
  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setToast("設定已儲存");
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast("儲存失敗，請重試");
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      setToast("儲存失敗，請檢查網路連線");
      setTimeout(() => setToast(null), 4000);
    }
    setSaving(false);
  }

  function updateField(name: keyof SiteSettings, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-ivory/20 font-body text-sm">載入設定中...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif-tc text-2xl text-ivory font-semibold flex items-center gap-3">
          <span>⚙️</span> 網站設定
        </h1>
        <p className="text-caption text-ivory/30 mt-1 font-body">
          管理全站設定與社群連結
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl space-y-6">
        {FIELD_DEFS.map((field) => (
          <div key={field.name}>
            <label className="block text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={formData[field.name]}
                onChange={(e) => updateField(field.name, e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                           text-ivory font-body text-sm resize-none
                           focus:outline-none focus:border-brand/40 transition-colors"
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) => updateField(field.name, e.target.value)}
                className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                           text-ivory font-body text-sm
                           focus:outline-none focus:border-brand/40 transition-colors"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold py-3 px-8 text-sm disabled:opacity-50"
          >
            {saving ? "儲存中..." : "儲存設定"}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-md text-sm font-body
                        bg-brand/90 text-ivory shadow-brand-glow
                        animate-fade-up">
          {toast}
        </div>
      )}
    </div>
  );
}
