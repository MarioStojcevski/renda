import type { VideoComposition } from "../types/video-composition";

const collectSrcs = (timeline: VideoComposition): string[] => {
  const srcs: string[] = [];
  for (const scene of timeline.VideoTrack) {
    for (const component of scene.components) {
      if ("src" in component && typeof component.src === "string") {
        srcs.push(component.src);
      }
      if ("logos" in component && Array.isArray(component.logos)) {
        srcs.push(...component.logos);
      }
    }
  }
  for (const segment of timeline.AudioTrack) {
    if (segment.src) srcs.push(segment.src);
  }
  return srcs;
};

export const findUnrenderableAssets = (timeline: VideoComposition): string[] =>
  collectSrcs(timeline).filter((src) => src.startsWith("blob:"));
