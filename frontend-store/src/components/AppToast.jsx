import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

const tones = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  error: "border-red-200 bg-red-50 text-red-950",
  info: "border-teal-200 bg-teal-50 text-teal-950",
};

function AppToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    const showToast = (event) => {
      clearTimeout(timer.current);
      setToast({ tone: "info", ...event.detail });
      timer.current = setTimeout(() => setToast(null), event.detail?.duration || 3000);
    };
    window.addEventListener("appToast", showToast);
    return () => {
      window.removeEventListener("appToast", showToast);
      clearTimeout(timer.current);
    };
  }, []);

  if (!toast) return null;
  const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? TriangleAlert : Info;

  return (
    <div role="status" aria-live="polite" className={`fixed right-5 top-20 z-[100] flex w-[min(22rem,calc(100vw-2.5rem))] items-start gap-3 rounded-lg border p-4 shadow-2xl ${tones[toast.tone] || tones.info}`}>
      <Icon className="mt-0.5 shrink-0" size={19} />
      <div className="min-w-0 flex-1"><p className="text-sm font-bold">{toast.title}</p>{toast.message && <p className="mt-0.5 truncate text-xs opacity-75">{toast.message}</p>}</div>
      <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)} className="rounded p-1 hover:bg-black/5"><X size={16}/></button>
    </div>
  );
}

export default AppToast;
