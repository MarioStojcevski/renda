import React from "react";
import {
  AbsoluteFill,
  Audio as RemotionAudioRaw,
  Sequence,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { VideoComposition } from "@renda/shared/types/video-composition";
import { SceneComposition } from "./scene-composition";

const RemotionAudio = RemotionAudioRaw as unknown as React.FC<{
  src: string;
  startFrom?: number;
  endAt?: number;
}>;

const SlideIn = ({ children }: { children: React.ReactNode }) => {
  const { fps, width } = useVideoConfig();
  const progress = spring({ fps, frame: useCurrentFrame(), config: { mass: 0.5, damping: 200 } });
  const x = interpolate(progress, [0, 1], [-width, 0]);
  return (
    <AbsoluteFill
      style={{
        left: x,
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Scenes = ({ VideoTrack, AudioTrack }: VideoComposition) => (
  <>
    <Series>
      {VideoTrack.map((scene) => (
        <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
          <SlideIn>
            <SceneComposition components={scene.components} />
          </SlideIn>
        </Series.Sequence>
      ))}
    </Series>

    <AbsoluteFill>
      {AudioTrack.map((segment) => (
        <Sequence key={segment.id} from={segment.from}>
          <RemotionAudio
            src={segment.src}
            startFrom={segment.startFrame}
            endAt={segment.endFrame}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  </>
);

export default Scenes;
