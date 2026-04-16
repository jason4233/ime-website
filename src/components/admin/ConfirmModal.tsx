"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({ open, title, message, confirmText = "確認刪除", onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-night/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-sm bg-[#111] border border-ivory/8 rounded-xl p-6"
          >
            <h3 className="font-serif-tc text-lg text-ivory font-medium mb-2">{title}</h3>
            <p className="font-sans-tc text-caption text-ivory/40 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-body text-ivory/40 border border-ivory/10 rounded
                           hover:bg-ivory/5 transition-colors
                           focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ivory/30"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-body text-ivory bg-rose-nude/80 rounded
                           hover:bg-rose-nude transition-colors disabled:opacity-50
                           focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-nude/40"
              >
                {loading ? "刪除中..." : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
