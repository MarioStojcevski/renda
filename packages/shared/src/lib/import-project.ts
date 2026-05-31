import type { VideoComposition } from "../types/video-composition";

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export const parseVideoComposition = (raw: unknown): VideoComposition | null => {
  if (!isRecord(raw)) return null;
  if (!Array.isArray(raw.lanes)) return null;
  return raw as VideoComposition;
};

export const readProjectFile = async (file: File): Promise<VideoComposition | null> => {
  const text = await file.text();
  try {
    return parseVideoComposition(JSON.parse(text));
  } catch {
    return null;
  }
};
