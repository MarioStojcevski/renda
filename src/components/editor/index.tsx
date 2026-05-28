import { Box, Flex, Text } from "@chakra-ui/react";
import { Suspense, useCallback, useEffect, useState } from "react";

import { useEditorUi } from "../../providers/editor-ui";
import { useTimeline } from "../../providers/timeline";
import ResizeHandle from "../shared/resize-handle";
import ComponentInspector from "../inspector/component-inspector";
import LoadingSpinner from "../shared/loading-spinner";
import TimelineEditor from "../timeline/timeline-editor";
import MediaPanel from "./components/media-panel";
import PreviewPanel from "./preview-panel";

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
  const { timeline, togglePlayback } = useTimeline();
  const { panels } = useEditorUi();
  const hasScenes = timeline.VideoTrack.length > 0;

  const [mediaWidth, setMediaWidth] = useState(260);
  const [inspectorWidth, setInspectorWidth] = useState(280);
  const [timelineHeight, setTimelineHeight] = useState(200);

  const resizeMedia = useCallback((d: number) => {
    setMediaWidth((w) => clamp(w + d, 220, 420));
  }, []);
  const resizeInspector = useCallback((d: number) => {
    setInspectorWidth((w) => clamp(w - d, 220, 480));
  }, []);
  const resizeTimeline = useCallback((d: number) => {
    setTimelineHeight((h) => clamp(h - d, 120, 400));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      togglePlayback();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlayback]);

  const showMedia = panels.media;
  const showInspector = panels.inspector;
  const showTimeline = panels.timeline;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Flex h="calc(100vh - 2.5rem)" overflow="hidden" bg="bg.canvas">
        {showMedia && (
          <>
            <Box
              w={`${mediaWidth}px`}
              flexShrink={0}
              borderRight="1px solid"
              borderColor="border.divider"
              bg="bg.surface"
              overflow="hidden"
              display="flex"
              flexDirection="column"
              p={3}
            >
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="text.muted"
                textTransform="uppercase"
                mb={3}
                flexShrink={0}
              >
                Media
              </Text>
              <Box flex={1} minH={0} overflow="hidden">
                <MediaPanel />
              </Box>
            </Box>
            <ResizeHandle axis="horizontal" onResize={resizeMedia} />
          </>
        )}

        <Flex flex={1} direction="column" minW={0} overflow="hidden">
          {hasScenes ? (
            <>
              <Flex flex={1} minH={0} overflow="hidden">
                <Box flex={1} minW={0} p={2} display="flex">
                  <PreviewPanel />
                </Box>

                {showInspector && (
                  <>
                    <ResizeHandle axis="horizontal" onResize={resizeInspector} />
                    <Box
                      w={`${inspectorWidth}px`}
                      flexShrink={0}
                      minH={0}
                      overflowY="auto"
                      p={2}
                      borderLeft="1px solid"
                      borderColor="border.divider"
                      bg="bg.surface"
                    >
                      <ComponentInspector />
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
                    <TimelineEditor />
                  </Box>
                </>
              )}
            </>
          ) : (
            <Flex flex={1} align="center" justify="center" direction="column" gap={3} p={4}>
              <Text color="text.muted" fontSize="sm" textAlign="center">
                Add a scene from the timeline (View → Timeline), then press Space or ▶ to play.
              </Text>
              {showTimeline && (
                <Box w="full" maxW="960px" h={`${timelineHeight}px`}>
                  <TimelineEditor />
                </Box>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Suspense>
  );
}
