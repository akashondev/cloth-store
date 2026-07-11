import React from "react";
import { cn } from "../../lib/utils";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0D9488] focus:ring-2 focus:ring-teal-100",
        className,
      )}
      {...props}
    />
  );
}
