import type { AudioSegmentType } from "./audio-segment";
import type { SceneType } from "./scene";

export type VideoComposition = {
  VideoTrack: SceneType[];
  AudioTrack: AudioSegmentType[];
};
