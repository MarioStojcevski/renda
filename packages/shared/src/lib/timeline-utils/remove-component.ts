import type { VideoComposition } from "../../types/video-composition";

export const removeComponent = ({
  timeline,
  componentId,
}: {
  timeline: VideoComposition;
  componentId: string;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.filter((c) => c.id !== componentId),
  })),
});
