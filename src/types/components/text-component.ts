import { CSSProperties } from "react";

export type TextComponentType = {
  id: string;
  type: "Text";
  content: string;
  animation: string;
  textStyles: CSSProperties;
  divStyles: CSSProperties;
};
