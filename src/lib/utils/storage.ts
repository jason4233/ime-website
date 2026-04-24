import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
//   Server-only Supabase storage client
//   使用 SERVICE_ROLE_KEY → 繞過 RLS，後台圖片上傳不需另外設 policy
//   此檔案靠 "server-only" 防止被 client bundle 引入
// ═══════════════════════════════════════════════════════════════

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 優先用 service_role（後台權限），沒有才 fallback 到 anon key
const key = serviceKey || anonKey;

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!supabaseUrl || !key) {
    throw new Error(
      "Supabase 未設定：請在 .env 填入 NEXT_PUBLIC_SUPABASE_URL 以及 SUPABASE_SERVICE_ROLE_KEY（或 NEXT_PUBLIC_SUPABASE_ANON_KEY）"
    );
  }
  if (!_client) {
    _client = createClient(supabaseUrl, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

const BUCKET = "ime-assets";

export async function uploadImage(
  file: File,
  folder: string = "images"
): Promise<string> {
  const supabase = getClient();

  const rawExt = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const ext = (rawExt || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ext.length > 0 && ext.length <= 5 ? ext : "bin";
  const filename = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${safeExt}`;

  // 把 File 轉 ArrayBuffer → Buffer（Node 環境）
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    console.error("[storage.uploadImage] failed:", error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = getClient();
  const path = url.split(`${BUCKET}/`)[1];
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

/**
 * 建立 storage bucket（若不存在）。使用 service_role 才有權限。
 * 建議由 script 一次性執行。
 */
export async function ensureBucket(): Promise<{
  created: boolean;
  bucket: string;
}> {
  const supabase = getClient();
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) return { created: false, bucket: BUCKET };

  const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
  if (createErr) throw createErr;
  return { created: true, bucket: BUCKET };
}
