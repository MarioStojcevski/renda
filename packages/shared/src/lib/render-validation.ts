import type { VideoComposition } from "../types/video-composition";

const collectSrcs = (timeline: VideoComposition): string[] => {
  const srcs: string[] = [];
  for (const lane of timeline.lanes) {
    for (const component of lane.components) {
      if ("src" in component && typeof component.src === "string") {
        srcs.push(component.src);
      }
      if ("logos" in component && Array.isArray(component.logos)) {
        srcs.push(...component.logos);
      }
    }
  }
  return srcs;
};

export const findUnrenderableAssets = (timeline: VideoComposition): string[] =>
  collectSrcs(timeline).filter((src) => src.startsWith("blob:"));
