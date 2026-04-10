import type { Bottle } from "../types/bottle";
import type { Message } from "../types/message";
import { createDefaultCardDesign } from "./star-card";
import type { StarCardDesign } from "../types/star-card";

function createCardDesign(
  background: StarCardDesign["background"],
  elements: StarCardDesign["elements"],
): StarCardDesign {
  return { background, elements };
}

const cardForJamie = createCardDesign("sky", [
  {
    id: "jamie-text",
    kind: "text",
    text: "Keep finding little reasons\nto celebrate each other.",
    x: 42,
    y: 96,
    fontSize: 24,
    color: "#344255",
    rotation: -2,
  },
  {
    id: "jamie-emoji-1",
    kind: "emoji",
    emoji: "🩵",
    x: 492,
    y: 58,
    fontSize: 34,
    rotation: 7,
  },
  {
    id: "jamie-emoji-2",
    kind: "emoji",
    emoji: "✦",
    x: 468,
    y: 308,
    fontSize: 28,
    rotation: -9,
  },
]);

const cardForRin = createCardDesign("paper", [
  {
    id: "rin-text",
    kind: "text",
    text: "May your quiet days\nbe beautiful too.",
    x: 58,
    y: 124,
    fontSize: 22,
    color: "#344255",
    rotation: 1,
  },
  {
    id: "rin-emoji-1",
    kind: "emoji",
    emoji: "☁️",
    x: 428,
    y: 64,
    fontSize: 34,
    rotation: 2,
  },
  {
    id: "rin-emoji-2",
    kind: "emoji",
    emoji: "🌙",
    x: 512,
    y: 276,
    fontSize: 30,
    rotation: 11,
  },
]);

const cardForSage = createCardDesign("blush", [
  {
    id: "sage-text",
    kind: "text",
    text: "Let your home always feel\nlike laughter in the kitchen.",
    x: 48,
    y: 92,
    fontSize: 22,
    color: "#344255",
    rotation: -1,
  },
  {
    id: "sage-emoji-1",
    kind: "emoji",
    emoji: "🐚",
    x: 474,
    y: 72,
    fontSize: 30,
    rotation: -8,
  },
  {
    id: "sage-emoji-2",
    kind: "emoji",
    emoji: "🌊",
    x: 454,
    y: 310,
    fontSize: 32,
    rotation: 10,
  },
]);

const cardForAnonymous = createCardDesign("paper", [
  {
    id: "anon-text",
    kind: "text",
    text: "Protect the small rituals.\nThey matter.",
    x: 62,
    y: 132,
    fontSize: 23,
    color: "#344255",
    rotation: -3,
  },
  {
    id: "anon-emoji-1",
    kind: "emoji",
    emoji: "✦",
    x: 504,
    y: 74,
    fontSize: 26,
    rotation: 4,
  },
  {
    id: "anon-emoji-2",
    kind: "emoji",
    emoji: "🫧",
    x: 470,
    y: 286,
    fontSize: 30,
    rotation: -6,
  },
]);

const cardForNoa = createCardDesign("sky", [
  {
    id: "noa-text",
    kind: "text",
    text: "A small quiet second\ntogether.",
    x: 54,
    y: 120,
    fontSize: 24,
    color: "#344255",
    rotation: 2,
  },
  {
    id: "noa-emoji-1",
    kind: "emoji",
    emoji: "☁️",
    x: 458,
    y: 70,
    fontSize: 30,
    rotation: -4,
  },
  {
    id: "noa-emoji-2",
    kind: "emoji",
    emoji: "🩵",
    x: 490,
    y: 294,
    fontSize: 28,
    rotation: 8,
  },
]);

const cardForAster = createCardDesign("blush", [
  {
    id: "aster-text",
    kind: "text",
    text: "Don’t stop being silly\nwith each other.",
    x: 46,
    y: 108,
    fontSize: 24,
    color: "#344255",
    rotation: -2,
  },
  {
    id: "aster-emoji-1",
    kind: "emoji",
    emoji: "✦",
    x: 500,
    y: 84,
    fontSize: 30,
    rotation: -7,
  },
  {
    id: "aster-emoji-2",
    kind: "emoji",
    emoji: "🐚",
    x: 468,
    y: 302,
    fontSize: 28,
    rotation: 9,
  },
]);

export const demoBottle: Bottle = {
  id: "demo-bottle-id",
  slug: "demo",
  title: "For Maya & Theo",
  recipientNames: "Maya & Theo",
  occasionType: "Wedding",
  theme: "default",
  createdAt: new Date().toISOString(),
  guestToken: "preview",
  viewToken: "preview",
  messageCount: 6,
};

export const demoMessages: Message[] = [
  {
    id: "msg-1",
    bottleId: demoBottle.id,
    senderName: "Jamie",
    messageText:
      "You two make everything around you feel softer and brighter. Keep finding little reasons to celebrate each other.",
    photoUrl: null,
    stickers: ["star", "heart"],
    starColor: "#A7D8FF",
    createdAt: new Date().toISOString(),
    openedAt: null,
    cardPayload: cardForJamie,
  },
  {
    id: "msg-2",
    bottleId: demoBottle.id,
    senderName: "Rin",
    messageText:
      "May your quiet days be just as beautiful as the big ones. Love you endlessly.",
    photoUrl: null,
    stickers: ["moon", "sparkles"],
    starColor: "#FFF3DA",
    createdAt: new Date().toISOString(),
    openedAt: new Date().toISOString(),
    cardPayload: cardForRin,
  },
  {
    id: "msg-3",
    bottleId: demoBottle.id,
    senderName: "Sage",
    messageText:
      "I hope your home always feels like laughter in the kitchen and music drifting in from another room.",
    photoUrl: null,
    stickers: ["shell", "wave"],
    starColor: "#F4C4D7",
    createdAt: new Date().toISOString(),
    openedAt: null,
    cardPayload: cardForSage,
  },
  {
    id: "msg-4",
    bottleId: demoBottle.id,
    senderName: null,
    messageText:
      "A reminder from someone who adores you both: the small rituals matter. Protect them.",
    photoUrl: null,
    stickers: ["wave", "star"],
    starColor: "#EEDC9A",
    createdAt: new Date().toISOString(),
    openedAt: null,
    cardPayload: cardForAnonymous,
  },
  {
    id: "msg-5",
    bottleId: demoBottle.id,
    senderName: "Noa",
    messageText:
      "When life gets noisy, I hope this bottle gives you one small quiet second together.",
    photoUrl: null,
    stickers: ["heart", "moon"],
    starColor: "#CFE7C7",
    createdAt: new Date().toISOString(),
    openedAt: new Date().toISOString(),
    cardPayload: cardForNoa,
  },
  {
    id: "msg-6",
    bottleId: demoBottle.id,
    senderName: "Aster",
    messageText:
      "You deserve a life that still feels playful years from now. Don’t stop being silly with each other.",
    photoUrl: null,
    stickers: ["sparkles", "moon"],
    starColor: "#A7D8FF",
    createdAt: new Date().toISOString(),
    openedAt: null,
    cardPayload: cardForAster,
  },
];

export const demoAdminBottles: Bottle[] = [
  demoBottle,
  {
    id: "demo-bottle-elle",
    slug: "elle",
    title: "For Elle",
    recipientNames: "Elle",
    occasionType: "Birthday",
    theme: "default",
    createdAt: new Date().toISOString(),
    guestToken: "guest_demo_2",
    viewToken: "view_demo_2",
    messageCount: 3,
  },
];
