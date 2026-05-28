import { findSceneIdAtFrame } from "../video";
import type { SceneComponentType } from "../../types/scene-component";
import type { VideoComposition } from "../../types/video-composition";

const insertComponent = (
  components: SceneComponentType[],
  component: SceneComponentType
): SceneComponentType[] => {
  if (component.type === "Background") {
    const rest = components.filter((c) => c.type !== "Background");
    return [component, ...rest];
  }
  return [...components, component];
};

export const addComponent = ({
  timeline,
  component,
  frame,
}: {
  timeline: VideoComposition;
  component: SceneComponentType;
  frame: number;
}): VideoComposition => {
  const sceneId = findSceneIdAtFrame(timeline.VideoTrack, frame);
  if (!sceneId) return timeline;

  return {
    ...timeline,
    VideoTrack: timeline.VideoTrack.map((scene) =>
      scene.id === sceneId
        ? { ...scene, components: insertComponent(scene.components, component) }
        : scene
    ),
  };
};
