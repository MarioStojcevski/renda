import { staticFile } from "remotion";

/** Resolve editor / public paths for Remotion CLI render. */
export const resolveRemotionSrc = (src: string): string => {
  if (!src || src.startsWith("blob:") || src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  if (src.startsWith("/")) {
    return staticFile(src.slice(1));
  }
  return staticFile(src);
};
