import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className = "", ...props }) {
  return <table className={cn("w-full text-sm", className)} {...props} />;
}

export function Th({ className = "", ...props }) {
  return (
    <th
      className={cn("border-b bg-zinc-50 px-4 py-3 text-left font-semibold text-zinc-600", className)}
      {...props}
    />
  );
}

export function Td({ className = "", ...props }) {
  return <td className={cn("border-b border-zinc-100 px-4 py-3", className)} {...props} />;
}
