"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 即時預覽
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      // 上傳到 API route（由 server 處理 Supabase upload）
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }, [onChange, folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
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
          <div className="absolute inset-0 bg-night/40 opacity-0 hover:opacity-100 transition-opacity
                         flex items-center justify-center">
            <p className="text-sm text-ivory font-body">點擊或拖拉替換圖片</p>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-night/60 flex items-center justify-center">
              <p className="text-sm text-gold font-body animate-pulse">上傳中...</p>
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
            JPG / PNG / WebP · 最大 5MB
          </p>
        </div>
      )}
    </div>
  );
}
