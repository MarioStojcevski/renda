import { v4 as uuid } from "uuid";
import type { CSSProperties } from "react";

import { interpolate } from "./interpolate";
import type { ComponentKeyframe } from "../types/keyframe";
import type { TimedComponent } from "../types/timed-component";

export const createKeyframeFromStyles = (
  frame: number,
  styles: CSSProperties
): ComponentKeyframe => ({
  id: uuid(),
  frame,
  divStyles: styles,
});

export const getComponentStyleAtFrame = (
  component: TimedComponent,
  frame: number
): CSSProperties => {
  const kfs = component.keyframes;
  if (!kfs || kfs.length === 0) return component.divStyles;

  const sorted = [...kfs].sort((a, b) => a.frame - b.frame);
  const base = component.divStyles;

  const before = sorted.filter((k) => k.frame <= frame);
  const after = sorted.filter((k) => k.frame > frame);

  const prev = before.at(-1);
  const next = after.at(0);

  if (!prev && !next) return base;
  if (!prev && next) return { ...base, ...next.divStyles };
  if (!next && prev) return { ...base, ...prev.divStyles };

  const startFrame = prev!.frame;
  const endFrame = next!.frame;
  const range = endFrame - startFrame;
  const local = frame - startFrame;
  const ratio = range > 0 ? local / range : 1;

  return {
    ...base,
    ...interpolate(prev!.divStyles, next!.divStyles, ratio),
  };
};
