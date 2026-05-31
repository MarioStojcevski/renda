import { v4 as uuid } from "uuid";

import type { Lane } from "../../types/lane";
import type { VideoComposition } from "../../types/video-composition";

export const addLane = ({
  timeline,
  name,
  type = "video",
}: {
  timeline: VideoComposition;
  name?: string;
  type?: "video" | "audio";
}): VideoComposition => {
  const newLane: Lane = {
    id: uuid(),
    name: name ?? `Lane ${timeline.lanes.length + 1}`,
    type,
    components: [],
  };

  return {
    ...timeline,
    lanes: [...timeline.lanes, newLane],
  };
};
