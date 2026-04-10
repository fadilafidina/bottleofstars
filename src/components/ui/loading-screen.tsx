import { Card } from "./card";

export function LoadingScreen({
  eyebrow = "Loading",
  title = "Gathering your stars",
  body = "One moment while the bottle settles into place.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/80">{eyebrow}</p>
      <div className="mx-auto mt-6 h-12 w-12 animate-pulse rounded-full bg-[#e9f4fd] shadow-[0_0_30px_rgba(185,220,251,0.45)]" />
      <h1 className="mt-6 font-serif text-4xl text-[var(--color-ink)]">{title}</h1>
      <p className="mt-4 text-[var(--color-night)]">{body}</p>
    </Card>
  );
}
