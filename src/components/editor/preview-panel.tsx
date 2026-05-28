import { Box } from "@chakra-ui/react";
import { Player, type PlayerRef } from "@remotion/player";
import { useCallback, useEffect, useRef, useState } from "react";

import Scenes from "../../composition/scenes";
import { EditableSceneLayer } from "../../composition/scene-composition";
import {
  COMPOSITION_HEIGHT,
  COMPOSITION_WIDTH,
  FPS,
  totalDurationFrames,
} from "../../lib/video";
import { getSceneAtPlayhead } from "../../lib/timeline-math";
import { useTimeline } from "../../providers/timeline";

export default function PreviewPanel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const playheadRef = useRef(0);
  const isPlayingRef = useRef(false);
  const lastPlayerFrameRef = useRef(0);
  const [scale, setScale] = useState(1);

  const {
    timeline,
    playheadFrame,
    selection,
    isPlaying,
    setPlayheadFrame,
    setIsPlaying,
    select,
    editComponent,
  } = useTimeline();

  playheadRef.current = playheadFrame;
  isPlayingRef.current = isPlaying;

  const duration = totalDurationFrames(timeline);
  const sceneCtx = getSceneAtPlayhead(timeline.VideoTrack, playheadFrame);
  const selectedComponentId =
    selection?.kind === "component" ? selection.id : null;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      setScale(
        Math.min(width / COMPOSITION_WIDTH, height / COMPOSITION_HEIGHT)
      );
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.seekTo(playheadRef.current);
      player.play();
      return;
    }
    player.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) return;
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.seekTo(playheadFrame);
  }, [playheadFrame, isPlaying]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
    };

    const onPause = () => {
      isPlayingRef.current = false;
      const frame = Math.round(
        typeof player.getCurrentFrame === "function"
          ? player.getCurrentFrame()
          : lastPlayerFrameRef.current
      );
      lastPlayerFrameRef.current = frame;
      setPlayheadFrame(frame);
    };

    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      const frame = Math.round(e.detail.frame);
      lastPlayerFrameRef.current = frame;
      if (isPlayingRef.current) {
        setPlayheadFrame(frame);
      }
    };

    const onEnded = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    };

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("frameupdate", onFrameUpdate);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("frameupdate", onFrameUpdate);
      player.removeEventListener("ended", onEnded);
    };
  }, [setIsPlaying, setPlayheadFrame]);

  const handleTransform = useCallback(
    (componentId: string, divStyles: React.CSSProperties) => {
      editComponent(componentId, divStyles);
    },
    [editComponent]
  );

  return (
    <Box
      ref={viewportRef}
      flex={1}
      minH={0}
      minW={0}
      position="relative"
      bg="bg.preview"
      borderRadius="panel"
      border="1px solid"
      borderColor="border.divider"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="relative"
        w={`${COMPOSITION_WIDTH}px`}
        h={`${COMPOSITION_HEIGHT}px`}
        flexShrink={0}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Player
          acknowledgeRemotionLicense
          ref={playerRef}
          component={Scenes}
          inputProps={timeline}
          durationInFrames={duration}
          compositionWidth={COMPOSITION_WIDTH}
          compositionHeight={COMPOSITION_HEIGHT}
          fps={FPS}
          controls={false}
          clickToPlay={false}
          style={{
            width: COMPOSITION_WIDTH,
            height: COMPOSITION_HEIGHT,
            opacity: isPlaying ? 1 : 0,
            pointerEvents: "none",
          }}
        />

        {!isPlaying && sceneCtx && (
          <Box
            position="absolute"
            inset={0}
            bg="bg.preview"
            w={`${COMPOSITION_WIDTH}px`}
            h={`${COMPOSITION_HEIGHT}px`}
          >
            <EditableSceneLayer
              components={sceneCtx.scene.components}
              sceneFrame={sceneCtx.sceneLocalFrame}
              selectedId={selectedComponentId}
              interactive
              onSelect={(id) => select({ kind: "component", id })}
              onTransform={handleTransform}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
