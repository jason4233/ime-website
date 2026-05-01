"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  parseCropTransform,
  setCropTransform,
  stripCropHash,
  type CropTransform,
} from "@/lib/utils/focal-point";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  /**
   * 預覽框的長寬比(寬/高),要跟前台顯示的 aspect 一致才能 WYSIWYG。
   * 預設 16/9;傳 3/4(直幅人像)、1(正方形)、4/3 等即可。
   */
  aspectRatio?: number;
}

const DEFAULT_TRANSFORM: CropTransform = { ox: 0.5, oy: 0.5, scale: 1 };

/**
 * Instagram 式拖曳裁切上傳元件
 *
 * - 預覽框比例 = 前台容器比例,所見即所得
 * - 上傳完進入「裁切模式」,拖曳圖片在框內 pan、滑鼠滾輪 / 縮放滑桿 zoom
 * - 儲存的不是「焦點」,而是 (ox, oy, scale) 三元組,編進 URL hash
 * - 前台 CroppedImage 用同樣 transform 還原
 */
export function ImageUpload({
  value,
  onChange,
  folder = "images",
  aspectRatio = 16 / 9,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [transform, setTransform] = useState<CropTransform>(
    () => parseCropTransform(value) ?? DEFAULT_TRANSFORM
  );
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startClientX: number;
    startClientY: number;
    startOx: number;
    startOy: number;
  } | null>(null);

  // 編輯既有紀錄時 sync preview + transform
  useEffect(() => {
    if (value) {
      setPreview(value);
      const parsed = parseCropTransform(value);
      if (parsed) setTransform(parsed);
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (cropMode) return;
      const file = acceptedFiles[0];
      if (!file) return;
      setError(null);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.url) {
          // 新上傳的圖預設 transform = (0.5, 0.5, 1)
          const initial = setCropTransform(data.url, DEFAULT_TRANSFORM);
          setTransform(DEFAULT_TRANSFORM);
          onChange(initial);
          setPreview(initial);
        } else {
          setError(data.error || "上傳失敗");
          setPreview(value || null);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setError("網路錯誤,請再試一次");
        setPreview(value || null);
      } finally {
        setUploading(false);
      }
    },
    [onChange, folder, value, cropMode]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024, // 15MB
    disabled: cropMode,
    noClick: cropMode,
    noKeyboard: cropMode,
  });

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setCropMode(false);
    setTransform(DEFAULT_TRANSFORM);
    onChange("");
  }

  // ─── Pan(拖曳)邏輯 ─────────────────────────────────────
  // ox/oy 是「圖片上哪一點對齊框中央」(0~1),所以滑鼠右移 →
  // 想看到圖片右側(原本被裁掉的部分)→ 框中央對齊圖片更左側 → ox 變小
  function handlePointerDown(e: React.PointerEvent) {
    if (!cropMode) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startOx: transform.ox,
      startOy: transform.oy,
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!cropMode || !dragState.current) return;
    const container = containerRef.current;
    if (!container || !imgNatural) return;
    const rect = container.getBoundingClientRect();

    // 計算當前縮放下、圖片在容器內 cover 後的實際渲染尺寸
    const containerAspect = rect.width / rect.height;
    const imgAspect = imgNatural.w / imgNatural.h;
    const baseRender =
      imgAspect > containerAspect
        ? { w: rect.height * imgAspect, h: rect.height }
        : { w: rect.width, h: rect.width / imgAspect };
    const renderW = baseRender.w * transform.scale;
    const renderH = baseRender.h * transform.scale;

    // 滑鼠像素位移 → 圖片比例位移(滑鼠移 1px 等於 ox 位移 1/renderW)
    const dx = e.clientX - dragState.current.startClientX;
    const dy = e.clientY - dragState.current.startClientY;

    // 反向:滑鼠右拉 → 圖片內部視角左移 → ox 應該變小
    const newOx = dragState.current.startOx - dx / renderW;
    const newOy = dragState.current.startOy - dy / renderH;

    const next = clampTransform({
      ox: newOx,
      oy: newOy,
      scale: transform.scale,
    });
    setTransform(next);
    persistTransform(next);
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!cropMode) return;
    dragState.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }

  // ─── Zoom(滑桿)邏輯 ─────────────────────────────────────
  function handleScaleChange(newScale: number) {
    const next = clampTransform({
      ...transform,
      scale: newScale,
    });
    setTransform(next);
    persistTransform(next);
  }

  function handleResetTransform() {
    setTransform(DEFAULT_TRANSFORM);
    persistTransform(DEFAULT_TRANSFORM);
  }

  function persistTransform(t: CropTransform) {
    const cleanUrl = stripCropHash(value || preview || "");
    if (cleanUrl) {
      onChange(setCropTransform(cleanUrl, t));
    }
  }

  // ─── Render ─────────────────────────────────────
  // 計算 cover 模式下的 base scale,讓圖至少蓋滿容器
  const containerStyle: React.CSSProperties = {
    aspectRatio: aspectRatio.toString(),
  };

  // 圖片 transform CSS:translate 讓 (ox, oy) 點對齊容器中央
  // 公式:
  //   - cover 模式:圖片基底寬高已 fit 至容器,必有一邊等於容器
  //   - 我們把圖片絕對定位、寬高 100% 容器、object-fit: cover
  //   - 用 transform: scale(s) translate(...) 平移
  //   - translate 的單位用 %,但需要參考圖片本身的尺寸
  //   - 實作:用 CSS transform-origin: center,translate %值表示「圖片中心 → ox/oy 對齊容器中心」
  //
  // 數學:當 transform-origin 是 center,翻譯量(以圖片為參考):
  //   tx_pct = (0.5 - ox) * 100   // ox=0.5 → 0; ox=0 → +50% (圖片往右移,看左側)
  //   ty_pct = (0.5 - oy) * 100
  const tx = (0.5 - transform.ox) * 100;
  const ty = (0.5 - transform.oy) * 100;

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        {...(cropMode ? {} : getRootProps())}
        onPointerDown={cropMode ? handlePointerDown : undefined}
        onPointerMove={cropMode ? handlePointerMove : undefined}
        onPointerUp={cropMode ? handlePointerUp : undefined}
        onPointerCancel={cropMode ? handlePointerUp : undefined}
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 overflow-hidden bg-night/40
                   ${cropMode ? "border-gold cursor-grab active:cursor-grabbing" : "cursor-pointer"}
                   ${!cropMode && isDragActive ? "border-brand bg-brand/5" : "border-ivory/10 hover:border-ivory/20"}
                   ${preview ? "" : "py-8"}`}
        style={preview ? containerStyle : undefined}
      >
        {!cropMode && <input {...getInputProps()} />}

        {preview ? (
          <>
            {/* 圖片本體 — 絕對定位 + object-cover + transform 來模擬前台行為 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stripCropHash(preview)}
              alt="Preview"
              onLoad={(e) => {
                const t = e.currentTarget;
                setImgNatural({ w: t.naturalWidth, h: t.naturalHeight });
              }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{
                transform: `translate(${tx}%, ${ty}%) scale(${transform.scale})`,
                transformOrigin: "center center",
                transition: dragState.current ? "none" : "transform 0.1s ease-out",
              }}
              draggable={false}
            />

            {/* 裁切模式:中央格線參考 */}
            {cropMode && (
              <>
                <div className="absolute inset-0 pointer-events-none">
                  {/* 三分線 */}
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-ivory/20" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-ivory/20" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-ivory/20" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-ivory/20" />
                  {/* 邊框 */}
                  <div className="absolute inset-0 border border-gold/40" />
                </div>
                <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md bg-night/80 backdrop-blur-sm
                                text-[0.65rem] text-ivory/90 font-body uppercase tracking-wide pointer-events-none">
                  拖曳調整顯示位置 · 縮放 {Math.round(transform.scale * 100)}%
                </div>
              </>
            )}

            {/* 一般模式 hover 提示 */}
            {!cropMode && (
              <div
                className="absolute inset-0 bg-night/40 opacity-0 hover:opacity-100 transition-opacity
                           flex items-center justify-center pointer-events-none"
              >
                <p className="text-sm text-ivory font-body">點擊或拖拉替換圖片</p>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-night/60 flex items-center justify-center">
                <p className="text-sm text-gold font-body animate-pulse">上傳中...</p>
              </div>
            )}

            {/* 右上控制按鈕群 */}
            {!uploading && (
              <div className="absolute top-2 right-2 z-10 flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCropMode((m) => !m);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2.5 h-7 rounded-full text-[0.65rem] font-body uppercase tracking-wide
                             border transition-colors flex items-center gap-1
                             ${cropMode
                                ? "bg-gold/90 border-gold text-night"
                                : "bg-night/80 backdrop-blur-sm border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold/40"}`}
                  title={cropMode ? "完成調整" : "拖曳調整圖片位置"}
                >
                  {cropMode ? "✓ 完成" : "✥ 調整"}
                </button>
                {!cropMode && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-full bg-night/80 backdrop-blur-sm
                               border border-ivory/20 text-ivory/70 hover:text-rose-300 hover:border-rose-300/40
                               transition-colors flex items-center justify-center text-xs"
                    aria-label="移除圖片"
                    title="移除圖片"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-2xl mb-2">📷</p>
            <p className="text-sm text-ivory/30 font-body">
              {uploading ? "上傳中..." : "拖拉圖片或點擊上傳"}
            </p>
            <p className="text-[0.6rem] text-ivory/15 font-body mt-1">
              JPG / PNG / WebP · 最大 15MB
            </p>
          </div>
        )}
      </div>

      {/* 裁切模式控制列:縮放滑桿 + 重置 */}
      {cropMode && preview && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-ivory/5 border border-ivory/10">
          <span className="text-[0.65rem] text-ivory/40 font-body uppercase tracking-wide whitespace-nowrap">
            縮放
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={transform.scale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="flex-1 accent-gold"
          />
          <button
            type="button"
            onClick={handleResetTransform}
            className="px-2 h-6 rounded text-[0.65rem] font-body
                       text-ivory/50 border border-ivory/10 hover:text-ivory/80 hover:border-ivory/20
                       transition-colors"
          >
            重置
          </button>
        </div>
      )}

      {cropMode && preview && (
        <p className="text-[0.65rem] text-gold/80 font-body">
          ✦ 框內看到的就是前台顯示的樣子。在圖片上拖曳移動,用上方滑桿縮放。
        </p>
      )}

      {error && (
        <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>
      )}
    </div>
  );
}

function clampTransform(t: CropTransform): CropTransform {
  return {
    ox: Math.min(1, Math.max(0, t.ox)),
    oy: Math.min(1, Math.max(0, t.oy)),
    scale: Math.min(4, Math.max(1, t.scale)),
  };
}
