import { Link } from "react-router-dom";

import { buttonVariants } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-lg text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-night)]/80">
          Lost at sea
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">Page not found</h1>
        <p className="mt-4 text-[var(--color-night)]">
          This route is not part of the bottle yet.
        </p>
        <Link className={`${buttonVariants()} mt-8`} to="/">
          Back home
        </Link>
      </Card>
    </main>
  );
}
