import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2 text-sm font-medium backdrop-blur-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        "border active:scale-[0.98]",
        variant === "primary" &&
          "border-primary-light/30 bg-primary/80 text-white shadow-glow-primary hover:bg-primary",
        variant === "secondary" &&
          "border-white/15 bg-white/[0.08] text-gray-100 hover:bg-white/[0.14]",
        variant === "danger" &&
          "border-danger/30 bg-danger/80 text-white hover:bg-danger",
        variant === "ghost" &&
          "border-transparent bg-transparent text-gray-300 hover:border-white/10 hover:bg-white/[0.06]",
        className
      )}
      {...props}
    />
  );
}
