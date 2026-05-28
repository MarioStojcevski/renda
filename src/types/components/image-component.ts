import { CSSProperties } from "react";

export type ImageComponentType = {
  id: string;
  type: "Image";
  src: string;
  /** Original filename when uploaded locally. */
  name?: string;
  animation: string;
  divStyles: CSSProperties;
  imageStyles?: CSSProperties;
};
