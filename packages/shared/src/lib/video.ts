import type { Lane } from "../types/lane";
import type { VideoComposition } from "../types/video-composition";

export const FPS = 60;
export const COMPOSITION_WIDTH = 1920;
export const COMPOSITION_HEIGHT = 1080;

export const totalDurationFrames = (timeline: VideoComposition): number => {
  const max = timeline.lanes.reduce((acc, lane) => {
    const last = lane.components.at(-1);
    if (!last) return acc;
    return Math.max(acc, last.startFrame + last.duration);
  }, 0);
  return Math.max(max, FPS * 5);
};

export const getActiveComponent = (lane: Lane, frame: number) => {
  for (const component of lane.components) {
    const end = component.startFrame + component.duration;
    if (frame >= component.startFrame && frame < end) {
      return component;
    }
  }
  return null;
};
