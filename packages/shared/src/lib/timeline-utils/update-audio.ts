import type { AudioSegmentType } from "../../types/audio-segment";
import type { VideoComposition } from "../../types/video-composition";

export const updateAudio = ({
  timeline,
  audioId,
  patch,
}: {
  timeline: VideoComposition;
  audioId: string;
  patch: Partial<Pick<AudioSegmentType, "from" | "startFrame" | "endFrame" | "src">>;
}): VideoComposition => ({
  ...timeline,
  AudioTrack: timeline.AudioTrack.map((segment) =>
    segment.id === audioId ? { ...segment, ...patch } : segment
  ),
});

export const removeAudio = ({
  timeline,
  audioId,
}: {
  timeline: VideoComposition;
  audioId: string;
}): VideoComposition => ({
  ...timeline,
  AudioTrack: timeline.AudioTrack.filter((s) => s.id !== audioId),
});
