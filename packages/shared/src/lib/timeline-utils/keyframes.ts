import type { CSSProperties } from "react";

import { createKeyframeFromStyles } from "../keyframes";
import type { ComponentKeyframe } from "../../types/keyframe";
import type { TimedComponent } from "../../types/timed-component";
import type { VideoComposition } from "../../types/video-composition";

const mapComponent = (
  component: TimedComponent,
  componentId: string,
  updater: (keyframes: ComponentKeyframe[]) => ComponentKeyframe[]
): TimedComponent =>
  component.id === componentId
    ? { ...component, keyframes: updater(component.keyframes ?? []) }
    : component;

export const upsertKeyframe = ({
  timeline,
  componentId,
  keyframe,
}: {
  timeline: VideoComposition;
  componentId: string;
  keyframe: ComponentKeyframe;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) =>
      mapComponent(c, componentId, (list) => {
        const idx = list.findIndex((k) => k.id === keyframe.id);
        if (idx >= 0) {
          const next = [...list];
          next[idx] = keyframe;
          return next;
        }
        return [...list, keyframe].sort((a, b) => a.frame - b.frame);
      })
    ),
  })),
});

export const addKeyframeAtFrame = ({
  timeline,
  componentId,
  frame,
  divStyles,
}: {
  timeline: VideoComposition;
  componentId: string;
  frame: number;
  divStyles: CSSProperties;
}): VideoComposition =>
  upsertKeyframe({
    timeline,
    componentId,
    keyframe: createKeyframeFromStyles(frame, divStyles),
  });

export const removeKeyframe = ({
  timeline,
  componentId,
  keyframeId,
}: {
  timeline: VideoComposition;
  componentId: string;
  keyframeId: string;
}): VideoComposition => ({
  ...timeline,
  lanes: timeline.lanes.map((lane) => ({
    ...lane,
    components: lane.components.map((c) =>
      mapComponent(c, componentId, (list) => list.filter((k) => k.id !== keyframeId))
    ),
  })),
});
