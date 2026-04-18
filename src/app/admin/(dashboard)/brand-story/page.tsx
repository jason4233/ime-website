"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface BrandStorySection {
  id: string;
  title: string;
  bodyRichText: string;
  imageUrl: string;
  order?: number;
}

const columns: Column<BrandStorySection>[] = [
  { key: "title", label: "標題" },
  { key: "order", label: "排序" },
];

const fields = [
  { name: "title", label: "標題", type: "text" as const, required: true },
  { name: "bodyRichText", label: "內文", type: "textarea" as const, required: true },
  { name: "imageUrl", label: "圖片網址", type: "text" as const },
];

export default function AdminBrandStoryPage() {
  return (
    <CrudPage<BrandStorySection>
      title="品牌故事"
      icon="📖"
      apiPath="/api/admin/brand-story"
      columns={columns}
      fields={fields}
    />
  );
}
