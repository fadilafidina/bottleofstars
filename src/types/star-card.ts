export type StarCardBackground = "paper" | "sky" | "blush";

export type StarCardTextElement = {
  id: string;
  kind: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
};

export type StarCardEmojiElement = {
  id: string;
  kind: "emoji";
  emoji: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
};

export type StarCardImageElement = {
  id: string;
  kind: "image";
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type StarCardElement =
  | StarCardTextElement
  | StarCardEmojiElement
  | StarCardImageElement;

export type StarCardDesign = {
  background: StarCardBackground;
  elements: StarCardElement[];
};
