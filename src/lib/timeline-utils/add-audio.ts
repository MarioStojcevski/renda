import { v4 as uuid } from "uuid";

import { secondsToFrames } from "../timeline-math";
import type { AudioSegmentType } from "../../types/audio-segment";
import type { VideoComposition } from "../../types/video-composition";

const DEFAULT_AUDIO_DURATION_SEC = 5;

export const addAudio = ({
  timeline,
  src,
  atFrame = 0,
  durationSec = DEFAULT_AUDIO_DURATION_SEC,
}: {
  timeline: VideoComposition;
  src: string;
  atFrame?: number;
  durationSec?: number;
}): VideoComposition => {
  const durationFrames = secondsToFrames(durationSec);
  const segment: AudioSegmentType = {
    id: uuid(),
    type: "Audio",
    from: atFrame,
    startFrame: 0,
    endFrame: durationFrames,
    src,
  };

  return {
    ...timeline,
    AudioTrack: [...timeline.AudioTrack, segment],
  };
};
