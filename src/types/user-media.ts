export type UserMediaAsset = {
  id: string;
  src: string;
  name: string;
  kind: "image" | "gif" | "audio";
  createdAt: number;
  durationSec?: number;
};
