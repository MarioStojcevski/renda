import type { CSSProperties } from "react";

import type { ComponentKeyframe } from "../types/keyframe";
import type { SceneComponentType } from "../types/scene-component";

const NUMERIC_PROPS = [
  "left",
  "top",
  "width",
  "height",
  "opacity",
  "rotate",
] as const;

type NumericProp = (typeof NUMERIC_PROPS)[number];

const parsePx = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

const readNumeric = (styles: CSSProperties, prop: NumericProp): number | undefined => {
  if (prop === "rotate") {
    const transform = styles.transform ?? "";
    const match = /rotate\(([-\d.]+)deg\)/.exec(transform);
    return match ? parseFloat(match[1]) : 0;
  }
  return parsePx(styles[prop]);
};

const writeNumeric = (
  styles: CSSProperties,
  prop: NumericProp,
  value: number
): CSSProperties => {
  if (prop === "rotate") {
    return { ...styles, transform: `rotate(${value}deg)` };
  }
  return { ...styles, [prop]: value };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const getComponentStyleAtFrame = (
  component: SceneComponentType,
  sceneFrame: number
): CSSProperties => {
  const base = component.divStyles ?? {};
  const keyframes = component.keyframes ?? [];
  if (keyframes.length === 0) return base;

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  const before = sorted.filter((k) => k.frame <= sceneFrame).at(-1);
  const after = sorted.find((k) => k.frame > sceneFrame);

  if (!before) return { ...base, ...after?.divStyles };
  if (!after || before.frame === after.frame) return { ...base, ...before.divStyles };

  const t = (sceneFrame - before.frame) / (after.frame - before.frame);
  let result: CSSProperties = { ...base, ...before.divStyles };

  for (const prop of NUMERIC_PROPS) {
    const v0 = readNumeric(before.divStyles, prop);
    const v1 = readNumeric(after.divStyles, prop);
    if (v0 !== undefined && v1 !== undefined) {
      result = writeNumeric(result, prop, lerp(v0, v1, t));
    }
  }

  return result;
};

export const createKeyframeFromStyles = (
  frame: number,
  divStyles: CSSProperties
): ComponentKeyframe => ({
  id: `kf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  frame,
  divStyles: { ...divStyles },
});
