import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cn("rounded-lg border border-zinc-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold text-zinc-950", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}
