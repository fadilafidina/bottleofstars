import { demoAdminBottles, demoBottle, demoMessages } from "./demo-data";
import {
  getDemoBottleWithCount,
  getSortedDemoMessages,
  getStoredDemoMessages,
  setStoredDemoMessages,
} from "./demo-store";

import type { Bottle } from "../types/bottle";
import type { Message } from "../types/message";
import type { StarCardDesign } from "../types/star-card";

export type BottleMode = "guest" | "view";

export type CreateMessageInput = {
  bottleId: string;
  token: string;
  name?: string;
  message: string;
  stickers: string[];
  photoDataUrl?: string;
  photoFileName?: string;
  photoMimeType?: string;
  renderedCardDataUrl?: string;
  cardPayload?: StarCardDesign;
};

export type CreateBottleInput = {
  title: string;
  recipientNames: string;
  occasionType?: string;
  slug?: string;
};

type BottleLookupResponse = {
  bottle: Bottle;
};

type MessagesResponse = {
  bottle: Bottle;
  messages: Message[];
};

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return (await response.json()) as T;
}

export async function fetchBottleBySlug(
  slug: string,
  token: string,
  mode: BottleMode,
) {
  try {
    return await requestJson<BottleLookupResponse>(
      `/api/bottles/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}&mode=${mode}`,
    );
  } catch (error) {
    if (slug === "demo" && token === "preview") {
      const messages = getSortedDemoMessages();
      return { bottle: getDemoBottleWithCount(messages) };
    }

    throw error;
  }
}

export async function createMessage(input: CreateMessageInput) {
  try {
    return await requestJson<{ message: Message }>("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    if (input.bottleId === demoBottle.id && input.token === "preview") {
      const nextMessage: Message = {
        id: crypto.randomUUID(),
        bottleId: demoBottle.id,
        senderName: input.name?.trim() || null,
        messageText: input.message,
        photoUrl: input.renderedCardDataUrl ?? input.photoDataUrl ?? null,
        stickers: input.stickers,
        starColor: "#A7D8FF",
        createdAt: new Date().toISOString(),
        openedAt: null,
        cardPayload: input.cardPayload ?? null,
      };
      const nextMessages = [nextMessage, ...getStoredDemoMessages()];
      setStoredDemoMessages(nextMessages);

      return { message: nextMessage };
    }

    throw error;
  }
}

export async function fetchMessages(bottleId: string, token: string) {
  try {
    return await requestJson<MessagesResponse>(
      `/api/messages?bottleId=${encodeURIComponent(bottleId)}&token=${encodeURIComponent(token)}`,
    );
  } catch (error) {
    if (bottleId === demoBottle.id && token === "preview") {
      const messages = getSortedDemoMessages();
      return { bottle: getDemoBottleWithCount(messages), messages };
    }

    throw error;
  }
}

export async function markMessageOpened(
  messageId: string,
  bottleId: string,
  token: string,
) {
  try {
    return await requestJson<{ message: Message }>(
      `/api/messages/${encodeURIComponent(messageId)}/open`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bottleId, token }),
      },
    );
  } catch (error) {
    if (bottleId === demoBottle.id && token === "preview") {
      const nextMessages = getStoredDemoMessages().map((entry) =>
        entry.id === messageId
          ? { ...entry, openedAt: entry.openedAt ?? new Date().toISOString() }
          : entry,
      );
      setStoredDemoMessages(nextMessages);
      const message = nextMessages.find((entry) => entry.id === messageId);

      if (!message) {
        throw error;
      }

      return { message };
    }

    throw error;
  }
}

export async function createBottle(input: CreateBottleInput) {
  try {
    return await requestJson<{ bottle: Bottle }>("/api/admin/bottles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    return {
      bottle: {
        id: crypto.randomUUID(),
        slug: input.slug || slugify(input.title),
        title: input.title,
        recipientNames: input.recipientNames,
        occasionType: input.occasionType || null,
        theme: "default",
        createdAt: new Date().toISOString(),
        guestToken: "guest_preview",
        viewToken: "view_preview",
        messageCount: 0,
      },
    };
  }
}

export async function fetchAdminBottles() {
  try {
    return await requestJson<{ bottles: Bottle[] }>("/api/admin/bottles");
  } catch (error) {
    return { bottles: demoAdminBottles };
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
