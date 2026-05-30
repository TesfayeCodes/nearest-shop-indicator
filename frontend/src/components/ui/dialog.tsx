"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { IconX } from "@tabler/icons-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className={clsx(
          "w-full max-w-md rounded-2xl border border-border2 p-6",
          "bg-bg2 shadow-2xl",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text2 hover:text-text hover:bg-white/5 transition-colors"
            >
              <IconX size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
