import type { SceneType } from "../types/scene";
import type { VideoComposition } from "../types/video-composition";

export const FPS = 30;
export const COMPOSITION_WIDTH = 1280;
export const COMPOSITION_HEIGHT = 720;

export const totalDurationFrames = (timeline: VideoComposition): number => {
  const frames = timeline.VideoTrack.reduce((acc, scene) => acc + scene.duration, 0);
  return frames || FPS * 5;
};

export const findSceneIdAtFrame = (
  videoTrack: SceneType[],
  frame: number
): string | undefined => {
  let end = 0;
  for (const scene of videoTrack) {
    end += scene.duration;
    if (frame < end) return scene.id;
  }
  return videoTrack.at(-1)?.id;
};
