import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        variant === "primary" && "bg-primary text-white hover:bg-primary-dark",
        variant === "secondary" && "bg-secondary-blue text-gray-900 hover:opacity-90",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}
