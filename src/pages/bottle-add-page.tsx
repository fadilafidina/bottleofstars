import { useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type Konva from "konva";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { LoadingScreen } from "../components/ui/loading-screen";
import { EmptyState } from "../components/ui/empty-state";
import { StarCardEditor } from "../components/submission/star-card-editor";
import { createMessage } from "../lib/api";
import { createDefaultCardDesign } from "../lib/star-card";
import { getTokenFromSearch } from "../lib/tokens";
import { useBottle } from "../hooks/use-bottle";
import type { StarCardDesign, StarCardElement } from "../types/star-card";

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read photo."));
    reader.readAsDataURL(file);
  });
}

function extractCardMessage(elements: StarCardElement[]) {
  return elements
    .flatMap((element) => {
      if (element.kind === "text") {
        return [element.text.trim()];
      }

      return [];
    })
    .filter(Boolean)
    .join("\n\n");
}

function hasMeaningfulCardContent(design: StarCardDesign) {
  return design.elements.some((element) => {
    if (element.kind === "text") {
      return Boolean(element.text.trim());
    }

    return true;
  });
}

export function BottleAddPage() {
  const { slug } = useParams();
  const location = useLocation();
  const token = useMemo(() => getTokenFromSearch(location.search), [location.search]);
  const [senderName, setSenderName] = useState("");
  const [cardDesign, setCardDesign] = useState<StarCardDesign>(createDefaultCardDesign);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { bottle, error, isLoading } = useBottle(slug, token, "guest");
  const stageRef = useRef<Konva.Stage | null>(null);

  const handlePhotoUpload = async (file: File) => {
    const src = await fileToDataUrl(file);
    const id = crypto.randomUUID();
    setCardDesign((current) => ({
      ...current,
      elements: [
        ...current.elements,
        {
          id,
          kind: "image",
          src,
          x: 70,
          y: 222,
          width: 180,
          height: 120,
          rotation: -3,
        },
      ],
    }));
    setSelectedElementId(id);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!bottle || !token) {
      return;
    }

    if (!hasMeaningfulCardContent(cardDesign)) {
      setErrorMessage("Add some text, an emoji, or a photo to your card first.");
      return;
    }

    setSubmitState("submitting");
    setErrorMessage(null);

    try {
      const messageText = extractCardMessage(cardDesign.elements) || "Decorated star card";
      const renderedCardDataUrl =
        stageRef.current?.toDataURL({ pixelRatio: 2 }) ?? undefined;

      await createMessage({
        bottleId: bottle.id,
        token,
        name: senderName,
        message: messageText,
        stickers: [],
        renderedCardDataUrl,
        photoMimeType: "image/png",
        cardPayload: cardDesign,
      });

      setSenderName("");
      setCardDesign(createDefaultCardDesign());
      setSelectedElementId(null);
      setSubmitState("success");
    } catch (submitError) {
      setErrorMessage(
        submitError instanceof Error
          ? submitError.message
          : "Unable to place this star in the bottle.",
      );
      setSubmitState("idle");
    }
  };

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
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[40rem]">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="font-serif text-2xl text-[var(--color-ink)] sm:text-3xl">
            Add your message for {bottle.recipientNames}
          </h1>
        </div>

        <div className="mx-auto">
          {submitState === "success" ? (
            <Card className="mx-auto w-full max-w-[40rem]">
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
            </Card>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <StarCardEditor
                design={cardDesign}
                onChange={setCardDesign}
                onSelect={setSelectedElementId}
                onUploadPhoto={handlePhotoUpload}
                selectedId={selectedElementId}
                stageRef={stageRef}
              />

              <div className="mx-auto w-full max-w-[40rem] space-y-2">
                <label className="text-sm text-[var(--color-night)]" htmlFor="senderName">
                  Signed by
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-[#dae7f3] bg-white/80 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0] focus:border-[var(--color-sky)]"
                  id="senderName"
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="Optional"
                  type="text"
                  value={senderName}
                />
              </div>

              {errorMessage ? (
                <p className="mx-auto w-full max-w-[40rem] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {errorMessage}
                </p>
              ) : null}

              <div className="mx-auto w-full max-w-[40rem]">
                <Button className="w-full" disabled={submitState === "submitting"} type="submit">
                  Send this card into the bottle
                </Button>
              </div>
            </form>
          )}
        </div>
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
