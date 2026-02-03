import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary-500 text-surface-base hover:bg-primary-400 shadow-glow-sm shadow-primary-500/25":
              variant === "primary",
            "bg-surface-elevated text-gray-100 hover:bg-surface-hover":
              variant === "secondary",
            "border border-surface-border bg-surface-card text-gray-200 hover:bg-surface-hover":
              variant === "outline",
            "text-gray-200 hover:bg-surface-hover": variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm rounded-md": size === "sm",
            "px-4 py-2 text-sm rounded-lg": size === "md",
            "px-6 py-3 text-base rounded-xl": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
