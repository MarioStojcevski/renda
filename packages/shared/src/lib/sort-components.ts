import type { TimedComponent } from "../types/timed-component";

const Z_ORDER: Record<string, number> = {
  Background: 0,
  Shape: 2,
  Video: 3,
  Image: 4,
  Gif: 5,
  Lottie: 6,
  Text: 7,
};

export const sortComponentsForRender = (components: TimedComponent[]): TimedComponent[] =>
  [...components].sort((a, b) => (Z_ORDER[a.type] ?? 99) - (Z_ORDER[b.type] ?? 99));
