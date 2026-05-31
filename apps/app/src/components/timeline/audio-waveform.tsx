import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

import type { AudioSegmentType } from "@renda/shared/types/audio-segment";

type Props = {
  segment: AudioSegmentType;
  height?: number;
};

const AudioWaveform = ({ segment, height = 40 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#3f3f46",
      progressColor: "#2dd4bf",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 1,
      barRadius: 1,
      height,
      normalize: true,
      interact: false,
      hideScrollbar: true,
    });

    waveRef.current = ws;
    ws.load(segment.src);

    return () => {
      ws.destroy();
      waveRef.current = null;
    };
  }, [segment.src, height]);

  return <Box ref={containerRef} w="100%" h={`${height}px`} />;
};

export default AudioWaveform;
