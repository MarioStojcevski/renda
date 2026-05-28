import type { SceneComponentType } from "./scene-component";

export type SceneType = {
  id: string;
  type: "Scene";
  duration: number;
  components: SceneComponentType[];
};
