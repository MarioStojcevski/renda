import type { VideoComposition } from "../../types/video-composition";

export const moveComponent = ({
  timeline,
  componentId,
  newStartFrame,
}: {
  timeline: VideoComposition;
  componentId: string;
  newStartFrame: number;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) =>
      c.id === componentId ? { ...c, startFrame: Math.max(0, newStartFrame) } : c
    ),
  })),
});
