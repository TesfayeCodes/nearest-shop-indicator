import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-text2">{label}</label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full bg-surface2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 font-inherit placeholder:text-text3",
            "focus:border-blue/40 focus:ring-1 focus:ring-blue/20",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] text-red-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
