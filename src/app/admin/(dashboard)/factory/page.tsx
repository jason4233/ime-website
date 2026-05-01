"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface FactoryHighlight {
  id: string;
  title: string;
  description: string;
  section: "RND" | "FACTORY";
  imageUrl: string;
  iconName: string;
  order?: number;
}

const sectionLabels: Record<string, string> = {
  RND: "研發",
  FACTORY: "工廠",
};

const columns: Column<FactoryHighlight>[] = [
  { key: "title", label: "標題" },
  {
    key: "section",
    label: "區域",
    render: (item) => (
      <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-brand/10 text-brand-light">
        {sectionLabels[item.section] ?? item.section}
      </span>
    ),
  },
  {
    key: "description",
    label: "描述",
    render: (item) =>
      item.description?.slice(0, 40) +
      (item.description?.length > 40 ? "..." : ""),
  },
];

const fields = [
  { name: "title", label: "標題", type: "text" as const, required: true },
  { name: "description", label: "描述", type: "textarea" as const, required: true },
  {
    name: "section",
    label: "區域",
    type: "select" as const,
    options: [
      { value: "RND", label: "研發 (RND)" },
      { value: "FACTORY", label: "工廠 (FACTORY)" },
    ],
  },
  { name: "imageUrl", label: "代表圖片", type: "image" as const, folder: "factory" },
  { name: "iconName", label: "Icon 名稱", type: "text" as const },
];

export default function AdminFactoryPage() {
  return (
    <CrudPage<FactoryHighlight>
      title="工廠亮點"
      icon="🏭"
      apiPath="/api/admin/factory"
      columns={columns}
      fields={fields}
    />
  );
}
