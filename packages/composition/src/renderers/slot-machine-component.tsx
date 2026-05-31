import { Img, interpolate } from "remotion";

import { easeOutQuart, interpolateFrame } from "@renda/shared/lib/interpolate";
import { resolveRemotionSrc } from "../lib/remotion-assets";
import type { SlotMachineComponentType } from "@renda/shared/types/components/slot-machine-component";

type Props = SlotMachineComponentType & {
  frame: number;
  /** When false, use plain DOM (editor overlay outside Player). */
  remotion?: boolean;
};

const mediaStyle: React.CSSProperties = {
  maxHeight: "85%",
  maxWidth: "85%",
  objectFit: "contain",
};

const SlotMachineRenderer = ({
  logos,
  finalIndex,
  stopAtFrame,
  extraSpins = 4,
  frame,
  remotion = true,
}: Props) => {
  const sources = remotion ? logos.map(resolveRemotionSrc) : logos;
  const n = sources.length;  const totalDistance = (extraSpins * n + finalIndex) * 100;

  const offsetPct = remotion
    ? interpolate(frame, [0, stopAtFrame], [0, totalDistance], {
        easing: easeOutQuart,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolateFrame(frame, [0, stopAtFrame], [0, totalDistance], easeOutQuart);

  const translatePct = -(offsetPct % (n * 100));
  const repeats = extraSpins + 2;

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${translatePct}%)`,
          willChange: "transform",
        }}
      >
        {Array.from({ length: repeats * n }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {remotion ? (
              <Img draggable={false} src={sources[i % n]} style={mediaStyle} />
            ) : (
              <img draggable={false} src={sources[i % n]} alt="" style={mediaStyle} />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.85) 100%)",
        }}
      />
    </div>
  );
};

export default SlotMachineRenderer;
