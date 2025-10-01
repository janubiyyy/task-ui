"use client";

import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
};

export default function Toast({
  open,
  onClose,
  message,
  type = "success",
  duration = 3000,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, onClose, duration]);

  if (!open) return null;

  const tone =
    type === "error"
      ? "bg-red-600"
      : type === "info"
      ? "bg-sky-600"
      : "bg-emerald-600";

  return (
    <div className="fixed right-4 top-4 z-50">
      <div
        className={`text-white shadow-lg rounded-lg px-4 py-3 ${tone} animate-slide-in`}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 180ms ease-out;
        }
      `}</style>
    </div>
  );
}
