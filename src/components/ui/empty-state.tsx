import type { PropsWithChildren } from "react";

import { Card } from "./card";

export function EmptyState({
  eyebrow,
  title,
  body,
  children,
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  body: string;
}>) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/80">{eyebrow}</p>
      <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">{title}</h1>
      <p className="mt-4 text-[var(--color-night)]">{body}</p>
      {children ? <div className="mt-8">{children}</div> : null}
    </Card>
  );
}
