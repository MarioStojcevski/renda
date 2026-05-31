import React from "react";
import {
  AbsoluteFill,
  Audio as RemotionAudioRaw,
  useCurrentFrame,
} from "remotion";

import { getActiveComponent } from "@renda/shared/lib/video";
import type { VideoComposition } from "@renda/shared/types/video-composition";
import { SceneCompositionInner } from "./scene-composition";

const RemotionAudio = RemotionAudioRaw as unknown as React.FC<{
  src: string;
  startFrom?: number;
  endAt?: number;
}>;

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

          return (
            <AbsoluteFill key={lane.id} style={{ zIndex: laneIndex }}>
              <SceneCompositionInner
                components={[component]}
                sceneFrame={sceneFrame}
              />
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
