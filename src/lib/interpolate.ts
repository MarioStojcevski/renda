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
