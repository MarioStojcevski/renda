import type { CSSProperties } from "react";

export type ShapeKind = "rectangle" | "ellipse" | "line";

export type ShapeComponentType = {
  id: string;
  type: "Shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  divStyles: CSSProperties;
};
