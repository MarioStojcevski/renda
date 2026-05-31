import { v4 as uuid } from "uuid";
import type { CSSProperties } from "react";
import type { VideoComposition } from "../../types/video-composition";

const findComponent = (timeline: VideoComposition, componentId: string) => {
  for (const lane of timeline.lanes) {
    const component = lane.components.find((c) => c.id === componentId);
    if (component) return component;
  }
  return null;
};

/** Update layout styles and bake them into a keyframe at the playhead when inside the clip. */
export const editComponent = ({
  timeline,
  componentId,
  divStyles,
  playheadFrame,
}: {
  timeline: VideoComposition;
  componentId: string;
  divStyles: CSSProperties;
  playheadFrame?: number;
}): VideoComposition => {
  const existing = findComponent(timeline, componentId);
  if (!existing) return timeline;

  const sceneFrame =
    playheadFrame !== undefined ? playheadFrame - existing.startFrame : null;

  const inRange =
    sceneFrame !== null &&
    sceneFrame >= 0 &&
    sceneFrame < existing.duration;

  return {
    ...timeline,
    lanes: timeline.lanes.map((lane) => ({
      ...lane,
      components: lane.components.map((c) => {
        if (c.id !== componentId) return c;

        const nextDivStyles = { ...c.divStyles, ...divStyles };

        if (!inRange || sceneFrame === null) {
          return { ...c, divStyles: nextDivStyles };
        }

        const keyframes = [...(c.keyframes ?? [])];
        const idx = keyframes.findIndex((k) => k.frame === sceneFrame);

        if (idx >= 0) {
          keyframes[idx] = {
            ...keyframes[idx],
            divStyles: { ...keyframes[idx].divStyles, ...divStyles },
          };
        } else {
          keyframes.push({
            id: uuid(),
            frame: sceneFrame,
            divStyles: { ...divStyles },
          });
          keyframes.sort((a, b) => a.frame - b.frame);
        }

        return { ...c, divStyles: nextDivStyles, keyframes };
      }),
    })),
  };
};
