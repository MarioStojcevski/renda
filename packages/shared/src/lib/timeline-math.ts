import type { TimedComponent } from "../types/timed-component";
import type { Lane } from "../types/lane";
import type { VideoComposition } from "../types/video-composition";
import { FPS } from "./video";

export const PX_PER_FRAME = 4;

export const getPxPerFrame = (zoom: number) => PX_PER_FRAME * zoom;

export const framesToSeconds = (frames: number) => frames / FPS;

export const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

export const formatTimecode = (frame: number): string => {
  const clamped = Math.max(0, Math.round(frame));
  const totalSec = clamped / FPS;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec - minutes * 60;
  const secPart = seconds.toFixed(2).padStart(minutes > 0 ? 5 : 4, "0");
  return minutes > 0 ? `${minutes}:${secPart}` : secPart;
};

export const timelineWidthPx = (totalFrames: number, pxPerFrame = PX_PER_FRAME) =>
  Math.max(totalFrames * pxPerFrame, 600);

export const findComponent = (
  timeline: VideoComposition,
  componentId: string
): { lane: Lane; component: TimedComponent } | null => {
  for (const lane of timeline.lanes) {
    const component = lane.components.find((c) => c.id === componentId);
    if (component) return { lane, component };
  }
  return null;
};
