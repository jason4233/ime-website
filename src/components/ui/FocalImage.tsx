/**
 * FocalImage — 自動套 focal point 的圖片元件
 *
 * 用法:
 *   <FocalImage src={product.imageUrl} alt="..." className="w-full h-64" />
 *
 * src 是後台拖曳焦點後寫進的 URL(可能含 #focal=x,y),元件會:
 * 1. 解析 hash 取出焦點座標
 * 2. <img src> 用乾淨的 URL(不含 hash)
 * 3. style.objectPosition 套上焦點,讓 object-cover 不論裁切都以該點為中心
 *
 * 沒設過焦點的圖會 fallback 成中央 50/50。
 */

import { stripFocalPoint, urlToObjectPosition } from "@/lib/utils/focal-point";

interface FocalImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  /** 預設 "object-cover";若想換成 contain 等可覆蓋 */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "eager" | "lazy";
  draggable?: boolean;
}

export function FocalImage({
  src,
  alt = "",
  className = "",
  objectFit = "cover",
  loading = "lazy",
  draggable = false,
}: FocalImageProps) {
  if (!src) return null;
  const cleanSrc = stripFocalPoint(src);
  const objectPosition = urlToObjectPosition(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cleanSrc}
      alt={alt}
      className={className}
      style={{
        objectFit,
        objectPosition,
      }}
      loading={loading}
      draggable={draggable}
    />
  );
}
