import { secondsToFrames } from "../timeline-math";
import type { VideoComposition } from "../../types/video-composition";

export const trimComponentStart = ({
  timeline,
  componentId,
  deltaFrames,
}: {
  timeline: VideoComposition;
  componentId: string;
  deltaFrames: number;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) => {
      if (c.id !== componentId) return c;
      const newDuration = c.duration - deltaFrames;
      if (newDuration < secondsToFrames(0.5)) return c;
      const newStart = Math.max(0, c.startFrame + deltaFrames);
      const newSourceStart = Math.max(0, (c.sourceStartFrame ?? 0) + deltaFrames);
      return {
        ...c,
        startFrame: newStart,
        duration: newDuration,
        sourceStartFrame: newSourceStart,
      };
    }),
  })),
});

export const trimComponentEnd = ({
  timeline,
  componentId,
  deltaFrames,
}: {
  timeline: VideoComposition;
  componentId: string;
  deltaFrames: number;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) => {
      if (c.id !== componentId) return c;
      const newDuration = c.duration + deltaFrames;
      if (newDuration < secondsToFrames(0.5)) return c;
      return {
        ...c,
        duration: newDuration,
        sourceEndFrame: deltaFrames < 0
          ? (c.sourceEndFrame ?? c.duration) + deltaFrames
          : undefined,
      };
    }),
  })),
});
