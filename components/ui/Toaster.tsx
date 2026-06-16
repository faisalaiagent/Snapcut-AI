"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple global toast store
let addToastFn: ((toast: Omit<Toast, "id">) => void) | null = null;

export function toast(message: string, type: ToastType = "info") {
  addToastFn?.({ message, type });
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToastFn = (t) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-xl shadow-card text-[14px] font-medium animate-slide-up",
            t.type === "success" && "bg-accent-light border border-[#b3dcc9] text-accent-2",
            t.type === "error"   && "bg-red-50 border border-red-200 text-red-700",
            t.type === "info"    && "bg-white border border-surface-3 text-ink"
          )}
        >
          {t.type === "success" && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          {t.type === "error"   && <AlertCircle  className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          {t.type === "info"    && <Info          className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-current opacity-50 hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
