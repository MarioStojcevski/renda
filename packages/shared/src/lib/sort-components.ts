import type { SceneComponentType } from "../types/scene-component";

const zIndex = (c: SceneComponentType) => {
  const z = c.divStyles?.zIndex;
  if (typeof z === "number") return z;
  if (c.type === "Background") return 0;
  return 1;
};

/** Backgrounds first, then ascending z-index. */
export const sortComponentsForRender = (
  components: SceneComponentType[]
): SceneComponentType[] =>
  [...components].sort((a, b) => {
    if (a.type === "Background" && b.type !== "Background") return -1;
    if (b.type === "Background" && a.type !== "Background") return 1;
    return zIndex(a) - zIndex(b);
  });
