"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface NewsCard {
  id: string;
  mediaName: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  mediaLogoUrl: string;
  isFeatured: boolean;
  order?: number;
}

const columns: Column<NewsCard>[] = [
  { key: "mediaName", label: "媒體名稱" },
  {
    key: "title",
    label: "標題",
    render: (item) =>
      item.title?.slice(0, 40) + (item.title?.length > 40 ? "..." : ""),
  },
  {
    key: "date",
    label: "日期",
    render: (item) => new Date(item.date).toLocaleDateString("zh-TW"),
  },
  {
    key: "isFeatured",
    label: "精選",
    render: (item) =>
      item.isFeatured ? (
        <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-brand/10 text-brand-light">
          精選
        </span>
      ) : null,
  },
];

const fields = [
  { name: "mediaName", label: "媒體名稱", type: "text" as const, required: true },
  { name: "title", label: "標題", type: "text" as const, required: true },
  { name: "excerpt", label: "摘要", type: "textarea" as const },
  { name: "url", label: "連結網址", type: "text" as const, placeholder: "https://..." },
  { name: "date", label: "日期", type: "date" as const, required: true },
  { name: "mediaLogoUrl", label: "媒體 Logo", type: "image" as const, folder: "news-logos" },
  { name: "isFeatured", label: "設為精選", type: "checkbox" as const },
];

export default function AdminNewsPage() {
  return (
    <CrudPage<NewsCard>
      title="媒體報導"
      icon="📰"
      apiPath="/api/admin/news"
      columns={columns}
      fields={fields}
    />
  );
}
