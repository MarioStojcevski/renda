import type { CSSProperties } from "react";

/** Frame interpolation without Remotion context (safe in editor overlay). */
export const interpolateFrame = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: (t: number) => number = (t) => t
): number => {
  const [in0, in1] = inputRange;
  const [out0, out1] = outputRange;
  if (frame <= in0) return out0;
  if (frame >= in1) return out1;
  const t = easing((frame - in0) / (in1 - in0));
  return out0 + (out1 - out0) * t;
};

export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const parsePxNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

/** Interpolate between two CSSProperties objects by ratio (0-1). */
export const interpolate = (
  from: CSSProperties,
  to: CSSProperties,
  ratio: number
): CSSProperties => {
  const result: Record<string, unknown> = {};

  const allKeys = new Set([...Object.keys(from), ...Object.keys(to)]);

  for (const key of allKeys) {
    const a = (from as Record<string, unknown>)[key];
    const b = (to as Record<string, unknown>)[key];
    if (a === undefined) { result[key] = b; continue; }
    if (b === undefined) { result[key] = a; continue; }

    const aNum = parsePxNum(a);
    const bNum = parsePxNum(b);

    if (typeof a === "string" && typeof b === "string") {
      if (a.includes("px") || b.includes("px")) {
        const interp = aNum + (bNum - aNum) * ratio;
        result[key] = `${interp}px`;
      } else {
        result[key] = ratio < 0.5 ? a : b;
      }
    } else if (typeof a === "number" || typeof b === "number") {
      result[key] = aNum + (bNum - aNum) * ratio;
    } else {
      result[key] = b;
    }
  }

  return result as CSSProperties;
};
