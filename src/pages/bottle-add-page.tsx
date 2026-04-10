import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { LoadingScreen } from "../components/ui/loading-screen";
import { EmptyState } from "../components/ui/empty-state";
import { createMessage } from "../lib/api";
import { maxStickersPerMessage, stickerOptions } from "../lib/stickers";
import { maskToken, getTokenFromSearch } from "../lib/tokens";
import { useBottle } from "../hooks/use-bottle";

const submissionSchema = z.object({
  senderName: z.string().max(80).optional(),
  message: z
    .string()
    .min(1, "A message is required.")
    .max(1200, "Keep it to 1200 characters or fewer."),
});

type SubmissionValues = z.infer<typeof submissionSchema>;

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read photo."));
    reader.readAsDataURL(file);
  });
}

export function BottleAddPage() {
  const { slug } = useParams();
  const location = useLocation();
  const token = useMemo(() => getTokenFromSearch(location.search), [location.search]);
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { bottle, error, isLoading } = useBottle(slug, token, "guest");
  const form = useForm<SubmissionValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      senderName: "",
      message: "",
    },
  });

  const toggleSticker = (id: string) => {
    setSelectedStickers((current) => {
      if (current.includes(id)) {
        return current.filter((value) => value !== id);
      }

      if (current.length >= maxStickersPerMessage) {
        return current;
      }

      return [...current, id];
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!bottle || !token) {
      return;
    }

    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      const photoDataUrl = selectedPhoto ? await fileToDataUrl(selectedPhoto) : undefined;

      await createMessage({
        bottleId: bottle.id,
        token,
        name: values.senderName,
        message: values.message,
        stickers: selectedStickers,
        photoDataUrl,
        photoFileName: selectedPhoto?.name,
        photoMimeType: selectedPhoto?.type,
      });

      form.reset();
      setSelectedStickers([]);
      setSelectedPhoto(null);
      setSubmitState("success");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : "Unable to place this star in the bottle.",
      );
      setSubmitState("idle");
    }
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center px-6">
        <LoadingScreen
          eyebrow="Guest entry"
          title="Opening the bottle"
          body="We’re checking the guest link and getting the star form ready."
        />
      </main>
    );
  }

  if (error || !bottle) {
    return (
      <main className="flex min-h-screen items-center px-6">
        <EmptyState
          body={error ?? "This guest link could not be opened."}
          eyebrow="Guest access"
          title="That bottle link is not ready"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/75">
              Guest submission
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">
              Add your star for {bottle.recipientNames}
            </h1>
            <p className="mt-4 max-w-md text-[var(--color-night)]">
              {bottle.title} is ready for messages. Leave something sweet,
              funny, honest, or quietly unforgettable.
            </p>
          </div>

          <div className="space-y-3 text-sm text-[var(--color-night)]">
            <p>
              Bottle slug: <span className="text-[var(--color-ink)]">{bottle.slug}</span>
            </p>
            <p>
              Guest token: <span className="text-[var(--color-ink)]">{maskToken(token)}</span>
            </p>
            <p>
              Occasion:{" "}
              <span className="text-[var(--color-ink)]">{bottle.occasionType ?? "A special moment"}</span>
            </p>
          </div>
        </Card>

        <Card>
          {submitState === "success" ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 text-center"
              initial={{ opacity: 0, y: 20 }}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/12 shadow-[0_0_50px_rgba(199,228,255,0.35)]">
                <span className="text-4xl">✦</span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/80">
                  Star delivered
                </p>
                <h2 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">
                  Your star is in the bottle
                </h2>
                <p className="mt-4 text-[var(--color-night)]">
                  Thank you for adding a little light to {bottle.recipientNames}.
                </p>
              </div>
              <Button className="w-full" onClick={() => setSubmitState("idle")}>
                Add another star
              </Button>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-night)]" htmlFor="senderName">
                Your name
              </label>
              <input
                className="h-12 w-full rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0] focus:border-[var(--color-sky)]"
                id="senderName"
                placeholder="Optional"
                type="text"
                {...form.register("senderName")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[var(--color-night)]" htmlFor="message">
                Message
              </label>
              <textarea
                className="min-h-36 w-full rounded-[1.5rem] border border-[#dae7f3] bg-white/80 px-4 py-3 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0] focus:border-[var(--color-sky)]"
                id="message"
                placeholder="Write something kind, silly, tender, or unforgettable."
                {...form.register("message")}
              />
              {form.formState.errors.message ? (
                <p className="text-sm text-amber-100">
                  {form.formState.errors.message.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-[var(--color-night)]">Stickers</label>
                <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-night)]/70">
                  {selectedStickers.length}/{maxStickersPerMessage}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {stickerOptions.map((sticker) => {
                  const isSelected = selectedStickers.includes(sticker.id);

                  return (
                    <button
                      className={`rounded-[1.4rem] border px-3 py-4 text-center transition ${
                        isSelected
                          ? "border-[var(--color-sky)] bg-[#eff7fe] text-[var(--color-ink)]"
                          : "border-[#dae7f3] bg-white/72 text-[var(--color-night)] hover:bg-[#f7fbff]"
                      }`}
                      key={sticker.id}
                      onClick={() => toggleSticker(sticker.id)}
                      type="button"
                    >
                      <span className="block text-lg">{sticker.icon}</span>
                      <span className="mt-2 block text-xs">{sticker.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[var(--color-night)]" htmlFor="photo">
                Photo
              </label>
              <input
                className="block w-full rounded-2xl border border-dashed border-[#d7e6f2] bg-white/72 px-4 py-4 text-sm text-[var(--color-night)] file:mr-3 file:rounded-full file:border-0 file:bg-[#e8f4fe] file:px-4 file:py-2 file:text-sm file:text-[var(--color-ink)]"
                id="photo"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedPhoto(file);
                }}
                type="file"
              />
              {selectedPhoto ? (
                <p className="text-sm text-[var(--color-night)]">{selectedPhoto.name}</p>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {errorMessage}
              </p>
            ) : null}

            <Button className="w-full" disabled={submitState === "submitting"} type="submit">
              Place this star in the bottle
            </Button>
            </form>
          )}
        </Card>
      </div>

      <motion.div
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        className="pointer-events-none fixed right-4 bottom-4 rounded-full border border-[#d7e6f2] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--color-night)] backdrop-blur-lg"
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        Guest flow wired
      </motion.div>
    </main>
  );
}
