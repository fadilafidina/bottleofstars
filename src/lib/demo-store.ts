import { demoBottle, demoMessages } from "./demo-data";

import type { Bottle } from "../types/bottle";
import type { Message } from "../types/message";

const demoMessagesStorageKey = "bottle-of-stars:demo-messages";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredDemoMessages() {
  if (!canUseStorage()) {
    return demoMessages;
  }

  const raw = window.localStorage.getItem(demoMessagesStorageKey);

  if (!raw) {
    window.localStorage.setItem(demoMessagesStorageKey, JSON.stringify(demoMessages));
    return demoMessages;
  }

  try {
    const parsed = JSON.parse(raw) as Message[];
    return parsed.length ? parsed : demoMessages;
  } catch {
    window.localStorage.setItem(demoMessagesStorageKey, JSON.stringify(demoMessages));
    return demoMessages;
  }
}

export function setStoredDemoMessages(messages: Message[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(demoMessagesStorageKey, JSON.stringify(messages));
}

export function getDemoBottleWithCount(messages: Message[]): Bottle {
  return {
    ...demoBottle,
    messageCount: messages.length,
  };
}

export function getSortedDemoMessages() {
  return getStoredDemoMessages().sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}
