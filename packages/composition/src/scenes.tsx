import React from "react";
import {
  AbsoluteFill,
  Audio as RemotionAudioRaw,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { getActiveComponent } from "@renda/shared/lib/video";
import type { VideoComposition } from "@renda/shared/types/video-composition";
import { SceneCompositionInner } from "./scene-composition";

const RemotionAudio = RemotionAudioRaw as unknown as React.FC<{
  src: string;
  startFrom?: number;
  endAt?: number;
}>;

const SlideIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { mass: 0.5, damping: 200 },
  });
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

const Scenes = ({ lanes }: VideoComposition) => {
  const frame = useCurrentFrame();

  return (
    <>
      {lanes
        .filter((l) => l.type === "video")
        .map((lane, laneIndex) => {
          const component = getActiveComponent(lane, frame);
          if (!component) return null;

          const sceneFrame = frame - component.startFrame;
          const delay = component.startFrame;

          return (
            <AbsoluteFill key={lane.id} style={{ zIndex: laneIndex }}>
              <SlideIn delay={delay}>
                <SceneCompositionInner
                  components={[component]}
                  sceneFrame={sceneFrame}
                />
              </SlideIn>
            </AbsoluteFill>
          );
        })}

      {lanes
        .filter((l) => l.type === "audio")
        .map((lane) => {
          const component = getActiveComponent(lane, frame);
          if (!component) return null;
          if (!("src" in component) || typeof component.src !== "string") return null;

          return (
            <RemotionAudio
              key={component.id}
              src={component.src}
              startFrom={component.sourceStartFrame ?? 0}
              endAt={component.sourceEndFrame ?? component.duration}
            />
          );
        })}
    </>
  );
};

export default Scenes;
