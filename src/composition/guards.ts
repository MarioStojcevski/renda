import type { BackgroundComponentType } from "../types/components/background-component";
import type { GifComponentType } from "../types/components/gif-component";
import type { ImageComponentType } from "../types/components/image-component";
import type { LottieComponentType } from "../types/components/lottie-component";
import type { SlotMachineComponentType } from "../types/components/slot-machine-component";
import type { ShapeComponentType } from "../types/components/shape-component";
import type { TextComponentType } from "../types/components/text-component";
import type { VideoComponentType } from "../types/components/video-component";
import type { SceneComponentType } from "../types/scene-component";

export const isBackground = (
  component: SceneComponentType
): component is BackgroundComponentType => component.type === "Background";

export const isShape = (
  component: SceneComponentType
): component is ShapeComponentType => component.type === "Shape";

export const isText = (
  component: SceneComponentType
): component is TextComponentType => component.type === "Text";

export const isImage = (
  component: SceneComponentType
): component is ImageComponentType => component.type === "Image";

export const isVideo = (
  component: SceneComponentType
): component is VideoComponentType => component.type === "Video";

export const isLottie = (
  component: SceneComponentType
): component is LottieComponentType => component.type === "Lottie";

export const isGif = (
  component: SceneComponentType
): component is GifComponentType => component.type === "Gif";

export const isSlotMachine = (
  component: SceneComponentType
): component is SlotMachineComponentType => component.type === "SlotMachine";
