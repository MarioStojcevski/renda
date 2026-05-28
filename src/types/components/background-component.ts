import type { CSSProperties } from "react";

export type BackgroundComponentType = {
  id: string;
  type: "Background";
  /** CSS color or gradient, e.g. `#09090b` or `linear-gradient(...)` */
  fill: string;
  divStyles: CSSProperties;
};
