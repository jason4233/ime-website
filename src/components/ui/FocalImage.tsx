/**
 * CroppedImage / FocalImage — 自動套裁切變形(pan/zoom)的圖片元件
 *
 * 用法:
 *   <FocalImage src={product.imageUrl} alt="..." className="w-full h-64" />
 *
 * src 是後台拖曳裁切後寫進的 URL(可能含 #crop=ox,oy,s),元件會:
 * 1. 解析 hash 取出 transform
 * 2. 容器 overflow:hidden,圖片絕對定位 + object-cover + transform
 * 3. WYSIWYG:跟後台預覽框完全一致
 *
 * 沒設過裁切的圖會 fallback 成中央 cover(等同舊行為)。
 */

import { stripCropHash, getCropTransform } from "@/lib/utils/focal-point";

interface FocalImageProps {
  src?: string | null;
  alt?: string;
  /** 套在外層 wrapper 的 className(控制大小、圓角、陰影等)*/
  className?: string;
  /** 預設 cover */
  objectFit?: "cover" | "contain";
  loading?: "eager" | "lazy";
}

export function FocalImage({
  src,
  alt = "",
  className = "",
  objectFit = "cover",
  loading = "lazy",
}: FocalImageProps) {
  if (!src) return null;
  const cleanSrc = stripCropHash(src);
  const t = getCropTransform(src);

  const tx = (0.5 - t.ox) * 100;
  const ty = (0.5 - t.oy) * 100;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cleanSrc}
        alt={alt}
        loading={loading}
        draggable={false}
        className="absolute inset-0 w-full h-full select-none"
        style={{
          objectFit,
          transform: `translate(${tx}%, ${ty}%) scale(${t.scale})`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}

// 別名(向下相容,讓既有 import 仍可用)
export const CroppedImage = FocalImage;
