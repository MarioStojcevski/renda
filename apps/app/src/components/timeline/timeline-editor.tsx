import {
  Box,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import { defaultMediaStyles, defaultMediaImageStyles } from "@renda/shared/lib/component-defaults";
import { secondsToFrames, getPxPerFrame, timelineWidthPx } from "@renda/shared/lib/timeline-math";
import { FPS, totalDurationFrames } from "@renda/shared/lib/video";
import type { TimedComponent } from "@renda/shared/types/timed-component";
import type { UserMediaAsset } from "@renda/shared/types/user-media";
import { useTimeline } from "../../providers/timeline";
import AudioWaveform from "./audio-waveform";

const RULER_HEIGHT = 28;
const LANE_HEIGHT = 52;
const LABEL_WIDTH = 72;
const TRIM_HANDLE_WIDTH = 5;
const EXTRA_SECONDS = 10;

const TYPE_COLORS: Record<string, string> = {
  Background: "gray.600",
  SlotMachine: "teal.600",
  Shape: "purple.600",
  Video: "blue.600",
  Image: "green.600",
  Gif: "cyan.600",
  Lottie: "pink.600",
  Text: "amber.600",
};

type DragState = {
  type: "move" | "trimStart" | "trimEnd";
  componentId: string;
  laneId: string;
  startClientX: number;
  startFrame: number;
  startDuration: number;
  startSourceStartFrame: number;
};

const FADE_DURATION = Math.round(FPS * 0.3);

const ComponentBlock = ({
  component,
  leftPx,
  widthPx,
  selected,
  onMouseDown,
  onTrimStartMouseDown,
  onTrimEndMouseDown,
  onFadeIn,
  onFadeOut,
}: {
  component: TimedComponent;
  leftPx: number;
  widthPx: number;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTrimStartMouseDown: (e: React.MouseEvent) => void;
  onTrimEndMouseDown: (e: React.MouseEvent) => void;
  onFadeIn: () => void;
  onFadeOut: () => void;
}) => (
  <Box
    position="absolute"
    left={`${leftPx}px`}
    w={`${Math.max(widthPx, 20)}px`}
    h="36px"
    top="8px"
    bg={TYPE_COLORS[component.type] ?? "gray.500"}
    border="1px solid"
    borderColor={selected ? "teal.300" : "rgba(255,255,255,0.15)"}
    borderRadius="md"
    cursor="grab"
    display="flex"
    alignItems="center"
    justifyContent="center"
    onMouseDown={onMouseDown}
    userSelect="none"
    _hover={{
      "& .trim-handle": { opacity: 1 },
      "& .fade-handle": { opacity: 1 },
    }}
    zIndex={selected ? 2 : 1}
  >
    <Text fontSize="xs" fontWeight="medium" color="white" noOfLines={1} px={1}>
      {component.type}
    </Text>

    {/* Trim handles */}
    <Box
      className="trim-handle"
      position="absolute"
      left="-2px"
      top={0}
      bottom={0}
      w={`${TRIM_HANDLE_WIDTH}px`}
      bg="teal.300"
      borderRadius="sm"
      opacity={0}
      cursor="col-resize"
      transition="opacity 0.1s"
      onMouseDown={(e) => {
        e.stopPropagation();
        onTrimStartMouseDown(e);
      }}
    />
    <Box
      className="trim-handle"
      position="absolute"
      right="-2px"
      top={0}
      bottom={0}
      w={`${TRIM_HANDLE_WIDTH}px`}
      bg="teal.300"
      borderRadius="sm"
      opacity={0}
      cursor="col-resize"
      transition="opacity 0.1s"
      onMouseDown={(e) => {
        e.stopPropagation();
        onTrimEndMouseDown(e);
      }}
    />

    {/* Fade in (top-left) */}
    <Box
      className="fade-handle"
      position="absolute"
      top="-1px"
      left="-1px"
      w="14px"
      h="12px"
      opacity={0}
      cursor="pointer"
      transition="opacity 0.1s"
      title="Fade in"
      onClick={(e) => { e.stopPropagation(); onFadeIn(); }}
    >
      <Box
        w={0} h={0}
        borderLeft="14px solid rgba(45,212,191,0.8)"
        borderBottom="12px solid transparent"
      />
      <Text position="absolute" top="-1px" left="2px" fontSize="8px" color="white" fontWeight="bold">F</Text>
    </Box>

    {/* Fade out (top-right) */}
    <Box
      className="fade-handle"
      position="absolute"
      top="-1px"
      right="-1px"
      w="14px"
      h="12px"
      opacity={0}
      cursor="pointer"
      transition="opacity 0.1s"
      title="Fade out"
      onClick={(e) => { e.stopPropagation(); onFadeOut(); }}
    >
      <Box
        w={0} h={0}
        borderRight="14px solid rgba(45,212,191,0.8)"
        borderBottom="12px solid transparent"
        position="absolute"
        right={0}
      />
      <Text position="absolute" top="-1px" right="2px" fontSize="8px" color="white" fontWeight="bold">F</Text>
    </Box>
  </Box>
);

type Props = {
  zoom?: number;
};

const TimelineEditor = ({ zoom = 1 }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRuler = useRef(false);
  const dragState = useRef<DragState | null>(null);
  const [hoverFrame, setHoverFrame] = useState<number | null>(null);

  const {
    timeline,
    playheadFrame,
    selection,
    setPlayheadFrame,
    select,
    moveComponent,
    addComponent,
    addKeyframe,
    patchComponent,
    trimComponentStart,
    trimComponentEnd,
    removeComponent,
  } = useTimeline();

  const totalFrames = totalDurationFrames(timeline);
  const pxPerFrame = getPxPerFrame(zoom);
  const paddedFrames = totalFrames + FPS * EXTRA_SECONDS;
  const widthPx = timelineWidthPx(paddedFrames, pxPerFrame);

  const frameFromClientX = useCallback(
    (clientX: number) => {
      const el = scrollRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left + el.scrollLeft;
      return Math.max(0, Math.min(totalFrames - 1, Math.round(x / pxPerFrame)));
    },
    [totalFrames, pxPerFrame]
  );

  const seekFromClientX = useCallback(
    (clientX: number) => {
      setPlayheadFrame(frameFromClientX(clientX));
    },
    [frameFromClientX, setPlayheadFrame]
  );

  const findLaneAtY = useCallback(
    (clientY: number): string | null => {
      const el = scrollRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const y = clientY - rect.top;
      const laneIndex = Math.floor(y / LANE_HEIGHT);
      if (laneIndex < 0 || laneIndex >= timeline.lanes.length) return null;
      return timeline.lanes[laneIndex].id;
    },
    [timeline.lanes]
  );

  const handleRulerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRuler.current = true;
      seekFromClientX(e.clientX);
    },
    [seekFromClientX]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRuler.current) {
        seekFromClientX(e.clientX);
        return;
      }

      const drag = dragState.current;
      if (!drag) return;

      const delta = Math.round((e.clientX - drag.startClientX) / pxPerFrame);

      if (drag.type === "move") {
        const newStart = Math.max(0, drag.startFrame + delta);
        moveComponent(drag.componentId, newStart);
      } else if (drag.type === "trimStart") {
        const deltaFrames = Math.round((e.clientX - drag.startClientX) / pxPerFrame);
        if (deltaFrames !== 0) {
          trimComponentStart(drag.componentId, deltaFrames);
          dragState.current = {
            ...drag,
            startClientX: e.clientX,
            startFrame: drag.startFrame + deltaFrames,
            startDuration: drag.startDuration - deltaFrames,
            startSourceStartFrame: drag.startSourceStartFrame + deltaFrames,
          };
        }
      } else if (drag.type === "trimEnd") {
        const deltaFrames = Math.round((e.clientX - drag.startClientX) / pxPerFrame);
        if (deltaFrames !== 0) {
          trimComponentEnd(drag.componentId, deltaFrames);
          dragState.current = {
            ...drag,
            startClientX: e.clientX,
            startDuration: drag.startDuration + deltaFrames,
          };
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingRuler.current = false;
      dragState.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pxPerFrame, seekFromClientX, moveComponent, trimComponentStart, trimComponentEnd]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDraggingRuler.current || dragState.current) return;
      setHoverFrame(frameFromClientX(e.clientX));
    },
    [frameFromClientX]
  );

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRuler.current) return;
    setHoverFrame(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.shiftKey) {
      el.scrollLeft += e.deltaY;
    } else {
      el.scrollLeft += e.deltaX;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;
      let asset: UserMediaAsset;
      try { asset = JSON.parse(raw); } catch { return; }

      const frame = frameFromClientX(e.clientX);
      const laneId = findLaneAtY(e.clientY);
      if (!laneId) return;

      const durationFrames = secondsToFrames(asset.durationSec ?? 5);

      if (asset.kind === "audio") {
        addComponent({
          id: uuid(),
          type: "Video",
          src: asset.src,
          animation: "",
          startFrame: frame,
          duration: durationFrames,
          divStyles: { ...defaultMediaStyles },
        }, laneId);
        return;
      }

      if (asset.kind === "gif") {
        addComponent({
          id: uuid(),
          type: "Gif",
          src: asset.src,
          startFrame: frame,
          duration: durationFrames,
          divStyles: { ...defaultMediaStyles },
        }, laneId);
        return;
      }

      addComponent({
        id: uuid(),
        type: "Image",
        animation: "",
        src: asset.src,
        name: asset.name,
        startFrame: frame,
        duration: durationFrames,
        divStyles: { ...defaultMediaStyles },
        imageStyles: { ...defaultMediaImageStyles },
      }, laneId);
    },
    [addComponent, frameFromClientX, findLaneAtY]
  );

  const handleComponentDragStart = useCallback(
    (componentId: string, laneId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      select({ kind: "component", id: componentId });

      const lane = timeline.lanes.find((l) => l.id === laneId);
      const component = lane?.components.find((c) => c.id === componentId);
      if (!component) return;

      dragState.current = {
        type: "move",
        componentId,
        laneId,
        startClientX: e.clientX,
        startFrame: component.startFrame,
        startDuration: component.duration,
        startSourceStartFrame: component.sourceStartFrame ?? 0,
      };
    },
    [timeline.lanes, select]
  );

  const handleTrimStartDragStart = useCallback(
    (componentId: string, laneId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const lane = timeline.lanes.find((l) => l.id === laneId);
      const component = lane?.components.find((c) => c.id === componentId);
      if (!component) return;

      dragState.current = {
        type: "trimStart",
        componentId,
        laneId,
        startClientX: e.clientX,
        startFrame: component.startFrame,
        startDuration: component.duration,
        startSourceStartFrame: component.sourceStartFrame ?? 0,
      };
    },
    [timeline.lanes]
  );

  const handleFadeIn = useCallback(
    (componentId: string) => {
      const fadeDuration = FADE_DURATION;
      const lane = timeline.lanes.find((l) =>
        l.components.some((c) => c.id === componentId)
      );
      const component = lane?.components.find((c) => c.id === componentId);
      if (!component) return;

      const start = component.startFrame;
      const existing = component.keyframes ?? [];
      const filtered = existing.filter(
        (k) => k.frame < start || k.frame > start + fadeDuration
      );
      patchComponent(componentId, {
        keyframes: [
          ...filtered,
          { id: uuid(), frame: start, divStyles: { opacity: "0" } },
          { id: uuid(), frame: start + fadeDuration, divStyles: { opacity: "1" } },
        ].sort((a, b) => a.frame - b.frame),
      });
    },
    [timeline.lanes, patchComponent]
  );

  const handleFadeOut = useCallback(
    (componentId: string) => {
      const fadeDuration = FADE_DURATION;
      const lane = timeline.lanes.find((l) =>
        l.components.some((c) => c.id === componentId)
      );
      const component = lane?.components.find((c) => c.id === componentId);
      if (!component) return;

      const end = component.startFrame + component.duration;
      const start = end - fadeDuration;
      const existing = component.keyframes ?? [];
      const filtered = existing.filter(
        (k) => k.frame < start || k.frame > end
      );
      patchComponent(componentId, {
        keyframes: [
          ...filtered,
          { id: uuid(), frame: start, divStyles: { opacity: "1" } },
          { id: uuid(), frame: end, divStyles: { opacity: "0" } },
        ].sort((a, b) => a.frame - b.frame),
      });
    },
    [timeline.lanes, patchComponent]
  );

  const handleTrimEndDragStart = useCallback(
    (componentId: string, laneId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const lane = timeline.lanes.find((l) => l.id === laneId);
      const component = lane?.components.find((c) => c.id === componentId);
      if (!component) return;

      dragState.current = {
        type: "trimEnd",
        componentId,
        laneId,
        startClientX: e.clientX,
        startFrame: component.startFrame,
        startDuration: component.duration,
        startSourceStartFrame: component.sourceStartFrame ?? 0,
      };
    },
    [timeline.lanes]
  );

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.divider"
      borderRadius="panel"
      overflow="hidden"
      flex={1}
      minH={0}
      display="flex"
      flexDirection="column"
    >
      <Flex px={3} py={2} align="center" borderBottom="1px solid" borderColor="border.subtle">
        <Text fontSize="xs" fontWeight="semibold" color="text.muted" textTransform="uppercase" letterSpacing="wider">
          Timeline
        </Text>
      </Flex>

      <Box ref={scrollRef} flex={1} overflow="auto" position="relative" onWheel={handleWheel} onDragOver={handleDragOver} onDrop={handleDrop} sx={{
        overscrollBehaviorX: "contain",
        "&::-webkit-scrollbar": { width: "6px", height: "6px" },
        "&::-webkit-scrollbar-track": { bg: "transparent" },
        "&::-webkit-scrollbar-thumb": { bg: "border.subtle", borderRadius: "3px" },
      }}>
        <Box position="relative" minH={`${RULER_HEIGHT + timeline.lanes.length * LANE_HEIGHT}px`}>
          {/* Ruler */}
          <Flex
            h={`${RULER_HEIGHT}px`}
            borderBottom="1px solid"
            borderColor="border.subtle"
            position="sticky"
            top={0}
            bg="bg.surface"
            zIndex={3}
            onMouseDown={handleRulerMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: Math.ceil(paddedFrames / FPS) + 1 }).map((_, sec) => (
              <Box
                key={sec}
                position="absolute"
                left={`${sec * FPS * pxPerFrame}px`}
                h="100%"
                borderLeft="1px solid"
                borderColor="border.subtle"
                pl={1}
              >
                <Text fontSize="10px" color="text.muted">
                  {sec}s
                </Text>
              </Box>
            ))}
          </Flex>

          {/* Ghost pinhead */}
          {hoverFrame != null && (
            <Box
              position="absolute"
              top={`${RULER_HEIGHT}px`}
              bottom={0}
              left={`${hoverFrame * pxPerFrame}px`}
              w="2px"
              bg="teal.400"
              zIndex={2}
              pointerEvents="none"
              opacity={0.35}
            />
          )}

          {/* Playhead */}
          <Box
            position="absolute"
            top={`${RULER_HEIGHT}px`}
            bottom={0}
            left={`${playheadFrame * pxPerFrame}px`}
            w="2px"
            bg="teal.400"
            zIndex={3}
            pointerEvents="none"
          />

          {/* Lane rows with sticky labels */}
          {timeline.lanes.map((lane) => {
            const isAudio = lane.type === "audio";

            return (
              <Flex
                key={lane.id}
                h={`${LANE_HEIGHT}px`}
                align="center"
                position="relative"
                borderBottom="1px solid"
                borderColor="border.subtle"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) {
                    select({ kind: "lane", id: lane.id });
                    seekFromClientX(e.clientX);
                  }
                }}
                onMouseMove={(e) => setHoverFrame(frameFromClientX(e.clientX))}
                onMouseLeave={() => setHoverFrame(null)}
              >
                {/* Lane label sticky left */}
                <Flex
                  position="sticky"
                  left={0}
                  w={`${LABEL_WIDTH}px`}
                  h="100%"
                  align="center"
                  px={2}
                  bg="bg.surface"
                  borderRight="1px solid"
                  borderColor="border.subtle"
                  zIndex={1}
                  flexShrink={0}
                >
                  <Text fontSize="xs" color="text.muted" noOfLines={1}>
                    {lane.name}
                  </Text>
                </Flex>

                {/* Lane content area */}
                <Box position="relative" flex={1} h="100%" minW={`${widthPx}px`}>
                  {lane.components.map((component) => {
                    const leftPx = component.startFrame * pxPerFrame;
                    const wPx = component.duration * pxPerFrame;
                    const isSelected = selection?.kind === "component" && selection.id === component.id;

                    if (isAudio) {
                      return (
                        <Box
                          key={component.id}
                          position="absolute"
                          left={`${leftPx}px`}
                          w={`${Math.max(wPx, 40)}px`}
                          h="40px"
                          top="6px"
                          bg={isSelected ? "teal.800" : "bg.subtle"}
                          border="1px solid"
                          borderColor={isSelected ? "teal.400" : "border.subtle"}
                          borderRadius="control"
                          overflow="hidden"
                          cursor="pointer"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            select({ kind: "component", id: component.id });
                            setPlayheadFrame(component.startFrame);
                          }}
                        >
                          <AudioWaveform component={component} height={38} />
                          <IconButton
                            aria-label="Remove"
                            icon={<DeleteIcon boxSize={2.5} />}
                            size="xs"
                            variant="ghost"
                            position="absolute"
                            top={0}
                            right={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeComponent(component.id);
                            }}
                          />
                        </Box>
                      );
                    }

                    return (
                      <ComponentBlock
                        key={component.id}
                        component={component}
                        leftPx={leftPx}
                        widthPx={wPx}
                        selected={isSelected}
                        onMouseDown={(e) => handleComponentDragStart(component.id, lane.id, e)}
                        onTrimStartMouseDown={(e) => handleTrimStartDragStart(component.id, lane.id, e)}
                        onTrimEndMouseDown={(e) => handleTrimEndDragStart(component.id, lane.id, e)}
                        onFadeIn={() => handleFadeIn(component.id)}
                        onFadeOut={() => handleFadeOut(component.id)}
                      />
                    );
                  })}
                </Box>
              </Flex>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default TimelineEditor;
