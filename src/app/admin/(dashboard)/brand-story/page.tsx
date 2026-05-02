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
  // 注意:品牌故事為純文字「三幕敘事」設計,前台不顯示圖片(刻意「無人物剪影,讓文字自己說話」)。
  // 因此移除圖片欄位避免使用者誤以為可上傳。如未來改設計,再加回:
  // { name: "imageUrl", label: "圖片", type: "image" as const, folder: "brand-story" },
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
