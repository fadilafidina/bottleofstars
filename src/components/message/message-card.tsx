import { AnimatePresence, motion } from "framer-motion";

import { stickerOptions } from "../../lib/stickers";
import { Button } from "../ui/button";

import type { Message } from "../../types/message";

function getStickerLabel(id: string) {
  return stickerOptions.find((entry) => entry.id === id)?.label ?? id;
}

function getStickerIcon(id: string) {
  return stickerOptions.find((entry) => entry.id === id)?.icon ?? "✦";
}

type MessageCardProps = {
  message: Message | null;
  onClose: () => void;
  onSurpriseAgain?: () => void;
};

export function MessageCard({
  message,
  onClose,
  onSurpriseAgain,
}: MessageCardProps) {
  return (
    <AnimatePresence>
      {message ? (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 bg-[rgba(164,184,204,0.26)] backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed inset-x-4 top-1/2 z-40 mx-auto w-full max-w-2xl -translate-y-1/2 rounded-[2rem] border border-[#dfeaf2] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,244,239,0.84))] p-6 shadow-[0_30px_100px_rgba(164,184,204,0.22)] backdrop-blur-2xl sm:p-8"
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-night)]/80">
              A star opened
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">
              {message.senderName?.trim() ? `From ${message.senderName}` : "From someone who loves you"}
            </h2>
            <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-[var(--color-night)] sm:text-lg">
              {message.messageText}
            </p>

            {message.photoUrl ? (
              <img
                alt="Attached memory"
                className="mt-6 max-h-80 w-full rounded-[1.6rem] object-cover"
                src={message.photoUrl}
              />
            ) : null}

            {message.stickers.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {message.stickers.map((sticker) => (
                  <span
                    className="rounded-full border border-[#d7e6f2] bg-[#f3f9fe] px-3 py-1.5 text-sm text-[var(--color-night)]"
                    key={sticker}
                  >
                    {getStickerIcon(sticker)} {getStickerLabel(sticker)}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="sm:flex-1" onClick={onClose}>
                Close
              </Button>
              {onSurpriseAgain ? (
                <Button className="sm:flex-1" onClick={onSurpriseAgain} variant="secondary">
                  Surprise me again
                </Button>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
