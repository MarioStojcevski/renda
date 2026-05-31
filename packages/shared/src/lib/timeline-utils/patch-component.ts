import type { TimedComponent } from "../../types/timed-component";
import type { VideoComposition } from "../../types/video-composition";

export const patchComponent = ({
  timeline,
  componentId,
  patch,
}: {
  timeline: VideoComposition;
  componentId: string;
  patch: Partial<TimedComponent>;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) =>
      c.id === componentId ? ({ ...c, ...patch } as TimedComponent) : c
    ),
  })),
});
