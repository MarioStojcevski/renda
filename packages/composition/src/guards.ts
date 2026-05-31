import type { BackgroundComponentType } from "@renda/shared/types/components/background-component";
import type { GifComponentType } from "@renda/shared/types/components/gif-component";
import type { ImageComponentType } from "@renda/shared/types/components/image-component";
import type { LottieComponentType } from "@renda/shared/types/components/lottie-component";
import type { SlotMachineComponentType } from "@renda/shared/types/components/slot-machine-component";
import type { ShapeComponentType } from "@renda/shared/types/components/shape-component";
import type { TextComponentType } from "@renda/shared/types/components/text-component";
import type { VideoComponentType } from "@renda/shared/types/components/video-component";
import type { Timed, TimedComponent } from "@renda/shared/types/timed-component";

export const isBackground = (
  component: TimedComponent
): component is Timed<BackgroundComponentType> => component.type === "Background";

export const isShape = (
  component: TimedComponent
): component is Timed<ShapeComponentType> => component.type === "Shape";

export const isText = (
  component: TimedComponent
): component is Timed<TextComponentType> => component.type === "Text";

export const isImage = (
  component: TimedComponent
): component is Timed<ImageComponentType> => component.type === "Image";

export const isVideo = (
  component: TimedComponent
): component is Timed<VideoComponentType> => component.type === "Video";

export const isLottie = (
  component: TimedComponent
): component is Timed<LottieComponentType> => component.type === "Lottie";

export const isGif = (
  component: TimedComponent
): component is Timed<GifComponentType> => component.type === "Gif";

export const isSlotMachine = (
  component: TimedComponent
): component is Timed<SlotMachineComponentType> => component.type === "SlotMachine";
