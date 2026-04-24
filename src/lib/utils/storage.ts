import "server-only";
import { put, del, list } from "@vercel/blob";

// ═══════════════════════════════════════════════════════════════
//   Server-only storage — Vercel Blob
//   BLOB_READ_WRITE_TOKEN 由 Vercel Marketplace 整合自動注入到 env
//   本地開發：`vercel env pull .env.local` 可取得
// ═══════════════════════════════════════════════════════════════

export async function uploadImage(
  file: File,
  folder: string = "images"
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN 未設定。若本地開發請跑 `vercel env pull .env.local`。"
    );
  }

  const rawExt = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const ext = (rawExt || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ext.length > 0 && ext.length <= 5 ? ext : "bin";
  const filename = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${safeExt}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
    cacheControlMaxAge: 3600,
  });

  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url);
  } catch (err) {
    console.warn("[storage.deleteImage] failed:", err);
  }
}

/**
 * 列出現有 blob 物件（除錯用）
 */
export async function listImages(limit = 20) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const { blobs } = await list({ limit });
  return blobs;
}
