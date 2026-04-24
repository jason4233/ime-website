import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/utils/api-helpers";

// ═══════════════════════════════════════════════════════════════
//   POST /api/admin/revalidate
//   登入後台才能呼叫。一次 flush 所有前台 CMS 快取。
//   用在「修改後台資料 → 立即更新前台」按鈕。
// ═══════════════════════════════════════════════════════════════

const ALL_TAGS = [
  "hero",
  "brand-story",
  "founders",
  "products",
  "courses",
  "certificates",
  "news",
  "testimonials",
  "before-after",
  "factory",
  "site-settings",
];

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  ALL_TAGS.forEach((tag) => revalidateTag(tag));
  return NextResponse.json({
    revalidated: ALL_TAGS,
    message: "前台快取已清除，下一次瀏覽會看到最新內容",
    now: Date.now(),
  });
}
