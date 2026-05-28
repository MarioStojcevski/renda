import type { VideoComposition } from "../../types/video-composition";

export const deleteScene = ({
  timeline,
  sceneId,
}: {
  timeline: VideoComposition;
  sceneId: string;
}): VideoComposition => ({
  ...timeline,
  VideoTrack: timeline.VideoTrack.filter((scene) => scene.id !== sceneId),
});
