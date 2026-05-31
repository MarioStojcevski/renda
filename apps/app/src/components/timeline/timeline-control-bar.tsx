import { Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlayIcon, PauseIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

import { totalDurationFrames } from "@renda/shared/lib/video";
import { formatTimecode } from "@renda/shared/lib/timeline-math";
import { useTimeline } from "../../providers/timeline";

type Props = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

const iconSx = { width: "18px", height: "18px" };

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
      py={1}
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="border.divider"
    >
      <Flex align="center" gap={1}>
        <Tooltip label="Go to start">
          <IconButton
            aria-label="Go to start"
            icon={<ChevronDoubleLeftIcon style={iconSx} />}
            size="xs"
            variant="ghost"
            onClick={goToStart}
          />
        </Tooltip>
        <Tooltip label={isPlaying ? "Pause" : "Play"}>
          <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? <PauseIcon style={iconSx} /> : <PlayIcon style={iconSx} />}
            size="sm"
            colorScheme="brand"
            variant="solid"
            onClick={togglePlayback}
          />
        </Tooltip>
        <Tooltip label="Go to end">
          <IconButton
            aria-label="Go to end"
            icon={<ChevronDoubleRightIcon style={iconSx} />}
            size="xs"
            variant="ghost"
            onClick={goToEnd}
          />
        </Tooltip>
        <Text fontSize="xs" color="text.muted" sx={{ fontVariantNumeric: "tabular-nums" }} ml={2}>
          {formatTimecode(playheadFrame)} / {formatTimecode(totalFrames)}
        </Text>
      </Flex>

      <Flex align="center" gap={1}>
        <Tooltip label="Zoom out">
          <IconButton
            aria-label="Zoom out"
            icon={<MinusIcon style={iconSx} />}
            size="xs"
            variant="ghost"
            onClick={onZoomOut}
          />
        </Tooltip>
        <Text fontSize="xs" color="text.muted" minW="36px" textAlign="center">
          {Math.round(zoom * 100)}%
        </Text>
        <Tooltip label="Zoom in">
          <IconButton
            aria-label="Zoom in"
            icon={<PlusIcon style={iconSx} />}
            size="xs"
            variant="ghost"
            onClick={onZoomIn}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default TimelineControlBar;
