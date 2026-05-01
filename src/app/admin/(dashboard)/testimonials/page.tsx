"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface Testimonial {
  id: string;
  customerName: string;
  age: number;
  courseType: string;
  rating: number;
  content: string;
  avatarUrl: string;
  isVideo: boolean;
  videoUrl: string;
  order?: number;
}

const columns: Column<Testimonial>[] = [
  { key: "customerName", label: "客戶姓名" },
  { key: "courseType", label: "課程類型" },
  {
    key: "rating",
    label: "評分",
    render: (item) => (
      <span className="text-gold">{"★".repeat(item.rating ?? 0)}</span>
    ),
  },
  {
    key: "content",
    label: "內容",
    render: (item) =>
      item.content?.slice(0, 40) + (item.content?.length > 40 ? "..." : ""),
  },
];

const fields = [
  { name: "customerName", label: "客戶姓名", type: "text" as const, required: true },
  { name: "age", label: "年齡", type: "number" as const },
  { name: "courseType", label: "課程類型", type: "text" as const },
  { name: "rating", label: "評分 (1-5)", type: "number" as const },
  { name: "content", label: "見證內容", type: "textarea" as const, required: true },
  { name: "avatarUrl", label: "頭像", type: "image" as const, folder: "testimonials" },
  { name: "isVideo", label: "影片見證", type: "checkbox" as const },
  { name: "videoUrl", label: "影片網址", type: "text" as const, placeholder: "https://..." },
];

export default function AdminTestimonialsPage() {
  return (
    <CrudPage<Testimonial>
      title="客戶見證"
      icon="💬"
      apiPath="/api/admin/testimonials"
      columns={columns}
      fields={fields}
    />
  );
}
