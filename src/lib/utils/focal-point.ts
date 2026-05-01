/**
 * Focal Point 焦點工具
 *
 * 把「圖片的視覺重心」編進 URL hash:
 *   https://blob.vercel.com/cat.jpg#focal=0.50,0.32
 *                                          ↑    ↑
 *                                          x    y  (0~1, 左上=0,0;右下=1,1)
 *
 * 為什麼用 hash 不用 query string?
 * - hash (#) 只在 client 解析,不會送到 server,Vercel Blob 取圖時自動忽略
 * - query string (?) 在 Vercel Blob 會被當作存取 token 驗證的一部分,可能干擾
 * - 不需動 Prisma schema 或 API,既有資料(沒 focal)自動 fallback 到中央 50/50
 */

export type FocalPoint = { x: number; y: number };

const DEFAULT_FOCAL: FocalPoint = { x: 0.5, y: 0.5 };

/** 從帶 hash 的 URL 抽出 focal point;沒寫就回 null */
export function parseFocalPoint(url?: string | null): FocalPoint | null {
  if (!url) return null;
  const m = url.match(/#focal=([\d.]+),([\d.]+)/);
  if (!m) return null;
  const x = parseFloat(m[1]);
  const y = parseFloat(m[2]);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return { x: clamp01(x), y: clamp01(y) };
}

/** 把 focal point 寫回 URL(覆蓋既有 hash);x,y 自動 clamp 到 0~1 */
export function setFocalPoint(url: string, x: number, y: number): string {
  if (!url) return url;
  const cleanUrl = url.split("#")[0];
  const cx = clamp01(x).toFixed(3);
  const cy = clamp01(y).toFixed(3);
  return `${cleanUrl}#focal=${cx},${cy}`;
}

/** 砍掉 hash,還原乾淨的 blob URL(用於 <img src>) */
export function stripFocalPoint(url?: string | null): string {
  if (!url) return "";
  return url.split("#")[0];
}

/** 給 CSS object-position 用的字串(預設 50% 50%) */
export function focalToObjectPosition(focal: FocalPoint | null | undefined): string {
  const f = focal ?? DEFAULT_FOCAL;
  return `${(f.x * 100).toFixed(1)}% ${(f.y * 100).toFixed(1)}%`;
}

/** 從 URL 一站式抽出 object-position(沒設過就回 "50% 50%") */
export function urlToObjectPosition(url?: string | null): string {
  return focalToObjectPosition(parseFocalPoint(url));
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
