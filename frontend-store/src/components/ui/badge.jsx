import React from "react";
import { cn } from "../../lib/utils";

const tones = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  dark: "bg-zinc-950 text-white border-zinc-950",
  gray: "bg-zinc-100 text-zinc-700 border-zinc-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function Badge({ tone = "gray", className = "", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
