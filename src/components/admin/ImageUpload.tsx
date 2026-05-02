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
// 框佔容器寬的比例,留 15% padding 讓使用者看到框外被裁掉的部分
const FRAME_RATIO_OF_CONTAINER = 0.78;

/**
 * Instagram 式拖曳裁切上傳元件 v3
 *
 * 關鍵 UX 改動:
 * - 預覽容器「比框大」,周圍 padding 讓使用者看見「會被裁掉的圖部分」
 * - 中央透明框 + 框外半透明遮罩(看得到但 dim)
 * - 拖曳整張圖在容器中移動 → 想要的部分進入框內
 * - 圖檔本身**完整保存在 Vercel Blob**,只儲存 (ox, oy, scale) 變形參數
 * - 前台 render 時用同樣 transform,WYSIWYG
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
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startClientX: number;
    startClientY: number;
    startOx: number;
    startOy: number;
  } | null>(null);

  // sync value → preview + transform
  useEffect(() => {
    if (value) {
      setPreview(value);
      const parsed = parseCropTransform(value);
      if (parsed) setTransform(parsed);
    }
  }, [value]);

  // 觀測 container 寬度(響應式)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        // 容器高度由「框高 / FRAME_RATIO_OF_CONTAINER」算
        const frameW = w * FRAME_RATIO_OF_CONTAINER;
        const frameH = frameW / aspectRatio;
        const h = frameH / FRAME_RATIO_OF_CONTAINER;
        setContainerSize({ w, h });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [aspectRatio]);

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
    maxSize: 15 * 1024 * 1024,
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

  // ─── 拖曳邏輯 ─────────────────────────────────────
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
    if (!cropMode || !dragState.current || !containerSize || !imgNatural) return;

    // 框 size
    const frameW = containerSize.w * FRAME_RATIO_OF_CONTAINER;
    const frameH = frameW / aspectRatio;

    // 圖片 base size(scale=1 時剛好 cover 框)
    const imgAspect = imgNatural.w / imgNatural.h;
    const baseW = imgAspect > aspectRatio ? frameH * imgAspect : frameW;
    const baseH = imgAspect > aspectRatio ? frameH : frameW / imgAspect;
    const renderW = baseW * transform.scale;
    const renderH = baseH * transform.scale;

    // 滑鼠位移 → 圖內部位移比例
    const dx = e.clientX - dragState.current.startClientX;
    const dy = e.clientY - dragState.current.startClientY;
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
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }

  function handleScaleChange(s: number) {
    const next = clampTransform({ ...transform, scale: s });
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

  // ─── 計算 render layout(裁切模式下) ─────────────────
  // 思路:
  // 1. 容器 (containerSize):比框大,周圍 padding 顯示框外的圖
  // 2. 框 (frame):中央,aspect = aspectRatio
  // 3. 圖片:絕對定位,base size 用 cover-frame 計算
  // 4. 透過 transform translate 把圖中 (ox, oy) 點對齊框中央
  let imgStyle: React.CSSProperties = { display: "none" };
  let frameStyle: React.CSSProperties = {};
  if (containerSize && imgNatural && preview) {
    const frameW = containerSize.w * FRAME_RATIO_OF_CONTAINER;
    const frameH = frameW / aspectRatio;
    const imgAspect = imgNatural.w / imgNatural.h;
    const baseW = imgAspect > aspectRatio ? frameH * imgAspect : frameW;
    const baseH = imgAspect > aspectRatio ? frameH : frameW / imgAspect;
    const renderW = baseW * transform.scale;
    const renderH = baseH * transform.scale;

    // 圖中心位置:框中央 + ((0.5 - ox) × renderW, (0.5 - oy) × renderH)
    const frameCenterX = containerSize.w / 2;
    const frameCenterY = containerSize.h / 2;
    const imgCenterX = frameCenterX + (0.5 - transform.ox) * renderW;
    const imgCenterY = frameCenterY + (0.5 - transform.oy) * renderH;

    imgStyle = {
      position: "absolute",
      width: renderW,
      height: renderH,
      left: imgCenterX - renderW / 2,
      top: imgCenterY - renderH / 2,
      transition: dragState.current ? "none" : "all 0.1s ease-out",
      pointerEvents: "none",
      userSelect: "none",
    };

    frameStyle = {
      position: "absolute",
      left: frameCenterX - frameW / 2,
      top: frameCenterY - frameH / 2,
      width: frameW,
      height: frameH,
    };
  }

  // ─── Render ─────────────────────────────────────
  if (!preview) {
    // 空狀態 — 跟舊版一樣的上傳 dropzone
    return (
      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={`relative rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 py-12
                     ${isDragActive ? "border-brand bg-brand/5" : "border-ivory/10 hover:border-ivory/20"}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <p className="text-2xl mb-2">📷</p>
            <p className="text-sm text-ivory/30 font-body">
              {uploading ? "上傳中..." : "拖拉圖片或點擊上傳"}
            </p>
            <p className="text-[0.6rem] text-ivory/15 font-body mt-1">
              JPG / PNG / WebP · 最大 15MB
            </p>
          </div>
        </div>
        {error && <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        {...(cropMode ? {} : getRootProps())}
        onPointerDown={cropMode ? handlePointerDown : undefined}
        onPointerMove={cropMode ? handlePointerMove : undefined}
        onPointerUp={cropMode ? handlePointerUp : undefined}
        onPointerCancel={cropMode ? handlePointerUp : undefined}
        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 bg-night
                   ${cropMode ? "border-gold cursor-grab active:cursor-grabbing" : "border-ivory/10 hover:border-ivory/20 cursor-pointer"}
                   ${!cropMode && isDragActive ? "border-brand bg-brand/5" : ""}`}
        style={{
          aspectRatio: containerSize ? `${containerSize.w} / ${containerSize.h}` : `${aspectRatio}`,
        }}
      >
        {!cropMode && <input {...getInputProps()} />}

        {/* 圖片本體 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stripCropHash(preview)}
          alt="Preview"
          onLoad={(e) => {
            const t = e.currentTarget;
            setImgNatural({ w: t.naturalWidth, h: t.naturalHeight });
          }}
          style={cropMode ? imgStyle : {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${(transform.ox * 100).toFixed(1)}% ${(transform.oy * 100).toFixed(1)}%`,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />

        {/* 裁切模式:中央框 + 4 片半透明遮罩 */}
        {cropMode && containerSize && (
          <>
            {/* 4 個遮罩(top/bottom/left/right) */}
            <div className="absolute pointer-events-none bg-night/65" style={{
              left: 0, right: 0, top: 0, height: frameStyle.top as number
            }} />
            <div className="absolute pointer-events-none bg-night/65" style={{
              left: 0, right: 0,
              top: (frameStyle.top as number) + (frameStyle.height as number),
              bottom: 0
            }} />
            <div className="absolute pointer-events-none bg-night/65" style={{
              left: 0, width: frameStyle.left as number,
              top: frameStyle.top, height: frameStyle.height
            }} />
            <div className="absolute pointer-events-none bg-night/65" style={{
              left: (frameStyle.left as number) + (frameStyle.width as number),
              right: 0,
              top: frameStyle.top, height: frameStyle.height
            }} />

            {/* 框邊框 + 三分線 */}
            <div className="absolute pointer-events-none border-2 border-gold shadow-[0_0_12px_rgba(202,138,4,0.4)]" style={frameStyle}>
              <div className="absolute top-1/3 left-0 right-0 h-px bg-ivory/20" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-ivory/20" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-ivory/20" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-ivory/20" />
            </div>

            {/* 提示 */}
            <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md bg-night/90 backdrop-blur-sm
                            text-[0.65rem] text-ivory/90 font-body uppercase tracking-wide pointer-events-none">
              拖曳圖片調整位置 · 縮放 {Math.round(transform.scale * 100)}%
            </div>
          </>
        )}

        {/* 一般模式 hover 提示 */}
        {!cropMode && (
          <div className="absolute inset-0 bg-night/40 opacity-0 hover:opacity-100 transition-opacity
                         flex items-center justify-center pointer-events-none">
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
              onClick={(e) => { e.stopPropagation(); setCropMode((m) => !m); }}
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
      </div>

      {/* 裁切控制列 */}
      {cropMode && (
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

      {cropMode && (
        <p className="text-[0.65rem] text-gold/80 font-body">
          ✦ 金框內就是前台會顯示的範圍。完整圖檔已保留在伺服器,只是調整顯示時的裁切位置。
        </p>
      )}

      {error && <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>}
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
