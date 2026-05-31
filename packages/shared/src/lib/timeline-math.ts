import type { TimedComponent } from "../types/timed-component";
import type { Lane } from "../types/lane";
import type { VideoComposition } from "../types/video-composition";
import { FPS } from "./video";

/** Seconds visible in the track area at 100% zoom (target ~10–15s). */
export const TIMELINE_SECONDS_AT_100_ZOOM = 12.5;

/** Fallback track width when the timeline viewport is not measured yet. */
export const TIMELINE_REFERENCE_TRACK_WIDTH_PX = 1050;

export const PX_PER_FRAME =
  TIMELINE_REFERENCE_TRACK_WIDTH_PX / (TIMELINE_SECONDS_AT_100_ZOOM * FPS);

export const getBasePxPerFrame = (trackWidthPx: number) =>
  trackWidthPx / (TIMELINE_SECONDS_AT_100_ZOOM * FPS);

export const getPxPerFrame = (zoom: number, trackWidthPx = TIMELINE_REFERENCE_TRACK_WIDTH_PX) =>
  getBasePxPerFrame(trackWidthPx) * zoom;

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
