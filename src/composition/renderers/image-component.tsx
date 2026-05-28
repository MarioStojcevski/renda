import { Img } from "remotion";

import { resolveRemotionSrc } from "../../lib/remotion-assets";
import type { ImageComponentType } from "../../types/components/image-component";

type Props = ImageComponentType & { remotion?: boolean };

const fitStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const ImageRenderer = ({ src, imageStyles, remotion = true }: Props) => {
  const style = { ...fitStyle, ...imageStyles };
  const resolved = remotion ? resolveRemotionSrc(src) : src;

  if (remotion) {
    return <Img draggable={false} src={resolved} style={style} />;
  }

  return <img draggable={false} src={src} alt="" style={style} />;
};

export default ImageRenderer;
