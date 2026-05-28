import type { SceneComponentType } from "../types/scene-component";
import type { SceneType } from "../types/scene";
import type { VideoComposition } from "../types/video-composition";
import { FPS } from "./video";

export const PX_PER_FRAME = 4;

/** Seconds from frame index (for numeric inputs). */
export const framesToSeconds = (frames: number) => frames / FPS;

export const secondsToFrames = (seconds: number) => Math.round(seconds * FPS);

/** Stable timecode label derived from frame index (avoids double-round jitter). */
export const formatTimecode = (frame: number): string => {
  const clamped = Math.max(0, Math.round(frame));
  const totalSec = clamped / FPS;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec - minutes * 60;
  const secPart = seconds.toFixed(2).padStart(minutes > 0 ? 5 : 4, "0");
  return minutes > 0 ? `${minutes}:${secPart}` : secPart;
};

export const timelineWidthPx = (totalFrames: number) =>
  Math.max(totalFrames * PX_PER_FRAME, 600);

export type SceneAtPlayhead = {
  scene: SceneType;
  sceneIndex: number;
  sceneStartFrame: number;
  sceneLocalFrame: number;
};

export const getSceneAtPlayhead = (
  videoTrack: SceneType[],
  playheadFrame: number
): SceneAtPlayhead | null => {
  let start = 0;
  for (let i = 0; i < videoTrack.length; i++) {
    const scene = videoTrack[i];
    const end = start + scene.duration;
    if (playheadFrame < end) {
      return {
        scene,
        sceneIndex: i,
        sceneStartFrame: start,
        sceneLocalFrame: playheadFrame - start,
      };
    }
    start = end;
  }
  const last = videoTrack.at(-1);
  if (!last) return null;
  return {
    scene: last,
    sceneIndex: videoTrack.length - 1,
    sceneStartFrame: start - last.duration,
    sceneLocalFrame: last.duration - 1,
  };
};

export const findComponent = (
  timeline: VideoComposition,
  componentId: string
): { scene: SceneType; component: SceneComponentType } | null => {
  for (const scene of timeline.VideoTrack) {
    const component = scene.components.find((c) => c.id === componentId);
    if (component) return { scene, component };
  }
  return null;
};
