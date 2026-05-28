import { LottieAnimationData } from "@remotion/lottie";
import { CSSProperties } from "react";

export type LottieComponentType = {
  id: string;
  type: "Lottie";
  loop: boolean;
  divStyles: CSSProperties;
  animationData: LottieAnimationData;
};
