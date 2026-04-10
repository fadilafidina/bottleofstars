import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[#dfeaf2] bg-[rgba(255,253,249,0.78)] p-6 shadow-[0_24px_80px_rgba(164,184,204,0.18)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
