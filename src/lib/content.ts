import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { SITE_URL } from "./site-url";

/**
 * 前台內容讀取層 — 從 DB 讀 + 用 revalidateTag 控制快取失效
 *
 * 每個 getter 用 unstable_cache 包起來、帶 tag。
 * 後台 CRUD 存檔後 POST /api/revalidate { tag } 即可讓前台秒更新。
 *
 * 若 DB 連線失敗或 model 空（例如第一次部署、尚未 seed），
 * 回傳 fallback 硬編資料，讓前台不會崩。
 */

// ─── Hero ─────────────────────────────────────
export const getHero = unstable_cache(
  async () => {
    try {
      const hero = await prisma.heroSection.findFirst({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      return hero;
    } catch {
      return null;
    }
  },
  ["hero"],
  { tags: ["hero"], revalidate: 60 }
);

// ─── Brand Story ──────────────────────────────
export const getBrandStory = unstable_cache(
  async () => {
    try {
      return await prisma.brandStorySection.findMany({
        orderBy: { order: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["brand-story"],
  { tags: ["brand-story"], revalidate: 60 }
);

// ─── Founders ─────────────────────────────────
export const getFounders = unstable_cache(
  async () => {
    try {
      return await prisma.founder.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["founders"],
  { tags: ["founders"], revalidate: 60 }
);

// ─── Products ─────────────────────────────────
export const getProducts = unstable_cache(
  async () => {
    try {
      return await prisma.product.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["products"],
  { tags: ["products"], revalidate: 60 }
);

// ─── Courses ──────────────────────────────────
export const getCourses = unstable_cache(
  async () => {
    try {
      return await prisma.course.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["courses"],
  { tags: ["courses"], revalidate: 60 }
);

// ─── Certificates ─────────────────────────────
export const getCertificates = unstable_cache(
  async () => {
    try {
      return await prisma.certificate.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["certificates"],
  { tags: ["certificates"], revalidate: 60 }
);

// ─── News ─────────────────────────────────────
export const getNews = unstable_cache(
  async () => {
    try {
      return await prisma.newsCard.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["news"],
  { tags: ["news"], revalidate: 60 }
);

// ─── Testimonials ─────────────────────────────
export const getTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["testimonials"],
  { tags: ["testimonials"], revalidate: 60 }
);

// ─── Before / After ───────────────────────────
export const getBeforeAfter = unstable_cache(
  async () => {
    try {
      return await prisma.beforeAfterCase.findMany({ orderBy: { order: "asc" } });
    } catch {
      return [];
    }
  },
  ["before-after"],
  { tags: ["before-after"], revalidate: 60 }
);

// ─── Factory / RnD Highlights ─────────────────
export const getFactoryHighlights = unstable_cache(
  async (section?: "RND" | "FACTORY") => {
    try {
      return await prisma.factoryHighlight.findMany({
        where: section ? { section } : undefined,
        orderBy: { order: "asc" },
      });
    } catch {
      return [];
    }
  },
  ["factory"],
  { tags: ["factory"], revalidate: 60 }
);

// ─── Site Settings ────────────────────────────
export const getSiteSettings = unstable_cache(
  async () => {
    try {
      return await prisma.siteSettings.findFirst();
    } catch {
      return null;
    }
  },
  ["site-settings"],
  { tags: ["site-settings"], revalidate: 60 }
);

/**
 * 後台 helper：寫入 DB 後呼叫這個 trigger revalidate
 * 用在 api/admin/xxx 的 POST/PATCH/DELETE handler 裡
 */
export async function triggerRevalidate(tag: string) {
  const secret = process.env.REVALIDATE_SECRET;
  const baseUrl = SITE_URL || "http://localhost:3000";

  if (!secret) {
    console.warn("[revalidate] REVALIDATE_SECRET missing, skipping");
    return;
  }

  try {
    await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ tag }),
    });
  } catch (e) {
    console.warn("[revalidate] failed:", e);
  }
}
