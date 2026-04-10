import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { createBottle, fetchAdminBottles, slugify } from "../lib/api";

import type { Bottle } from "../types/bottle";

const adminSchema = z.object({
  title: z.string().min(1, "Title is required."),
  recipientNames: z.string().min(1, "Recipients are required."),
  occasionType: z.string().optional(),
  slug: z.string().optional(),
});

type AdminValues = z.infer<typeof adminSchema>;

export function AdminPage() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<AdminValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      title: "",
      recipientNames: "",
      occasionType: "",
      slug: "",
    },
  });

  useEffect(() => {
    fetchAdminBottles()
      .then(({ bottles: nextBottles }) => setBottles(nextBottles))
      .finally(() => setIsLoading(false));
  }, []);

  const watchedTitle = form.watch("title");
  const generatedSlug = useMemo(() => slugify(watchedTitle || ""), [watchedTitle]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const { bottle } = await createBottle({
        title: values.title,
        recipientNames: values.recipientNames,
        occasionType: values.occasionType,
        slug: values.slug || generatedSlug,
      });

      setBottles((current) => [bottle, ...current]);
      form.reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create this bottle.",
      );
    }
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <div className="space-y-6">
        <Card className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/75">
              Admin MVP
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">
              Create a new bottle
            </h1>
            <p className="mt-4 max-w-md text-[var(--color-night)]">
              Create bottles, generate access links, and keep an eye on how many
              stars have arrived so far.
            </p>
          </div>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <input
              className="h-12 rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
              placeholder="Bottle title"
              type="text"
              {...form.register("title")}
            />
            <input
              className="h-12 rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
              placeholder="Recipients"
              type="text"
              {...form.register("recipientNames")}
            />
            <input
              className="h-12 rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
              placeholder="Occasion"
              type="text"
              {...form.register("occasionType")}
            />
            <input
              className="h-12 rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
              placeholder={generatedSlug || "Slug"}
              type="text"
              {...form.register("slug")}
            />
            {submitError ? (
              <p className="sm:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {submitError}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <Button className="w-full">Generate links</Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          {isLoading ? (
            <Card className="text-[var(--color-night)]">Loading bottles...</Card>
          ) : null}
          {bottles.map((row) => (
            <Card
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
              key={row.id}
            >
              <div>
                <h2 className="font-serif text-2xl text-[var(--color-ink)]">{row.title}</h2>
                <p className="mt-2 text-sm text-[var(--color-night)]">
                  {row.messageCount ?? 0} stars · {row.recipientNames}
                </p>
              </div>
              <div className="space-y-2 text-sm text-[var(--color-night)]">
                <p>
                  Guest: /bottle/{row.slug}/add?token={row.guestToken ?? "guest_token"}
                </p>
                <p>
                  Viewer: /bottle/{row.slug}/view?token={row.viewToken ?? "view_token"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
