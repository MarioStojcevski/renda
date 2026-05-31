import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { useCallback, useRef } from "react";
import { FPS, totalDurationFrames } from "@renda/shared/lib/video";
import {
  PX_PER_FRAME,
  formatTimecode,
  secondsToFrames,
  timelineWidthPx,
} from "@renda/shared/lib/timeline-math";
import { useTimeline } from "../../providers/timeline";
import AudioWaveform from "./audio-waveform";

const RULER_HEIGHT = 28;
const TRACK_HEIGHT = 52;

const TimelineEditor = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    timeline,
    playheadFrame,
    selection,
    isPlaying,
    togglePlayback,
    setPlayheadFrame,
    select,
    addScene,
    deleteScene,
    updateSceneDuration,
    addAudio,
    removeAudio,
  } = useTimeline();

  const totalFrames = totalDurationFrames(timeline);
  const canPlay = timeline.VideoTrack.length > 0 && totalFrames > 0;
  const widthPx = timelineWidthPx(totalFrames);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left + el.scrollLeft;
      const frame = Math.max(0, Math.min(totalFrames - 1, Math.round(x / PX_PER_FRAME)));
      setPlayheadFrame(frame);
    },
    [totalFrames, setPlayheadFrame]
  );

  const handleRulerClick = (e: React.MouseEvent) => seekFromClientX(e.clientX);

  const handleAddAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      const durationSec = Number.isFinite(audio.duration) ? audio.duration : 10;
      addAudio(url, playheadFrame, durationSec);
    });
    audio.addEventListener("error", () => addAudio(url, playheadFrame, 10));
    e.target.value = "";
  };

  let sceneOffset = 0;

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
      <Flex px={3} py={2} align="center" justify="space-between" borderBottom="1px solid" borderColor="border.subtle">
        <Text fontSize="xs" fontWeight="semibold" color="text.muted" textTransform="uppercase" letterSpacing="wider">
          Timeline
        </Text>
        <HStack spacing={2}>
          <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            icon={
              <Text fontSize="sm" lineHeight={1}>
                {isPlaying ? "⏸" : "▶"}
              </Text>
            }
            size="xs"
            colorScheme="brand"
            variant="solid"
            isDisabled={!canPlay}
            onClick={togglePlayback}
          />
          <Text fontSize="xs" color="text.muted" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {formatTimecode(playheadFrame)} / {formatTimecode(totalFrames)}
          </Text>
          <Button
            size="xs"
            leftIcon={<AddIcon />}
            colorScheme="brand"
            variant="outline"
            onClick={() => addScene()}
          >
            Scene
          </Button>
          <Button size="xs" as="label" variant="outline" cursor="pointer">
            Audio
            <Input type="file" accept="audio/*" display="none" onChange={handleAddAudioFile} />
          </Button>
        </HStack>
      </Flex>

      <Flex flex={1} minH={0}>
        <VStack
          w="72px"
          flexShrink={0}
          spacing={0}
          borderRight="1px solid"
          borderColor="border.subtle"
          pt={`${RULER_HEIGHT}px`}
        >
          <Flex h={`${TRACK_HEIGHT}px`} align="center" px={2}>
            <Text fontSize="xs" color="text.muted">
              Video
            </Text>
          </Flex>
          <Flex h={`${TRACK_HEIGHT}px`} align="center" px={2}>
            <Text fontSize="xs" color="text.muted">
              Audio
            </Text>
          </Flex>
        </VStack>

        <Box ref={scrollRef} flex={1} overflowX="auto" overflowY="hidden" position="relative" onClick={handleRulerClick}>
          <Box position="relative" w={`${widthPx}px`} minW="100%">
            {/* Ruler */}
            <Flex h={`${RULER_HEIGHT}px`} borderBottom="1px solid" borderColor="border.subtle" position="sticky" top={0} bg="bg.surface" zIndex={2}>
              {Array.from({ length: Math.ceil(totalFrames / FPS) + 1 }).map((_, sec) => (
                <Box
                  key={sec}
                  position="absolute"
                  left={`${sec * FPS * PX_PER_FRAME}px`}
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

            {/* Playhead */}
            <Box
              position="absolute"
              top={0}
              bottom={0}
              left={`${playheadFrame * PX_PER_FRAME}px`}
              w="2px"
              bg="accent.hover"
              zIndex={3}
              pointerEvents="none"
              boxShadow="0 0 8px rgba(45, 212, 191, 0.6)"
            />

            {/* Video track */}
            <Flex h={`${TRACK_HEIGHT}px`} align="center" position="relative" borderBottom="1px solid" borderColor="border.subtle">
              {timeline.VideoTrack.map((scene, index) => {
                const left = sceneOffset * PX_PER_FRAME;
                const w = scene.duration * PX_PER_FRAME;
                sceneOffset += scene.duration;
                const selected = selection?.kind === "scene" && selection.id === scene.id;

                return (
                  <Box
                    key={scene.id}
                    position="absolute"
                    left={`${left}px`}
                    w={`${w}px`}
                    h="36px"
                    mx="1px"
                    bg={selected ? "accent.muted" : "brand.800"}
                    border="1px solid"
                    borderColor={selected ? "accent.hover" : "border.strong"}
                    borderRadius="control"
                    cursor="pointer"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      select({ kind: "scene", id: scene.id });
                      setPlayheadFrame(left);
                    }}
                  >
                    <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                      Scene {index + 1}
                    </Text>
                    <HStack spacing={0}>
                      <IconButton
                        aria-label="Shorten scene"
                        icon={<Text fontSize="xs">−</Text>}
                        size="xs"
                        variant="ghost"
                        minW={5}
                        h={5}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSceneDuration(scene.id, scene.duration - FPS);
                        }}
                      />
                      <IconButton
                        aria-label="Lengthen scene"
                        icon={<Text fontSize="xs">+</Text>}
                        size="xs"
                        variant="ghost"
                        minW={5}
                        h={5}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSceneDuration(scene.id, scene.duration + FPS);
                        }}
                      />
                      <IconButton
                        aria-label="Delete scene"
                        icon={<CloseIcon boxSize={2} />}
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteScene(scene.id);
                        }}
                      />
                    </HStack>
                  </Box>
                );
              })}
            </Flex>

            {/* Audio track */}
            <Flex h={`${TRACK_HEIGHT}px`} align="center" position="relative">
              {timeline.AudioTrack.map((segment) => {
                const left = segment.from * PX_PER_FRAME;
                const w = (segment.endFrame - segment.startFrame) * PX_PER_FRAME;
                const selected = selection?.kind === "audio" && selection.id === segment.id;

                return (
                  <Box
                    key={segment.id}
                    position="absolute"
                    left={`${left}px`}
                    w={`${Math.max(w, 40)}px`}
                    h="40px"
                    bg={selected ? "bg.active" : "bg.subtle"}
                    border="1px solid"
                    borderColor={selected ? "accent" : "border.subtle"}
                    borderRadius="control"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      select({ kind: "audio", id: segment.id });
                    }}
                  >
                    <AudioWaveform segment={segment} height={38} />
                    <IconButton
                      aria-label="Remove audio"
                      icon={<DeleteIcon boxSize={2.5} />}
                      size="xs"
                      variant="ghost"
                      position="absolute"
                      top={0}
                      right={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAudio(segment.id);
                      }}
                    />
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default TimelineEditor;
