export const starPalette = [
  "#A7D8FF",
  "#FFF3DA",
  "#F4C4D7",
  "#EEDC9A",
  "#CFE7C7",
] as const;

export function getRandomStarColor() {
  return starPalette[Math.floor(Math.random() * starPalette.length)];
}
