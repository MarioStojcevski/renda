import type { CSSProperties } from "react";

const parsePxNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const isOpacityValue = (a: unknown, b: unknown) => {
  const parse = (v: unknown) => {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
      return Number(v);
    }
    return null;
  };
  const aNum = parse(a);
  const bNum = parse(b);
  return aNum !== null && bNum !== null && aNum >= 0 && aNum <= 1 && bNum >= 0 && bNum <= 1;
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

    if (key === "opacity" || isOpacityValue(a, b)) {
      result[key] = String(aNum + (bNum - aNum) * ratio);
      continue;
    }

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
