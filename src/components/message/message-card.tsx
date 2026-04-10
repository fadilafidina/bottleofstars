import { AnimatePresence, motion } from "framer-motion";

import { StarCardPreview } from "../star-card/star-card-preview";
import { Button } from "../ui/button";

import type { Message } from "../../types/message";

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
  const shouldShowText =
    Boolean(message?.messageText?.trim()) &&
    message?.messageText.trim() !== "Decorated star card" &&
    !message?.cardPayload;
  const showDesignedCard = Boolean(message?.cardPayload);

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
            className="fixed inset-x-4 top-1/2 z-40 mx-auto w-full max-w-[44rem] -translate-y-1/2 rounded-[2.2rem] border border-[#dfeaf2] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,247,243,0.86))] p-5 shadow-[0_34px_110px_rgba(164,184,204,0.24)] backdrop-blur-2xl sm:p-7"
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--color-night)]/70">
                  A star opened
                </p>
                <h2 className="mt-3 font-serif text-[2rem] leading-none text-[var(--color-ink)] sm:text-[2.35rem]">
                  {message.senderName?.trim()
                    ? `From ${message.senderName}`
                    : "From someone who loves you"}
                </h2>
              </div>
              <button
                aria-label="Close message"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[1rem] border border-[#dfeaf2] bg-white/88 text-xl leading-none text-[var(--color-night)] transition hover:bg-white hover:text-[var(--color-ink)]"
                onClick={onClose}
                type="button"
              >
                ×
              </button>
            </div>

            {showDesignedCard && message?.cardPayload ? (
              <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-[#dfeaf2] bg-white/72 p-3 sm:p-4">
                <StarCardPreview design={message.cardPayload} maxWidth={600} />
              </div>
            ) : null}

            {!showDesignedCard && message.photoUrl ? (
              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-[#dfeaf2] bg-white/72 p-3">
                <img
                  alt="Designed card"
                  className="max-h-[28rem] w-full rounded-[1.2rem] object-contain"
                  src={message.photoUrl}
                />
              </div>
            ) : null}

            {shouldShowText ? (
              <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-[var(--color-night)] sm:text-lg">
                {message.messageText}
              </p>
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
