import type { StarCardDesign } from "../types/star-card";

export function createDefaultCardDesign(): StarCardDesign {
  return {
    background: "paper",
    elements: [
      {
        id: crypto.randomUUID(),
        kind: "text",
        text: "",
        x: 46,
        y: 118,
        fontSize: 26,
        color: "#344255",
        rotation: -2,
      },
      {
        id: crypto.randomUUID(),
        kind: "emoji",
        emoji: "✦",
        x: 254,
        y: 52,
        fontSize: 32,
        rotation: 9,
      },
    ],
  };
}
