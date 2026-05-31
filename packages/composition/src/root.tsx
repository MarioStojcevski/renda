import { Composition as RemotionComposition } from "remotion";

import {
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  FPS,
  totalDurationFrames,
} from "@renda/shared/lib/video";
import type { VideoComposition } from "@renda/shared/types/video-composition";
import { SceneComposition } from "./scene-composition";
import Scenes from "./scenes";
import { SLOT_MACHINE_TEMPLATE } from "./templates/slot-machine";

export const RemotionRoot = () => (
  <>
    <RemotionComposition
      component={Scenes}
      id="scenes"
      defaultProps={SLOT_MACHINE_TEMPLATE}
      calculateMetadata={async ({ props }) => {
        const timeline = props as VideoComposition;
        return {
          durationInFrames: totalDurationFrames(timeline),
          width: COMPOSITION_WIDTH,
          height: COMPOSITION_HEIGHT,
          fps: FPS,
        };
      }}
    />
    <RemotionComposition
      component={SceneComposition}
      durationInFrames={SLOT_MACHINE_TEMPLATE.VideoTrack[0]?.duration ?? 230}
      width={COMPOSITION_WIDTH}
      height={COMPOSITION_HEIGHT}
      fps={FPS}
      id="composition"
      defaultProps={{
        components: SLOT_MACHINE_TEMPLATE.VideoTrack[0]?.components ?? [],
      }}
    />
  </>
);
