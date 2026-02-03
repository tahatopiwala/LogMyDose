import { type HTMLAttributes } from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-surface-elevated text-gray-200": variant === "default",
          "bg-green-900/40 text-green-400": variant === "success",
          "bg-amber-900/40 text-amber-400": variant === "warning",
          "bg-red-900/40 text-red-400": variant === "error",
          "bg-blue-900/40 text-blue-400": variant === "info",
        },
        className,
      )}
      {...props}
    />
  );
}
