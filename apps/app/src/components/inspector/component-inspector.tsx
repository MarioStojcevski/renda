import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { parsePx } from "@renda/shared/lib/styles";
import {
  findComponent,
  formatTimecode,
  framesToSeconds,
  secondsToFrames,
} from "@renda/shared/lib/timeline-math";
import {
  buildFadeInKeyframes,
  buildFadeOutKeyframes,
  clearFadeIn,
  clearFadeOut,
  FADE_DURATION_FRAMES,
  hasFadeIn,
  hasFadeOut,
} from "@renda/shared/lib/timeline-utils/fade-keyframes";
import {
  isBackground,
  isImage,
  isShape,
} from "@renda/composition/guards";
import { FPS } from "@renda/shared/lib/video";
import { useTimeline } from "../../providers/timeline";
import NativeColorInput from "../shared/native-color-input";
import Panel from "../shared/panel";

const readNum = (value: unknown) => parsePx(value) ?? 0;

const ComponentInspector = () => {
  const {
    timeline,
    playheadFrame,
    selection,
    setPlayheadFrame,
    editComponent,
    patchComponent,
    addKeyframe,
    updateKeyframe,
    deleteKeyframe,
    clearSelection,
    deleteLane,
  } = useTimeline();

  if (!selection) {
    return (
      <Panel title="Inspector" flex={1}>
        <Text fontSize="sm" color="text.muted">
          Select a component or lane to edit.
        </Text>
      </Panel>
    );
  }

  if (selection.kind === "lane") {
    const lane = timeline.lanes.find((l) => l.id === selection.id);
    if (!lane) return null;
    return (
      <Panel title="Lane" flex={1}>
        <VStack align="stretch" spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs">Name</FormLabel>
            <Text fontSize="sm">{lane.name}</Text>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs">Type</FormLabel>
            <Text fontSize="sm" textTransform="capitalize">{lane.type}</Text>
          </FormControl>
          <Button size="sm" colorScheme="red" variant="outline" onClick={() => deleteLane(lane.id)}>
            Delete lane
          </Button>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            Deselect
          </Button>
        </VStack>
      </Panel>
    );
  }

  const found = findComponent(timeline, selection.id);
  if (!found) return null;

  const { component } = found;
  const styles = component.divStyles ?? {};

  const sceneFrame = playheadFrame - component.startFrame;
  const fadeInActive = hasFadeIn(component);
  const fadeOutActive = hasFadeOut(component);
  const fadeSeconds = Math.round((FADE_DURATION_FRAMES / FPS) * 10) / 10;

  const patch = (patchStyles: Record<string, string | number>) => {
    editComponent(component.id, { ...styles, ...patchStyles });
  };

  const captureKeyframe = () => {
    if (sceneFrame < 0 || sceneFrame >= component.duration) return;
    addKeyframe(component.id, sceneFrame, { ...styles });
  };

  return (
    <Panel title="Component" flex={1} overflowY="auto">
      <VStack align="stretch" spacing={3}>
        <Text fontSize="sm" fontWeight="medium">
          {component.type}
          {isImage(component) && component.name ? ` · ${component.name}` : ""}
        </Text>

        {isBackground(component) && (
          <NativeColorInput
            label="Background"
            value={component.fill}
            onChange={(fill) => patchComponent(component.id, { fill })}
          />
        )}

        {isShape(component) && (
          <>
            <FormControl>
              <FormLabel fontSize="xs">Shape</FormLabel>
              <Select
                size="sm"
                value={component.shape}
                onChange={(e) =>
                  patchComponent(component.id, {
                    shape: e.target.value as typeof component.shape,
                  })
                }
              >
                <option value="rectangle">Rectangle</option>
                <option value="ellipse">Ellipse</option>
                <option value="line">Line</option>
              </Select>
            </FormControl>
            {component.shape !== "line" && (
              <FormControl>
                <FormLabel fontSize="xs">Fill</FormLabel>
                <Input
                  size="sm"
                  value={component.fill}
                  onChange={(e) => patchComponent(component.id, { fill: e.target.value })}
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel fontSize="xs">
                {component.shape === "line" ? "Line color" : "Stroke"}
              </FormLabel>
              <Input
                size="sm"
                value={component.stroke}
                onChange={(e) => patchComponent(component.id, { stroke: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Stroke width</FormLabel>
              <NumberInput
                size="sm"
                value={component.strokeWidth}
                min={1}
                onChange={(_, n) => {
                  if (Number.isFinite(n)) patchComponent(component.id, { strokeWidth: n });
                }}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </>
        )}

        {isImage(component) && (
          <FormControl>
            <FormLabel fontSize="xs">Image URL</FormLabel>
            <Input
              size="sm"
              value={component.src}
              onChange={(e) => patchComponent(component.id, { src: e.target.value })}
            />
          </FormControl>
        )}

        <FormControl>
          <FormLabel fontSize="xs">Playhead (s)</FormLabel>
          <NumberInput
            size="sm"
            value={framesToSeconds(playheadFrame)}
            min={0}
            step={0.1}
            onChange={(_, n) => {
              if (Number.isFinite(n)) setPlayheadFrame(secondsToFrames(n));
            }}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>

        <HStack>
          <FormControl>
            <FormLabel fontSize="xs">X</FormLabel>
            <NumberInput
              size="sm"
              value={readNum(styles.left)}
              onChange={(_, n) => patch({ left: `${n}px` })}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs">Y</FormLabel>
            <NumberInput
              size="sm"
              value={readNum(styles.top)}
              onChange={(_, n) => patch({ top: `${n}px` })}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>

        <HStack>
          <FormControl>
            <FormLabel fontSize="xs">Width</FormLabel>
            <NumberInput
              size="sm"
              value={readNum(styles.width)}
              onChange={(_, n) => patch({ width: `${n}px` })}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs">Height</FormLabel>
            <NumberInput
              size="sm"
              value={readNum(styles.height)}
              onChange={(_, n) => patch({ height: `${n}px` })}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel fontSize="xs">Transform</FormLabel>
          <Input
            size="sm"
            value={(styles.transform as string) ?? ""}
            placeholder="rotate(0deg) scale(1)"
            onChange={(e) => patch({ transform: e.target.value })}
          />
        </FormControl>

        <VStack align="stretch" spacing={2}>
          <Text fontSize="xs" color="text.muted" textTransform="uppercase">
            Opacity fades
          </Text>
          <HStack spacing={2}>
            <Tooltip label={fadeInActive ? "Click to remove fade in" : "Add fade in"} openDelay={400}>
              <Button
                size="sm"
                flex={1}
                minW={0}
                px={2}
                fontSize="xs"
                whiteSpace="nowrap"
                variant={fadeInActive ? "solid" : "outline"}
                colorScheme={fadeInActive ? "brand" : undefined}
                onClick={() =>
                  patchComponent(component.id, {
                    keyframes: fadeInActive
                      ? clearFadeIn(component)
                      : buildFadeInKeyframes(component),
                  })
                }
              >
                Fade in
              </Button>
            </Tooltip>
            <Tooltip label={fadeOutActive ? "Click to remove fade out" : "Add fade out"} openDelay={400}>
              <Button
                size="sm"
                flex={1}
                minW={0}
                px={2}
                fontSize="xs"
                whiteSpace="nowrap"
                variant={fadeOutActive ? "solid" : "outline"}
                colorScheme={fadeOutActive ? "brand" : undefined}
                onClick={() =>
                  patchComponent(component.id, {
                    keyframes: fadeOutActive
                      ? clearFadeOut(component)
                      : buildFadeOutKeyframes(component),
                  })
                }
              >
                Fade out
              </Button>
            </Tooltip>
          </HStack>
          <Text fontSize="xs" color="text.muted">
            {fadeSeconds}s fade at clip start or end. Affects playback only.
          </Text>
        </VStack>

        <Button
          size="sm"
          colorScheme="brand"
          onClick={captureKeyframe}
          isDisabled={sceneFrame < 0 || sceneFrame >= component.duration}
        >
          Add keyframe at {formatTimecode(Math.max(0, sceneFrame))}
        </Button>

        {(component.keyframes?.length ?? 0) > 0 && (
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" color="text.muted" textTransform="uppercase">
              Keyframes
            </Text>
            {component.keyframes?.map((kf) => (
              <HStack key={kf.id}>
                <NumberInput
                  size="sm"
                  flex={1}
                  value={framesToSeconds(kf.frame)}
                  step={0.1}
                  min={0}
                  onChange={(_, n) => {
                    if (!Number.isFinite(n)) return;
                    updateKeyframe(component.id, {
                      ...kf,
                      frame: secondsToFrames(n),
                    });
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <Text fontSize="xs" color="text.muted">
                  s
                </Text>
                <IconButton
                  aria-label="Delete keyframe"
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteKeyframe(component.id, kf.id)}
                />
              </HStack>
            ))}
          </VStack>
        )}

        <Button size="sm" variant="ghost" onClick={clearSelection}>
          Deselect
        </Button>
      </VStack>
    </Panel>
  );
};

export default ComponentInspector;
