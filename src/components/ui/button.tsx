import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "secondary";
  }
>;

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--color-sky)] text-[var(--color-ink)] shadow-[0_14px_34px_rgba(185,220,251,0.55)] hover:bg-[#c8e4fc]",
  secondary:
    "bg-white/85 text-[var(--color-ink)] ring-1 ring-[#d8e7f3] hover:bg-white",
  ghost: "bg-transparent text-[var(--color-night)] hover:bg-white/60 hover:text-[var(--color-ink)]",
};

export function buttonVariants(
  variant: NonNullable<ButtonProps["variant"]> = "primary",
) {
  return cn(
    "inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sky)] disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
  );
}

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants(variant), className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
