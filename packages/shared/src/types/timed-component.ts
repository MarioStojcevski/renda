import type { ComponentKeyframe } from "./keyframe";
import type { BackgroundComponentType } from "./components/background-component";
import type { GifComponentType } from "./components/gif-component";
import type { ImageComponentType } from "./components/image-component";
import type { LottieComponentType } from "./components/lottie-component";
import type { ShapeComponentType } from "./components/shape-component";
import type { TextComponentType } from "./components/text-component";
import type { VideoComponentType } from "./components/video-component";

export type Timed<T extends { id: string }> = T & {
  startFrame: number;
  duration: number;
  sourceStartFrame?: number;
  sourceEndFrame?: number;
  keyframes?: ComponentKeyframe[];
};

export type TimedComponent =
  | Timed<BackgroundComponentType>
  | Timed<GifComponentType>
  | Timed<ImageComponentType>
  | Timed<LottieComponentType>
  | Timed<ShapeComponentType>
  | Timed<TextComponentType>
  | Timed<VideoComponentType>;
