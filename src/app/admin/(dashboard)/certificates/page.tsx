"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import type { Column } from "@/components/admin/AdminTable";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  imageUrl: string;
  pdfUrl: string;
  order?: number;
}

const columns: Column<Certificate>[] = [
  { key: "title", label: "認證名稱" },
  { key: "issuer", label: "發證單位" },
];

const fields = [
  { name: "title", label: "認證名稱", type: "text" as const, required: true },
  { name: "issuer", label: "發證單位", type: "text" as const, required: true },
  { name: "imageUrl", label: "圖片網址", type: "text" as const },
  { name: "pdfUrl", label: "PDF 網址", type: "text" as const },
];

export default function AdminCertificatesPage() {
  return (
    <CrudPage<Certificate>
      title="認證文件"
      icon="📜"
      apiPath="/api/admin/certificates"
      columns={columns}
      fields={fields}
    />
  );
}
