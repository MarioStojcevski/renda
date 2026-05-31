import { FPS } from "../video";
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

export const addComponentAtEnd = ({
  timeline,
  laneId,
  component,
}: {
  timeline: VideoComposition;
  laneId: string;
  component: Omit<TimedComponent, "startFrame">;
}): VideoComposition => {
  const lane = timeline.lanes.find((l) => l.id === laneId);
  const last = lane?.components.at(-1);
  const startFrame = last ? last.startFrame + last.duration : 0;
  return addComponentToLane({
    timeline,
    laneId,
    component: { ...component, startFrame } as TimedComponent,
  });
};
