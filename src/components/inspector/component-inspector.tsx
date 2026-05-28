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
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { parsePx } from "../../lib/styles";
import {
  findComponent,
  formatTimecode,
  framesToSeconds,
  getSceneAtPlayhead,
  secondsToFrames,
} from "../../lib/timeline-math";
import {
  isBackground,
  isImage,
  isShape,
} from "../../composition/guards";
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
    updateSceneDuration,
    updateAudioSegment,
    removeAudio,
  } = useTimeline();

  if (!selection) {
    return (
      <Panel title="Inspector" flex={1}>
        <Text fontSize="sm" color="text.muted">
          Select a component, scene, or audio clip to edit.
        </Text>
      </Panel>
    );
  }

  if (selection.kind === "scene") {
    const scene = timeline.VideoTrack.find((s) => s.id === selection.id);
    if (!scene) return null;
    return (
      <Panel title="Scene" flex={1}>
        <VStack align="stretch" spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs">Duration (s)</FormLabel>
            <NumberInput
              size="sm"
              value={framesToSeconds(scene.duration)}
              min={0.5}
              step={0.1}
              onChange={(_, n) => {
                if (Number.isFinite(n)) updateSceneDuration(scene.id, secondsToFrames(n));
              }}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <Button size="sm" variant="ghost" onClick={clearSelection}>
            Deselect
          </Button>
        </VStack>
      </Panel>
    );
  }

  if (selection.kind === "audio") {
    const segment = timeline.AudioTrack.find((s) => s.id === selection.id);
    if (!segment) return null;
    const clipDuration = segment.endFrame - segment.startFrame;
    return (
      <Panel title="Audio" flex={1}>
        <VStack align="stretch" spacing={3}>
          <FormControl>
            <FormLabel fontSize="xs">Start (s)</FormLabel>
            <NumberInput
              size="sm"
              value={framesToSeconds(segment.from)}
              min={0}
              step={0.1}
              onChange={(_, n) => {
                if (Number.isFinite(n)) updateAudioSegment(segment.id, { from: secondsToFrames(n) });
              }}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="xs">Duration (s)</FormLabel>
            <NumberInput
              size="sm"
              value={framesToSeconds(clipDuration)}
              min={0.5}
              step={0.1}
              onChange={(_, n) => {
                if (Number.isFinite(n)) {
                  updateAudioSegment(segment.id, {
                    endFrame: segment.startFrame + secondsToFrames(n),
                  });
                }
              }}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <Button size="sm" colorScheme="red" variant="outline" onClick={() => removeAudio(segment.id)}>
            Remove audio
          </Button>
        </VStack>
      </Panel>
    );
  }

  const found = findComponent(timeline, selection.id);
  if (!found) return null;

  const { component } = found;
  const sceneCtx = getSceneAtPlayhead(timeline.VideoTrack, playheadFrame);
  const localFrame = sceneCtx?.sceneLocalFrame ?? 0;
  const styles = component.divStyles ?? {};

  const patch = (patchStyles: Record<string, string | number>) => {
    editComponent(component.id, { ...styles, ...patchStyles });
  };

  const captureKeyframe = () => {
    addKeyframe(component.id, localFrame, { ...styles });
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

        <Button size="sm" colorScheme="brand" onClick={captureKeyframe}>
          Add keyframe at {formatTimecode(localFrame)}
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
