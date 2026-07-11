import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-[#0D9488] text-white hover:bg-[#0a7a6f]",
  dark: "bg-black text-white hover:bg-zinc-800",
  outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100",
  ghost: "text-zinc-700 hover:bg-zinc-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Button({
  className = "",
  variant = "default",
  size = "md",
  type = "button",
  ...props
}) {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
