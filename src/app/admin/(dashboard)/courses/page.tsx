"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface Course {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  durationMinutes: number;
  price: number;
  suitableFor: string;
  imageUrl: string;
  order?: number;
}

const columns: Column<Course>[] = [
  { key: "name", label: "課程名稱" },
  {
    key: "durationMinutes",
    label: "時長 (分鐘)",
    render: (item) => (item.durationMinutes != null ? `${item.durationMinutes} 分鐘` : "—"),
  },
  {
    key: "price",
    label: "價格",
    render: (item) =>
      item.price != null ? `NT$ ${item.price.toLocaleString()}` : "—",
  },
  { key: "suitableFor", label: "適合對象" },
];

const fields = [
  { name: "name", label: "課程名稱", type: "text" as const, required: true },
  { name: "shortDesc", label: "簡短描述", type: "text" as const, required: true },
  { name: "fullDesc", label: "完整描述", type: "textarea" as const, required: true },
  { name: "durationMinutes", label: "時長 (分鐘)", type: "number" as const },
  { name: "price", label: "價格", type: "number" as const },
  { name: "suitableFor", label: "適合對象", type: "text" as const },
  { name: "imageUrl", label: "課程圖片網址", type: "text" as const },
];

export default function AdminCoursesPage() {
  return (
    <CrudPage<Course>
      title="課程管理"
      icon="🎓"
      apiPath="/api/admin/courses"
      columns={columns}
      fields={fields}
    />
  );
}
