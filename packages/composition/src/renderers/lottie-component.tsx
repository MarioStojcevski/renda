import { Lottie } from "@remotion/lottie";

import type { LottieComponentType } from "@renda/shared/types/components/lottie-component";

type Props = LottieComponentType & { remotion?: boolean };

const LottieRenderer = ({ animationData, loop, remotion = true }: Props) => {
  if (!animationData) return null;

  if (!remotion) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#71717a",
          fontSize: 12,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 4,
        }}
      >
        Lottie
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default LottieRenderer;
