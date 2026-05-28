import { Gif } from "@remotion/gif";

import { resolveRemotionSrc } from "../../lib/remotion-assets";
import type { GifComponentType } from "../../types/components/gif-component";

type Props = GifComponentType & { remotion?: boolean };

const fitStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "contain" };

const GifRenderer = ({ src, remotion = true }: Props) => {
  const resolved = remotion ? resolveRemotionSrc(src) : src;

  if (remotion) {
    return <Gif src={resolved} width={undefined} height={undefined} style={fitStyle} />;
  }

  return <img src={src} alt="" style={fitStyle} />;
};

export default GifRenderer;
