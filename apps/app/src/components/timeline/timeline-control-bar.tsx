import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";

import { totalDurationFrames } from "@renda/shared/lib/video";
import { formatTimecode } from "@renda/shared/lib/timeline-math";
import { useTimeline } from "../../providers/timeline";
import {
  PauseIcon,
  PlayIcon,
  SkipToEndIcon,
  SkipToStartIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./transport-icons";

type Props = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const transportBtn = {
  size: "sm" as const,
  variant: "ghost" as const,
  h: "32px",
  w: "32px",
  minW: "32px",
  borderRadius: "control",
  color: "text.secondary",
  _hover: { bg: "bg.hover", color: "text.primary" },
};

const TimelineControlBar = ({ zoom, onZoomIn, onZoomOut }: Props) => {
  const { isPlaying, togglePlayback, playheadFrame, setPlayheadFrame, timeline } = useTimeline();
  const totalFrames = totalDurationFrames(timeline);

  const goToStart = () => setPlayheadFrame(0);
  const goToEnd = () => setPlayheadFrame(Math.max(0, totalFrames - 1));

  return (
    <Flex
      align="center"
      justify="space-between"
      px={3}
      py={2}
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="border.divider"
      gap={3}
    >
      <Flex align="center" gap={3} minW={0}>
        <Flex
          align="center"
          gap={0.5}
          bg="bg.subtle"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="control"
          p={0.5}
          flexShrink={0}
        >
          <Tooltip label="Go to start" openDelay={400}>
            <IconButton
              aria-label="Go to start"
              icon={<SkipToStartIcon boxSize="15px" />}
              onClick={goToStart}
              {...transportBtn}
            />
          </Tooltip>

          <Tooltip label={isPlaying ? "Pause (Space)" : "Play (Space)"} openDelay={400}>
            <IconButton
              aria-label={isPlaying ? "Pause" : "Play"}
              icon={
                isPlaying ? (
                  <PauseIcon boxSize="16px" />
                ) : (
                  <PlayIcon boxSize="16px" ml="1px" />
                )
              }
              onClick={togglePlayback}
              h="34px"
              w="34px"
              minW="34px"
              borderRadius="control"
              colorScheme="brand"
              variant="solid"
              color="white"
              _hover={{ bg: "accent.hover" }}
              _active={{ bg: "accent.muted" }}
            />
          </Tooltip>

          <Tooltip label="Go to end" openDelay={400}>
            <IconButton
              aria-label="Go to end"
              icon={<SkipToEndIcon boxSize="15px" />}
              onClick={goToEnd}
              {...transportBtn}
            />
          </Tooltip>
        </Flex>

        <Box
          px={2.5}
          py={1}
          bg="bg.subtle"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="control"
          flexShrink={0}
        >
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="text.secondary"
            sx={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}
          >
            <Text as="span" color="text.primary">
              {formatTimecode(playheadFrame)}
            </Text>
            <Text as="span" color="text.muted" mx={1.5}>
              /
            </Text>
            <Text as="span" color="text.muted">
              {formatTimecode(totalFrames)}
            </Text>
          </Text>
        </Box>
      </Flex>

      <Flex
        align="center"
        gap={0.5}
        bg="bg.subtle"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="control"
        p={0.5}
        flexShrink={0}
      >
        <Tooltip label="Zoom out" openDelay={400}>
          <IconButton
            aria-label="Zoom out"
            icon={<ZoomOutIcon boxSize="15px" />}
            onClick={onZoomOut}
            {...transportBtn}
          />
        </Tooltip>

        <Text
          fontSize="xs"
          fontWeight="medium"
          color="text.muted"
          minW="42px"
          textAlign="center"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {Math.round(zoom * 100)}%
        </Text>

        <Tooltip label="Zoom in" openDelay={400}>
          <IconButton
            aria-label="Zoom in"
            icon={<ZoomInIcon boxSize="15px" />}
            onClick={onZoomIn}
            {...transportBtn}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default TimelineControlBar;
