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
import { DEFAULT_TEMPLATE } from "./templates/default-template";

const allComponents = DEFAULT_TEMPLATE.lanes.flatMap((l) => l.components);

export const RemotionRoot = () => (
  <>
    <RemotionComposition
      component={Scenes}
      id="scenes"
      defaultProps={DEFAULT_TEMPLATE}
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
      durationInFrames={totalDurationFrames(DEFAULT_TEMPLATE)}
      width={COMPOSITION_WIDTH}
      height={COMPOSITION_HEIGHT}
      fps={FPS}
      id="composition"
      defaultProps={{
        components: allComponents,
      }}
    />
  </>
);
