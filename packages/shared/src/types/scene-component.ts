import type { BackgroundComponentType } from "./components/background-component";
import type { GifComponentType } from "./components/gif-component";
import type { ImageComponentType } from "./components/image-component";
import type { LottieComponentType } from "./components/lottie-component";
import type { SlotMachineComponentType } from "./components/slot-machine-component";
import type { ShapeComponentType } from "./components/shape-component";
import type { TextComponentType } from "./components/text-component";
import type { VideoComponentType } from "./components/video-component";
import type { ComponentKeyframe } from "./keyframe";

export type Keyframed<T extends { id: string }> = T & {
  keyframes?: ComponentKeyframe[];
};

export type SceneComponentType =
  | Keyframed<BackgroundComponentType>
  | Keyframed<GifComponentType>
  | Keyframed<ImageComponentType>
  | Keyframed<LottieComponentType>
  | Keyframed<SlotMachineComponentType>
  | Keyframed<ShapeComponentType>
  | Keyframed<TextComponentType>
  | Keyframed<VideoComponentType>;
