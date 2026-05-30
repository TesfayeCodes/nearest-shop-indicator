import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-semibold border-none cursor-pointer transition-all duration-200 rounded-xl",
          {
            "bg-gradient-to-r from-blue to-blue-dark text-white shadow-lg shadow-blue/30 hover:shadow-blue/45 hover:-translate-y-0.5":
              variant === "primary",
            "bg-surface2 border border-border2 text-text hover:bg-white/10":
              variant === "secondary",
            "bg-transparent text-text2 hover:text-text hover:bg-white/5":
              variant === "ghost",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-5 py-3 text-sm": size === "md",
            "px-7 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
