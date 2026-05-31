import type { VideoComposition } from "../../types/video-composition";

export const deleteLane = ({
  timeline,
  laneId,
}: {
  timeline: VideoComposition;
  laneId: string;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.filter((lane) => lane.id !== laneId),
});
