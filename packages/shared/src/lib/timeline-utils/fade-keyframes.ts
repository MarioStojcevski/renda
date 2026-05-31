import { v4 as uuid } from "uuid";

import type { ComponentKeyframe } from "../../types/keyframe";
import type { TimedComponent } from "../../types/timed-component";
import { FPS } from "../video";

export const FADE_DURATION_FRAMES = Math.round(FPS * 0.3);

const parseOpacity = (value: unknown): number | null => {
  if (value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const hasFadeIn = (component: TimedComponent): boolean => {
  const keyframes = [...(component.keyframes ?? [])].sort((a, b) => a.frame - b.frame);
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = parseOpacity(keyframes[i].divStyles?.opacity);
    const b = parseOpacity(keyframes[i + 1].divStyles?.opacity);
    if (a === 0 && b === 1 && keyframes[i].frame <= FADE_DURATION_FRAMES) return true;
  }
  return false;
};

export const hasFadeOut = (component: TimedComponent): boolean => {
  const keyframes = [...(component.keyframes ?? [])].sort((a, b) => a.frame - b.frame);
  const fadeStart = Math.max(0, component.duration - FADE_DURATION_FRAMES);
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = parseOpacity(keyframes[i].divStyles?.opacity);
    const b = parseOpacity(keyframes[i + 1].divStyles?.opacity);
    if (a === 1 && b === 0 && keyframes[i].frame >= fadeStart) return true;
  }
  return false;
};

export const buildFadeInKeyframes = (component: TimedComponent): ComponentKeyframe[] => {
  const start = 0;
  const end = FADE_DURATION_FRAMES;
  const existing = component.keyframes ?? [];
  const filtered = existing.filter((k) => k.frame < start || k.frame > end);
  return [
    ...filtered,
    { id: uuid(), frame: start, divStyles: { opacity: "0" } },
    { id: uuid(), frame: end, divStyles: { opacity: "1" } },
  ].sort((a, b) => a.frame - b.frame);
};

export const buildFadeOutKeyframes = (component: TimedComponent): ComponentKeyframe[] => {
  const end = component.duration;
  const start = Math.max(0, end - FADE_DURATION_FRAMES);
  const existing = component.keyframes ?? [];
  const filtered = existing.filter((k) => k.frame < start || k.frame > end);
  return [
    ...filtered,
    { id: uuid(), frame: start, divStyles: { opacity: "1" } },
    { id: uuid(), frame: Math.max(0, end - 1), divStyles: { opacity: "0" } },
  ].sort((a, b) => a.frame - b.frame);
};

export const clearFadeIn = (component: TimedComponent): ComponentKeyframe[] => {
  const end = FADE_DURATION_FRAMES;
  return (component.keyframes ?? []).filter((k) => {
    if (k.frame > end) return true;
    const opacity = parseOpacity(k.divStyles?.opacity);
    return opacity === null;
  });
};

export const clearFadeOut = (component: TimedComponent): ComponentKeyframe[] => {
  const start = Math.max(0, component.duration - FADE_DURATION_FRAMES);
  return (component.keyframes ?? []).filter((k) => {
    if (k.frame < start) return true;
    const opacity = parseOpacity(k.divStyles?.opacity);
    return opacity === null;
  });
};
