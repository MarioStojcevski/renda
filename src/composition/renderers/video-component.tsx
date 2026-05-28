import { OffthreadVideo } from "remotion";

import { resolveRemotionSrc } from "../../lib/remotion-assets";
import type { VideoComponentType } from "../../types/components/video-component";

type Props = VideoComponentType & { remotion?: boolean };

const fitStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const VideoRenderer = ({ src, videoStyles, remotion = true }: Props) => {
  const style = { ...fitStyle, ...videoStyles };
  const resolved = remotion ? resolveRemotionSrc(src) : src;

  if (remotion) {
    return <OffthreadVideo src={resolved} style={style} />;
  }

  return <video src={src} muted playsInline style={style} />;
};

export default VideoRenderer;
