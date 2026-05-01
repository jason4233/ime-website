/**
 * 圖片裁切變形工具(Pan + Zoom Crop)
 *
 * 把「圖片在固定比例框內的位置與縮放」編進 URL hash:
 *   https://blob.vercel.com/cat.jpg#crop=0.50,0.32,1.20
 *                                          ↑    ↑    ↑
 *                                          ox   oy   scale
 *
 * - ox / oy 為 0~1 之間的比例位置(代表「圖片中『哪一個點』要對齊預覽框中央」),
 *   0.5,0.5 = 圖片中心對齊框中心(預設)
 * - scale 為縮放倍率(1.0 = 原始 cover 大小,1.5 = 放大 1.5 倍,以中央為錨點)
 *
 * 為什麼用 hash 不用 query string?
 * - hash (#) 只在 client 解析,不會送到 server,Vercel Blob 取圖時自動忽略
 * - 不需動 Prisma schema 或 API,既有資料(沒 transform)自動 fallback 到中央 cover
 *
 * 向下相容:也能讀舊版 #focal=x,y(自動轉成 #crop=x,y,1)
 */

export type CropTransform = {
  /** 圖片上「哪一點對齊預覽框中央」, 0~1 */
  ox: number;
  oy: number;
  /** 縮放倍率, >=1 (1 = 原始 cover) */
  scale: number;
};

const DEFAULT_TRANSFORM: CropTransform = { ox: 0.5, oy: 0.5, scale: 1 };

/** 從帶 hash 的 URL 抽出 crop transform */
export function parseCropTransform(url?: string | null): CropTransform | null {
  if (!url) return null;
  // 新版 #crop=ox,oy,s
  const c = url.match(/#crop=([\d.]+),([\d.]+),([\d.]+)/);
  if (c) {
    const ox = parseFloat(c[1]);
    const oy = parseFloat(c[2]);
    const scale = parseFloat(c[3]);
    if (![ox, oy, scale].some(Number.isNaN)) {
      return { ox: clamp01(ox), oy: clamp01(oy), scale: clampScale(scale) };
    }
  }
  // 舊版 #focal=x,y → 等同 (x, y, 1)
  const f = url.match(/#focal=([\d.]+),([\d.]+)/);
  if (f) {
    const ox = parseFloat(f[1]);
    const oy = parseFloat(f[2]);
    if (![ox, oy].some(Number.isNaN)) {
      return { ox: clamp01(ox), oy: clamp01(oy), scale: 1 };
    }
  }
  return null;
}

/** 把 transform 寫回 URL */
export function setCropTransform(url: string, t: CropTransform): string {
  if (!url) return url;
  const cleanUrl = stripCropHash(url);
  const ox = clamp01(t.ox).toFixed(3);
  const oy = clamp01(t.oy).toFixed(3);
  const scale = clampScale(t.scale).toFixed(3);
  return `${cleanUrl}#crop=${ox},${oy},${scale}`;
}

/** 砍掉 hash,還原乾淨的 blob URL(用於 <img src>) */
export function stripCropHash(url?: string | null): string {
  if (!url) return "";
  return url.split("#")[0];
}

/** 取 transform 或回 default(用於前台 render) */
export function getCropTransform(url?: string | null): CropTransform {
  return parseCropTransform(url) ?? DEFAULT_TRANSFORM;
}

// ─── 向下相容舊命名 ─────────────────────────────────────
export type FocalPoint = { x: number; y: number };

/** @deprecated 用 parseCropTransform 替代 */
export function parseFocalPoint(url?: string | null): FocalPoint | null {
  const t = parseCropTransform(url);
  if (!t) return null;
  return { x: t.ox, y: t.oy };
}

/** @deprecated 用 setCropTransform 替代 */
export function setFocalPoint(url: string, x: number, y: number): string {
  return setCropTransform(url, { ox: x, oy: y, scale: 1 });
}

/** @deprecated alias for stripCropHash */
export function stripFocalPoint(url?: string | null): string {
  return stripCropHash(url);
}

/** @deprecated 簡單 fallback;新版用 transform 直接 render */
export function focalToObjectPosition(focal: FocalPoint | null | undefined): string {
  const f = focal ?? { x: 0.5, y: 0.5 };
  return `${(f.x * 100).toFixed(1)}% ${(f.y * 100).toFixed(1)}%`;
}

/** @deprecated 給尚未升級到 CroppedImage 的 section 用的最簡 object-position */
export function urlToObjectPosition(url?: string | null): string {
  const t = parseCropTransform(url);
  if (!t) return "50% 50%";
  return `${(t.ox * 100).toFixed(1)}% ${(t.oy * 100).toFixed(1)}%`;
}

// ─── 工具 ─────────────────────────────────────
function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
function clampScale(n: number): number {
  return Math.min(4, Math.max(1, n));
}
