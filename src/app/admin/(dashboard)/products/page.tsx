"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  imageUrl: string;
  gallery: string[];
  order?: number;
}

const columns: Column<Product>[] = [
  { key: "name", label: "產品名稱" },
  {
    key: "tagline",
    label: "標語",
    render: (item) =>
      item.tagline?.slice(0, 40) + (item.tagline?.length > 40 ? "..." : ""),
  },
  {
    key: "price",
    label: "價格",
    render: (item) =>
      item.price != null ? `NT$ ${item.price.toLocaleString()}` : "—",
  },
];

const fields = [
  { name: "name", label: "產品名稱", type: "text" as const, required: true },
  { name: "tagline", label: "標語", type: "text" as const, required: true },
  { name: "description", label: "產品描述", type: "textarea" as const, required: true },
  { name: "price", label: "價格", type: "number" as const },
  { name: "imageUrl", label: "主圖(直幅瓶身 4:5)", type: "image" as const, folder: "products", aspectRatio: 4 / 5 },
  { name: "gallery", label: "產品輪播圖(多張可拖拉排序)", type: "gallery" as const, folder: "products", max: 8 },
];

export default function AdminProductsPage() {
  return (
    <CrudPage<Product>
      title="產品管理"
      icon="🧴"
      apiPath="/api/admin/products"
      columns={columns}
      fields={fields}
    />
  );
}
