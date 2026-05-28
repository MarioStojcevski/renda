import { COMPOSITION_HEIGHT, COMPOSITION_WIDTH } from "./video";

export const fullCanvasStyles = {
  position: "absolute" as const,
  left: 0,
  top: 0,
  width: COMPOSITION_WIDTH,
  height: COMPOSITION_HEIGHT,
  zIndex: 0,
};

export const defaultMediaStyles = {
  position: "absolute" as const,
  left: 240,
  top: 160,
  width: 400,
  height: 300,
  zIndex: 2,
};

export const defaultShapeStyles = {
  position: "absolute" as const,
  left: 320,
  top: 240,
  width: 240,
  height: 160,
  zIndex: 1,
};

export const defaultMediaImageStyles = {
  width: "100%",
  height: "100%",
  objectFit: "contain" as const,
};
