"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  // 編輯既有紀錄時,父元件晚一拍把 value 推下來,要把 preview 同步
  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setError(null);

      // 即時預覽 — DataURL 先顯示,等真正上傳完再用 server URL 取代
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
          onChange(data.url);
          setPreview(data.url); // 換成 server 上的真正 URL
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
    [onChange, folder, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024, // 15MB
  });

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    onChange("");
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed cursor-pointer
                   transition-all duration-200 overflow-hidden
                   ${isDragActive ? "border-brand bg-brand/5" : "border-ivory/10 hover:border-ivory/20"}
                   ${preview ? "aspect-video" : "py-8"}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div
              className="absolute inset-0 bg-night/40 opacity-0 hover:opacity-100 transition-opacity
                         flex items-center justify-center"
            >
              <p className="text-sm text-ivory font-body">點擊或拖拉替換圖片</p>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-night/60 flex items-center justify-center">
                <p className="text-sm text-gold font-body animate-pulse">上傳中...</p>
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-night/80 backdrop-blur-sm
                           border border-ivory/20 text-ivory/70 hover:text-rose-300 hover:border-rose-300/40
                           transition-colors flex items-center justify-center text-xs"
                aria-label="移除圖片"
                title="移除圖片"
              >
                ✕
              </button>
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
      {error && (
        <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>
      )}
    </div>
  );
}
