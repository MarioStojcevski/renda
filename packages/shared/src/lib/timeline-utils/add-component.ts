import type { TimedComponent } from "../../types/timed-component";
import type { VideoComposition } from "../../types/video-composition";

export const addComponentToLane = ({
  timeline,
  laneId,
  component,
}: {
  timeline: VideoComposition;
  laneId: string;
  component: TimedComponent;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) =>
    lane.id === laneId
      ? {
          ...lane,
          components: [...lane.components, component],
        }
      : lane
  ),
});

export const addComponentAtFrame = ({
  timeline,
  laneId,
  component,
  frame,
}: {
  timeline: VideoComposition;
  laneId: string;
  component: TimedComponent;
  frame: number;
}): VideoComposition =>
  addComponentToLane({
    timeline,
    laneId,
    component: { ...component, startFrame: frame },
  });
