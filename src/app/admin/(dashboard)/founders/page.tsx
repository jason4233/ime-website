"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface Founder {
  id: string;
  name: string;
  title: string;
  bio: string;
  quote: string;
  photoUrl: string;
  order?: number;
}

const columns: Column<Founder>[] = [
  { key: "name", label: "姓名" },
  { key: "title", label: "職稱" },
  {
    key: "quote",
    label: "名言",
    render: (item) =>
      item.quote?.slice(0, 40) + (item.quote?.length > 40 ? "..." : ""),
  },
];

const fields = [
  { name: "name", label: "姓名", type: "text" as const, required: true },
  { name: "title", label: "職稱", type: "text" as const, required: true },
  { name: "bio", label: "個人簡介", type: "textarea" as const, required: true },
  { name: "quote", label: "名言 / 座右銘", type: "textarea" as const },
  { name: "photoUrl", label: "照片網址", type: "text" as const },
];

export default function AdminFoundersPage() {
  return (
    <CrudPage<Founder>
      title="創辦人"
      icon="👤"
      apiPath="/api/admin/founders"
      columns={columns}
      fields={fields}
    />
  );
}
