import type { Bottle } from "../types/bottle";
import type { Message } from "../types/message";
import { createDefaultCardDesign } from "./star-card";

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
    cardPayload: createDefaultCardDesign(),
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
    cardPayload: null,
  },
  {
    id: "msg-3",
    bottleId: demoBottle.id,
    senderName: "Sage",
    messageText:
      "I hope your home always feels like laughter in the kitchen and music drifting in from another room.",
    photoUrl: null,
    stickers: ["shell"],
    starColor: "#F4C4D7",
    createdAt: new Date().toISOString(),
    openedAt: null,
    cardPayload: null,
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
    cardPayload: null,
  },
  {
    id: "msg-5",
    bottleId: demoBottle.id,
    senderName: "Noa",
    messageText:
      "When life gets noisy, I hope this bottle gives you one small quiet second together.",
    photoUrl: null,
    stickers: ["heart"],
    starColor: "#CFE7C7",
    createdAt: new Date().toISOString(),
    openedAt: new Date().toISOString(),
    cardPayload: null,
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
    cardPayload: null,
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
