import { CSSProperties } from "react";

export type VideoComponentType = {
  id: string;
  type: "Video";
  src: string;
  animation: string;
  divStyles: CSSProperties;
  videoStyles?: CSSProperties;
};
