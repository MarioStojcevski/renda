import type { SceneComponentType } from "../../types/scene-component";
import type { VideoComposition } from "../../types/video-composition";

export const patchComponent = ({
  timeline,
  componentId,
  patch,
}: {
  timeline: VideoComposition;
  componentId: string;
  patch: Partial<SceneComponentType>;
}): VideoComposition => ({
  ...timeline,
  VideoTrack: timeline.VideoTrack.map((scene) => ({
    ...scene,
    components: scene.components.map((component) =>
      component.id === componentId
        ? ({ ...component, ...patch } as SceneComponentType)
        : component
    ),
  })),
});
