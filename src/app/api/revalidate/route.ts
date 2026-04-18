import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Body: { tag: "hero" | "news" | "founders" | ... | "all" }
 *
 * 後台 CRUD 存檔後呼叫這個，讓對應 section 的 cache 失效，
 * 前台下次 request 就拿到新資料（不用等 ISR revalidate 自然過期）。
 *
 * 安全：需帶 Authorization: Bearer <REVALIDATE_SECRET>
 */

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

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    );
  }

  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tag = body.tag as string | undefined;

  if (!tag) {
    return NextResponse.json({ error: "tag required" }, { status: 400 });
  }

  if (tag === "all") {
    ALL_TAGS.forEach((t) => revalidateTag(t));
    return NextResponse.json({ revalidated: ALL_TAGS, now: Date.now() });
  }

  if (!ALL_TAGS.includes(tag)) {
    return NextResponse.json(
      { error: `unknown tag: ${tag}`, valid: ALL_TAGS },
      { status: 400 }
    );
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: [tag], now: Date.now() });
}
