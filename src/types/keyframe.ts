import type { CSSProperties } from "react";

export type ComponentKeyframe = {
  id: string;
  /** Frame index relative to the start of the scene (0 … scene duration − 1). */
  frame: number;
  divStyles: CSSProperties;
};
