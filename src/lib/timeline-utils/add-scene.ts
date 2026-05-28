import { v4 as uuid } from "uuid";

import type { SceneType } from "../../types/scene";
import type { VideoComposition } from "../../types/video-composition";

const DEFAULT_SCENE_DURATION = 230;

export const addScene = ({
  timeline,
  duration = DEFAULT_SCENE_DURATION,
}: {
  timeline: VideoComposition;
  duration?: number;
}): VideoComposition => {
  const newScene: SceneType = {
    id: uuid(),
    type: "Scene",
    duration,
    components: [],
  };

  return {
    ...timeline,
    VideoTrack: [...timeline.VideoTrack, newScene],
  };
};
