import type { StarCardDesign } from "../types/star-card";

export const STAR_CARD_WIDTH = 640;
export const STAR_CARD_HEIGHT = 440;

export function createDefaultCardDesign(): StarCardDesign {
  return {
    background: "paper",
    elements: [
      {
        id: crypto.randomUUID(),
        kind: "emoji",
        emoji: "✦",
        x: 304,
        y: 54,
        fontSize: 32,
        rotation: 9,
      },
    ],
  };
}
