import type { SceneType } from "../../types/scene";
import type { VideoComposition } from "../../types/video-composition";

export const updateScene = ({
  timeline,
  sceneId,
  patch,
}: {
  timeline: VideoComposition;
  sceneId: string;
  patch: Partial<Pick<SceneType, "duration">>;
}): VideoComposition => ({
  ...timeline,
  VideoTrack: timeline.VideoTrack.map((scene) =>
    scene.id === sceneId ? { ...scene, ...patch } : scene
  ),
});
