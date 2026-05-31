import { Box, Flex, Text } from "@chakra-ui/react";
import { Suspense, useCallback, useEffect, useState } from "react";

import { useEditorUi } from "../../providers/editor-ui";
import { useTimeline } from "../../providers/timeline";
import ResizeHandle from "../shared/resize-handle";
import ComponentInspector from "../inspector/component-inspector";
import LoadingSpinner from "../shared/loading-spinner";
import TimelineEditor from "../timeline/timeline-editor";
import TimelineControlBar from "../timeline/timeline-control-bar";
import MediaPanel from "./components/media-panel";
import AiPanel from "./components/ai-panel";
import PreviewPanel from "./preview-panel";

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

export default function Editor() {
  const { timeline, togglePlayback, selection, clearSelection } = useTimeline();
  const { panels } = useEditorUi();
  const hasContent = timeline.lanes.some((l) => l.components.length > 0);

  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(280);
  const [timelineHeight, setTimelineHeight] = useState(240);
  const [zoom, setZoom] = useState(1);

  const showSelection = selection?.kind === "component";

  const resizeLeft = useCallback((d: number) => {
    setLeftWidth((w) => clamp(w + d, 220, 420));
  }, []);
  const resizeRight = useCallback((d: number) => {
    setRightWidth((w) => clamp(w - d, 220, 480));
  }, []);
  const resizeTimeline = useCallback((d: number) => {
    setTimelineHeight((h) => clamp(h - d, 120, 400));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      const next = ZOOM_STEPS.find((s) => s > z);
      return next ?? z;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const prev = [...ZOOM_STEPS].reverse().find((s) => s < z);
      return prev ?? z;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        togglePlayback();
        return;
      }
      if (e.code === "Escape") {
        clearSelection();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlayback, clearSelection]);

  const showMedia = panels.media;
  const showAi = panels.ai;
  const showTimeline = panels.timeline;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Flex h="calc(100vh - 2.5rem)" overflow="hidden" bg="bg.canvas">
        {showMedia && (
          <>
            <Box
              w={`${leftWidth}px`}
              flexShrink={0}
              borderRight="1px solid"
              borderColor="border.divider"
              bg="bg.surface"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              p={3}
              zIndex={2}
            >
              <Box flex={1} minH={0} overflowY="auto" overflowX="hidden">
                {showSelection ? <ComponentInspector /> : <MediaPanel />}
              </Box>
            </Box>
            <ResizeHandle axis="horizontal" onResize={resizeLeft} />
          </>
        )}

        <Flex flex={1} direction="column" minW={0} overflow="hidden">
          {hasContent ? (
            <>
              <Flex flex={1} minH={0} overflow="hidden">
                <Flex flex={1} minW={0} p={2} direction="column">
                  <PreviewPanel />
                  <TimelineControlBar zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} />
                </Flex>

                {showAi && (
                  <>
                    <ResizeHandle axis="horizontal" onResize={resizeRight} />
                    <Box
                      w={`${rightWidth}px`}
                      flexShrink={0}
                      overflowY="auto"
                      p={2}
                      borderLeft="1px solid"
                      borderColor="border.divider"
                      bg="bg.surface"
                    >
                      <AiPanel />
                    </Box>
                  </>
                )}
              </Flex>

              {showTimeline && (
                <>
                  <ResizeHandle axis="vertical" onResize={resizeTimeline} />
                  <Box
                    h={`${timelineHeight}px`}
                    flexShrink={0}
                    px={2}
                    pb={2}
                    minH={0}
                    display="flex"
                    flexDirection="column"
                  >
                    <TimelineEditor zoom={zoom} />
                  </Box>
                </>
              )}
            </>
          ) : (
            <Flex flex={1} align="center" justify="center" direction="column" gap={3} p={4}>
              <Text color="text.muted" fontSize="sm" textAlign="center">
                Add components from the media panel, then press Space or ▶ to play.
              </Text>
              {showTimeline && (
                <Box w="full" maxW="960px" h={`${timelineHeight}px`}>
                  <TimelineEditor zoom={zoom} />
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Suspense>
  );
}
