import type { CSSProperties } from "react";

import type { VideoComposition } from "../../types/video-composition";

export const editComponent = ({
  timeline,
  componentId,
  divStyles,
}: {
  timeline: VideoComposition;
  componentId: string;
  divStyles: CSSProperties;
}): VideoComposition => ({
  ...timeline,
  VideoTrack: timeline.VideoTrack.map((scene) => ({
    ...scene,
    components: scene.components.map((component) =>
      component.id === componentId
        ? { ...component, divStyles: { ...component.divStyles, ...divStyles } }
        : component
    ),
  })),
});
