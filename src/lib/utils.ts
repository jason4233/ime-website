/**
 * cn — 合併 class names，符合 shadcn/ui 慣例
 * clsx 處理條件式 class，twMerge 解決 Tailwind class 衝突（後者覆蓋前者）
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
