"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminTable, Column } from "./AdminTable";
import { ConfirmModal } from "./ConfirmModal";

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "email" | "tel" | "date" | "select" | "checkbox" | "richtext" | "image";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface CrudPageProps<T extends { id: string }> {
  title: string;
  icon: string;
  apiPath: string;         // e.g. "/api/admin/news"
  columns: Column<T>[];
  fields: FieldDef[];
  sortable?: boolean;
  defaultValues?: Partial<T>;
}

export function CrudPage<T extends { id: string; order?: number }>({
  title,
  icon,
  apiPath,
  columns,
  fields,
  sortable = true,
  defaultValues = {},
}: CrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<T | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiPath}?search=${encodeURIComponent(search)}&limit=200`);
      const payload = await res.json();
      // API 回傳 { data: [...], total, page, limit } — 相容舊的直接回陣列格式
      const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
      setItems(Array.isArray(list) ? list : []);
    } catch { setItems([]); }
    setLoading(false);
  }, [apiPath, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function handleNew() {
    setEditItem(null);
    setIsNew(true);
    setFormData(defaultValues as Record<string, unknown>);
    setShowForm(true);
  }

  function handleEdit(item: T) {
    setEditItem(item);
    setIsNew(false);
    setFormData(item as unknown as Record<string, unknown>);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? apiPath : `${apiPath}/${(editItem as T).id}`;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowForm(false);
      fetchItems();
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      await fetch(`${apiPath}/${deleteItem.id}`, { method: "DELETE" });
      setDeleteItem(null);
      fetchItems();
    } catch (e) { console.error(e); }
    setDeleting(false);
  }

  async function handleReorder(reorderedItems: T[]) {
    const updates = reorderedItems.map((item, i) => ({ id: item.id, order: i }));
    try {
      await fetch(`${apiPath}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });
    } catch (e) { console.error(e); }
  }

  function updateField(name: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif-tc text-2xl text-ivory font-semibold flex items-center gap-3">
            <span>{icon}</span> {title}
          </h1>
          <p className="text-caption text-ivory/30 mt-1 font-body">
            共 {items.length} 筆資料
          </p>
        </div>
        <button onClick={handleNew} className="btn-gold text-sm">
          + 新增
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="搜尋..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 bg-ivory/5 border border-ivory/8 rounded-md
                     text-sm text-ivory placeholder:text-ivory/20 font-body
                     focus:outline-none focus:border-brand/30 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-ivory/20 font-body text-sm py-12 text-center">載入中...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-ivory/10 rounded-lg p-12 text-center">
          <p className="text-ivory/20 font-body text-sm">尚無資料，點擊「新增」開始</p>
        </div>
      ) : (
        <AdminTable
          data={items}
          columns={columns}
          onEdit={handleEdit}
          onDelete={setDeleteItem}
          onReorder={sortable ? handleReorder : undefined}
          sortable={sortable}
        />
      )}

      {/* Edit/Create Slide-over */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-night/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-lg h-full bg-[#111] border-l border-ivory/5
                         overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-tc text-xl text-ivory font-medium">
                {isNew ? "新增" : "編輯"}{title}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-ivory/30 hover:text-ivory/60 transition-colors">✕</button>
            </div>

            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-[0.65rem] text-ivory/30 uppercase tracking-wider font-body mb-1">
                    {field.label} {field.required && <span className="text-brand">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={String(formData[field.name] || "")}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                                 text-ivory font-body text-sm resize-none
                                 focus:outline-none focus:border-brand/40 transition-all"
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={String(formData[field.name] || "")}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                                 text-ivory font-body text-sm
                                 focus:outline-none focus:border-brand/40 transition-all"
                    >
                      <option value="">請選擇...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "checkbox" ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData[field.name])}
                        onChange={(e) => updateField(field.name, e.target.checked)}
                        className="w-4 h-4 rounded border-ivory/20 bg-ivory/5 text-brand
                                   focus:ring-brand/30"
                      />
                      <span className="text-sm text-ivory/50 font-body">{field.label}</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      value={String(formData[field.name] || "")}
                      onChange={(e) => updateField(field.name,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )}
                      className="w-full px-4 py-3 bg-ivory/5 border border-ivory/8 rounded-md
                                 text-ivory font-body text-sm
                                 focus:outline-none focus:border-brand/40 transition-all"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-gold py-3 text-sm disabled:opacity-50"
              >
                {saving ? "儲存中..." : "儲存"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 text-sm font-body text-ivory/40 border border-ivory/10 rounded-brand
                           hover:bg-ivory/5 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteItem}
        title="確認刪除"
        message={`確定要刪除此筆「${title}」資料嗎？此操作無法復原。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
        loading={deleting}
      />
    </div>
  );
}
