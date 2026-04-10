import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { BottleShell } from "../components/bottle/bottle-shell";
import { FloatingStar } from "../components/bottle/floating-star";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { LoadingScreen } from "../components/ui/loading-screen";
import { MessageCard } from "../components/message/message-card";
import { getTokenFromSearch, maskToken } from "../lib/tokens";
import { starPalette } from "../lib/colors";
import { useBottle } from "../hooks/use-bottle";
import { useMessages } from "../hooks/use-messages";

import type { Message } from "../types/message";

const starSlots = [
  { top: "16%", left: "26%" },
  { top: "21%", left: "55%" },
  { top: "34%", left: "42%" },
  { top: "44%", left: "64%" },
  { top: "52%", left: "22%" },
  { top: "60%", left: "49%" },
  { top: "71%", left: "35%" },
  { top: "76%", left: "60%" },
];

export function BottleViewPage() {
  const { slug } = useParams();
  const location = useLocation();
  const token = useMemo(() => getTokenFromSearch(location.search), [location.search]);
  const { bottle, error, isLoading } = useBottle(slug, token, "view");
  const {
    bottle: messagesBottle,
    error: messagesError,
    isLoading: messagesLoading,
    messages,
    openMessage,
  } = useMessages(bottle?.id, token);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [scenePulse, setScenePulse] = useState(false);

  useEffect(() => {
    if (!activeMessage) {
      return;
    }

    setScenePulse(true);
    const timeout = window.setTimeout(() => setScenePulse(false), 450);

    return () => window.clearTimeout(timeout);
  }, [activeMessage]);

  if (isLoading || (bottle && messagesLoading)) {
    return (
      <main className="flex min-h-screen items-center px-6">
        <LoadingScreen
          eyebrow="Bottle view"
          title="Calling the stars closer"
          body="We’re bringing this bottle and all its messages into view."
        />
      </main>
    );
  }

  if (error || !bottle) {
    return (
      <main className="flex min-h-screen items-center px-6">
        <EmptyState
          body={error ?? "This viewer link could not be opened."}
          eyebrow="Viewer access"
          title="That bottle link drifted away"
        />
      </main>
    );
  }

  if (messagesError) {
    return (
      <main className="flex min-h-screen items-center px-6">
        <EmptyState
          body={messagesError}
          eyebrow="Messages"
          title="The stars could not be loaded"
        />
      </main>
    );
  }

  const liveBottle = messagesBottle ?? bottle;
  const visibleMessages = messages.slice(0, starSlots.length);
  const unreadMessages = messages.filter((message) => !message.openedAt);
  const currentCount = messages.length || liveBottle.messageCount || 0;

  const handleOpenMessage = async (message: Message) => {
    const updated = await openMessage(message.id);
    setActiveMessage(updated ? { ...message, openedAt: updated.openedAt } : message);
  };

  const handleSurpriseMe = async () => {
    if (!messages.length) {
      return;
    }

    const pool = unreadMessages.length ? unreadMessages : messages;
    const randomMessage = pool[Math.floor(Math.random() * pool.length)];
    await handleOpenMessage(randomMessage);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
      <section className="relative w-full max-w-2xl">
        <motion.div
          animate={{ scale: scenePulse ? 1.02 : 1 }}
          className="relative"
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-8 mx-auto h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(185,220,251,0.42),rgba(185,220,251,0)_68%)] blur-3xl" />
          <div className="relative mx-auto w-full max-w-md">
            <div className="pointer-events-none absolute inset-x-[19%] top-[20%] bottom-[21%] z-10 rounded-[40%_40%_30%_30%/18%_18%_24%_24%]">
              <AnimatePresence>
                {visibleMessages.map((message, index) => {
                  const slot = starSlots[index % starSlots.length];

                  return (
                    <motion.button
                      animate={{ opacity: 1, scale: 1 }}
                      className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-1/2"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      key={message.id}
                      onClick={() => {
                        void handleOpenMessage(message);
                      }}
                      style={{ top: slot.top, left: slot.left }}
                      transition={{ duration: 0.24, delay: index * 0.03 }}
                      type="button"
                    >
                      <FloatingStar
                        color={message.starColor || starPalette[index % starPalette.length]}
                        delay={index * 0.4}
                        dimmed={Boolean(message.openedAt)}
                        size={index % 3 === 0 ? "lg" : "md"}
                      />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            <BottleShell>
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 min-w-10 items-center justify-center rounded-full border border-[#d7e6f2] bg-white/88 px-3 text-sm text-[var(--color-ink)]">
                  {currentCount}
                </div>
                <div className="flex h-10 min-w-10 items-center justify-center rounded-full border border-[#d7e6f2] bg-[#edf7ff] px-3 text-sm text-[var(--color-ink)]">
                  {unreadMessages.length}
                </div>
              </div>
            </BottleShell>
          </div>
        </motion.div>

        {messages.length ? (
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
            <Button
              className="w-full"
              onClick={() => {
                const firstUnread = unreadMessages[0] ?? messages[0];
                if (firstUnread) {
                  void handleOpenMessage(firstUnread);
                }
              }}
            >
              Pick a star
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                void handleSurpriseMe();
              }}
              variant="secondary"
            >
              Surprise me
            </Button>
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-sm">
            <EmptyState
              body="Share the guest link and stars will begin to appear."
              eyebrow="Empty bottle"
              title="No stars yet"
            />
          </div>
        )}
      </section>

      <MessageCard
        message={activeMessage}
        onClose={() => setActiveMessage(null)}
        onSurpriseAgain={
          messages.length
            ? () => {
                setActiveMessage(null);
                void handleSurpriseMe();
              }
            : undefined
        }
      />
    </main>
  );
}
