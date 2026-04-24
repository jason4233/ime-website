#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//   Supabase Storage 一鍵初始化
//   需要在 .env 設 NEXT_PUBLIC_SUPABASE_URL 與 SUPABASE_SERVICE_ROLE_KEY
//
//   用法：
//     npm run setup:storage
//   或：
//     node scripts/setup-storage.mjs
// ═══════════════════════════════════════════════════════════════

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "ime-assets";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\n❌ 缺少必要的環境變數。請先在 .env 設好以下兩個：\n" +
      "   NEXT_PUBLIC_SUPABASE_URL\n" +
      "   SUPABASE_SERVICE_ROLE_KEY\n\n" +
      "取得方式：Supabase Dashboard → Settings → API\n"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`🗂  檢查 bucket "${BUCKET}" ...`);
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error("❌ 無法列出 buckets：", listErr.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === BUCKET);
  if (exists) {
    console.log(`✅ Bucket "${BUCKET}" 已經存在，略過建立`);
  } else {
    console.log(`➕ 建立 bucket "${BUCKET}" ...`);
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (createErr) {
      console.error("❌ 建立失敗：", createErr.message);
      process.exit(1);
    }
    console.log(`✅ Bucket "${BUCKET}" 建立成功（公開讀取）`);
  }

  // 測試一次上傳＋下載
  console.log(`\n🧪 測試上傳一個 0.2KB 的測試檔 ...`);
  const testKey = `health/test-${Date.now()}.txt`;
  const testBody = `hello from setup-storage.mjs @ ${new Date().toISOString()}`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(testKey, testBody, {
      contentType: "text/plain",
      upsert: true,
    });
  if (upErr) {
    console.error("❌ 測試上傳失敗：", upErr.message);
    process.exit(1);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(testKey);
  console.log(`✅ 測試上傳成功：${urlData.publicUrl}`);

  // 清掉測試檔
  await supabase.storage.from(BUCKET).remove([testKey]);
  console.log(`🧹 測試檔已清除\n`);

  console.log("🎉 Storage 設定完成，後台現在可以上傳圖片了。\n");
}

main().catch((e) => {
  console.error("❌ Unexpected error:", e);
  process.exit(1);
});
