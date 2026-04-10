import type { StarCardDesign } from "../types/star-card";

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
