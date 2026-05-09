"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Action = { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string };

function reducer(state: Toast[], action: Action): Toast[] {
  if (action.type === "ADD") return [...state, action.toast];
  if (action.type === "REMOVE") return state.filter((t) => t.id !== action.id);
  return state;
}

const ToastContext = createContext<
  ((msg: string, type?: ToastType) => void) | null
>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: "ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE", id }), 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl border pointer-events-auto ${
                t.type === "error"
                  ? "bg-[#111827] border-red-900/50 text-red-400"
                  : t.type === "info"
                    ? "bg-[#111827] border-[#1f2937] text-[#6366f1]"
                    : "bg-[#111827] border-[#1f2937] text-emerald-400"
              }`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
