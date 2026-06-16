"use client";

import { createContext, useCallback, useContext, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconCheck, IconAlertTriangle, IconInfoCircle, IconX } from "@tabler/icons-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <IconCheck size={16} />,
    error: <IconAlertTriangle size={16} />,
    info: <IconInfoCircle size={16} />,
  };

  const colors: Record<ToastType, { bg: string; border: string; text: string }> = {
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#34d399" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#fca5a5" },
    info: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", text: "#60a5fa" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[600] flex flex-col gap-2.5 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const c = colors[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium max-w-[340px]"
                style={{
                  background: "rgba(11,17,32,0.95)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${c.border}`,
                  boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
                }}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.bg, color: c.text }}>
                  {icons[t.type]}
                </span>
                <span className="text-text flex-1">{t.message}</span>
                <button onClick={() => dismiss(t.id)} className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center bg-transparent border-none cursor-pointer text-text3 hover:text-text transition-colors">
                  <IconX size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
