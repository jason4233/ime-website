"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface BeforeAfterCase {
  id: string;
  title: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  daysBetween: number;
  notes: string;
  order?: number;
}

const columns: Column<BeforeAfterCase>[] = [
  { key: "title", label: "標題" },
  { key: "daysBetween", label: "間隔天數" },
  {
    key: "notes",
    label: "備註",
    render: (item) =>
      item.notes?.slice(0, 40) + (item.notes?.length > 40 ? "..." : ""),
  },
];

const fields = [
  { name: "title", label: "標題", type: "text" as const, required: true },
  { name: "beforeImageUrl", label: "術前圖片(直幅 3:4)", type: "image" as const, required: true, folder: "before-after", aspectRatio: 3 / 4 },
  { name: "afterImageUrl", label: "術後圖片(直幅 3:4)", type: "image" as const, required: true, folder: "before-after", aspectRatio: 3 / 4 },
  { name: "daysBetween", label: "間隔天數", type: "number" as const, required: true },
  { name: "notes", label: "備註", type: "textarea" as const },
];

export default function AdminBeforeAfterPage() {
  return (
    <CrudPage<BeforeAfterCase>
      title="前後對比"
      icon="🔄"
      apiPath="/api/admin/before-after"
      columns={columns}
      fields={fields}
    />
  );
}
