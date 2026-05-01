"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageGalleryProps {
  /** 已上傳的圖片 URL 陣列;第一張會被前台當主圖 */
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  /** 上限張數,超過拒收 */
  max?: number;
}

/**
 * 多圖管理元件:
 * - 拖拉檔案到下方 dropzone 上傳(可多選)
 * - 縮圖列可拖拉重排,第一張即主圖
 * - 每張縮圖右上角 ✕ 移除單張
 * - 上傳走 /api/upload → Vercel Blob,返回的 URL 加到陣列
 */
export function ImageGallery({
  value,
  onChange,
  folder = "images",
  max = 8,
}: ImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>(value || []);

  // 父元件 value 變更(例如進入編輯模式)時 sync 到本地
  useEffect(() => {
    setItems(value || []);
  }, [value]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setError(null);

      const remaining = max - items.length;
      if (remaining <= 0) {
        setError(`最多只能上傳 ${max} 張`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remaining);
      setUploading(true);

      try {
        const uploadOne = async (file: File) => {
          const fd = new FormData();
          fd.append("file", file);
          fd.append("folder", folder);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          return data?.url as string | undefined;
        };

        // 並行上傳所有檔案
        const results = await Promise.all(filesToUpload.map(uploadOne));
        const okUrls = results.filter((u): u is string => Boolean(u));
        const next = [...items, ...okUrls];
        setItems(next);
        onChange(next);

        if (okUrls.length < filesToUpload.length) {
          setError(`有 ${filesToUpload.length - okUrls.length} 張上傳失敗`);
        }
      } catch (err) {
        console.error("Gallery upload failed:", err);
        setError("網路錯誤,請再試一次");
      } finally {
        setUploading(false);
      }
    },
    [items, max, folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  function handleRemove(url: string) {
    const next = items.filter((u) => u !== url);
    setItems(next);
    onChange(next);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={horizontalListSortingStrategy}>
            <div className="grid grid-cols-4 gap-2">
              {items.map((url, i) => (
                <SortableThumb key={url} url={url} isPrimary={i === 0} onRemove={handleRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed cursor-pointer
                   transition-all duration-200 py-6
                   ${isDragActive ? "border-brand bg-brand/5" : "border-ivory/10 hover:border-ivory/20"}`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="text-xl mb-1">📷</p>
          <p className="text-xs text-ivory/30 font-body">
            {uploading
              ? "上傳中..."
              : items.length >= max
              ? `已達上限 ${max} 張`
              : `拖拉圖片或點擊上傳(可多選)· 已 ${items.length}/${max}`}
          </p>
        </div>
      </div>

      {items.length > 1 && (
        <p className="text-[0.65rem] text-ivory/30 font-body">
          ↻ 第 1 張為主圖。拖拉縮圖可重排順序。
        </p>
      )}

      {error && (
        <p className="text-[0.7rem] text-rose-300 font-body">{error}</p>
      )}
    </div>
  );
}

function SortableThumb({
  url,
  isPrimary,
  onRemove,
}: {
  url: string;
  isPrimary: boolean;
  onRemove: (url: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-square rounded-md overflow-hidden border border-ivory/10
                 bg-ivory/5 cursor-grab active:cursor-grabbing group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />
      {isPrimary && (
        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wide
                         bg-brand/90 text-ivory rounded font-body">
          主圖
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(url);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-night/80 backdrop-blur-sm
                   border border-ivory/20 text-ivory/70 hover:text-rose-300 hover:border-rose-300/40
                   transition-colors flex items-center justify-center text-[0.6rem]"
        aria-label="移除這張"
        title="移除這張"
      >
        ✕
      </button>
    </div>
  );
}
