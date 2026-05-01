"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  parseFocalPoint,
  setFocalPoint,
  stripFocalPoint,
  focalToObjectPosition,
  type FocalPoint,
} from "@/lib/utils/focal-point";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

/**
 * 單張圖片上傳元件 — 支援拖拉上傳 + 焦點(focal point)拖曳設定。
 *
 * 焦點機制:在預覽圖右下角點「📍 焦點」進入焦點模式,即可在圖片上拖曳
 * 一個十字標記指定「視覺重心」。前台用 object-position 套用,確保任何
 * 切圖比例都不會把主體切掉。座標編進 URL hash(#focal=x,y),不需動 DB。
 */
export function ImageUpload({ value, onChange, folder = "images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [focalMode, setFocalMode] = useState(false);
  const [focal, setFocal] = useState<FocalPoint>(
    () => parseFocalPoint(value) ?? { x: 0.5, y: 0.5 }
  );
  const previewRef = useRef<HTMLDivElement>(null);

  // 編輯既有紀錄時 sync preview + focal
  useEffect(() => {
    if (value) {
      setPreview(value);
      const parsed = parseFocalPoint(value);
      if (parsed) setFocal(parsed);
    }
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (focalMode) return; // 焦點模式不接受拖檔上傳
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
          // 新上傳的圖預設焦點 50/50
          const initial = setFocalPoint(data.url, 0.5, 0.5);
          setFocal({ x: 0.5, y: 0.5 });
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
    [onChange, folder, value, focalMode]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024, // 15MB
    disabled: focalMode, // 焦點模式時禁用整個 dropzone
    noClick: focalMode,
    noKeyboard: focalMode,
  });

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setFocalMode(false);
    setFocal({ x: 0.5, y: 0.5 });
    onChange("");
  }

  // ── 焦點拖曳邏輯 ──────────────────────────────────────────
  function updateFocalFromEvent(clientX: number, clientY: number) {
    const el = previewRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const next = {
      x: Math.min(1, Math.max(0, x)),
      y: Math.min(1, Math.max(0, y)),
    };
    setFocal(next);
    // 寫回 URL,把 hash 部分換掉
    const cleanUrl = stripFocalPoint(value || preview || "");
    if (cleanUrl) {
      onChange(setFocalPoint(cleanUrl, next.x, next.y));
    }
  }

  function handleFocalPointerDown(e: React.PointerEvent) {
    if (!focalMode) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFocalFromEvent(e.clientX, e.clientY);
  }

  function handleFocalPointerMove(e: React.PointerEvent) {
    if (!focalMode) return;
    if (e.buttons === 0) return; // 沒按住不更新
    updateFocalFromEvent(e.clientX, e.clientY);
  }

  // ── render ────────────────────────────────────────────
  const isFocalSet = parseFocalPoint(value) !== null;

  return (
    <div className="space-y-2">
      <div
        ref={previewRef}
        {...(focalMode ? {} : getRootProps())}
        onPointerDown={focalMode ? handleFocalPointerDown : undefined}
        onPointerMove={focalMode ? handleFocalPointerMove : undefined}
        className={`relative rounded-lg border-2 border-dashed transition-all duration-200 overflow-hidden
                   ${focalMode ? "border-gold cursor-crosshair" : "cursor-pointer"}
                   ${!focalMode && isDragActive ? "border-brand bg-brand/5" : "border-ivory/10 hover:border-ivory/20"}
                   ${preview ? "aspect-video" : "py-8"}`}
      >
        {!focalMode && <input {...getInputProps()} />}

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stripFocalPoint(preview)}
              alt="Preview"
              className="w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: focalToObjectPosition(focal) }}
              draggable={false}
            />

            {/* 焦點模式:十字標記 */}
            {focalMode && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${focal.x * 100}%`,
                  top: `${focal.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* 外環 */}
                <div className="w-10 h-10 rounded-full border-2 border-gold bg-gold/20
                                shadow-[0_0_0_2px_rgba(0,0,0,0.5),0_0_20px_rgba(202,138,4,0.6)]
                                flex items-center justify-center">
                  {/* 內點 */}
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                {/* 十字水平線 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-gold/60" />
                {/* 十字垂直線 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12 bg-gold/60" />
              </div>
            )}

            {/* 焦點模式提示 */}
            {focalMode && (
              <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md bg-night/80 backdrop-blur-sm
                              text-[0.65rem] text-ivory/90 font-body uppercase tracking-wide">
                點擊 / 拖曳設定焦點 · {(focal.x * 100).toFixed(0)}, {(focal.y * 100).toFixed(0)}
              </div>
            )}

            {/* 一般模式 hover 提示 */}
            {!focalMode && (
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

            {/* 右上控制按鈕群:焦點切換 + 移除 */}
            {!uploading && (
              <div className="absolute top-2 right-2 z-10 flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocalMode((m) => !m);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2.5 h-7 rounded-full text-[0.65rem] font-body uppercase tracking-wide
                             border transition-colors flex items-center gap-1
                             ${focalMode
                                ? "bg-gold/90 border-gold text-night"
                                : "bg-night/80 backdrop-blur-sm border-ivory/20 text-ivory/70 hover:text-gold hover:border-gold/40"}`}
                  title={focalMode ? "完成設定焦點" : "拖曳調整顯示焦點"}
                >
                  📍 {focalMode ? "完成" : isFocalSet ? "焦點" : "設定焦點"}
                </button>
                {!focalMode && (
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

      {focalMode && preview && (
        <p className="text-[0.65rem] text-gold/80 font-body">
          ✦ 焦點模式:在圖片上點擊或拖曳,設定「永遠不會被裁切的視覺中心」(例如人臉、產品瓶身)。前台會以這個點為中心,自動裁切成需要的比例。
        </p>
      )}

      {error && (
        <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>
      )}
    </div>
  );
}
