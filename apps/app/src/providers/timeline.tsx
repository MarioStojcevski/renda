import React, {
  useContext,
  useCallback,
  useState,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";

import { SLOT_MACHINE_TEMPLATE } from "@renda/composition/templates/slot-machine";
import { secondsToFrames } from "@renda/shared/lib/timeline-math";
import { addAudio } from "@renda/shared/lib/timeline-utils/add-audio";
import { addComponent } from "@renda/shared/lib/timeline-utils/add-component";
import { addScene } from "@renda/shared/lib/timeline-utils/add-scene";
import { deleteScene } from "@renda/shared/lib/timeline-utils/delete-scene";
import { editComponent } from "@renda/shared/lib/timeline-utils/edit-component";
import {
  addKeyframeAtFrame,
  removeKeyframe,
  upsertKeyframe,
} from "@renda/shared/lib/timeline-utils/keyframes";
import { patchComponent } from "@renda/shared/lib/timeline-utils/patch-component";
import { removeAudio, updateAudio } from "@renda/shared/lib/timeline-utils/update-audio";
import { updateScene } from "@renda/shared/lib/timeline-utils/update-scene";
import type { ComponentKeyframe } from "@renda/shared/types/keyframe";
import type { SceneComponentType } from "@renda/shared/types/scene-component";
import type { VideoComposition } from "@renda/shared/types/video-composition";

export type Selection =
  | { kind: "component"; id: string }
  | { kind: "scene"; id: string }
  | { kind: "audio"; id: string }
  | null;

type TimelineContextValue = {
  timeline: VideoComposition;
  playheadFrame: number;
  selection: Selection;
  isPlaying: boolean;
  setTimeline: (timeline: VideoComposition) => void;
  setPlayheadFrame: (frame: number) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayback: () => void;
  select: (selection: Selection) => void;
  clearSelection: () => void;
  addComponent: (component: SceneComponentType) => VideoComposition;
  editComponent: (componentId: string, divStyles: CSSProperties) => VideoComposition;
  patchComponent: (
    componentId: string,
    patch: Partial<SceneComponentType>
  ) => VideoComposition;
  addScene: (atEnd?: boolean) => VideoComposition;
  deleteScene: (sceneId: string) => VideoComposition;
  updateSceneDuration: (sceneId: string, durationFrames: number) => VideoComposition;
  addAudio: (src: string, atFrame?: number, durationSec?: number) => VideoComposition;
  updateAudioSegment: (
    audioId: string,
    patch: Partial<{ from: number; startFrame: number; endFrame: number; src: string }>
  ) => VideoComposition;
  removeAudio: (audioId: string) => VideoComposition;
  addKeyframe: (componentId: string, frame: number, divStyles: CSSProperties) => VideoComposition;
  updateKeyframe: (componentId: string, keyframe: ComponentKeyframe) => VideoComposition;
  deleteKeyframe: (componentId: string, keyframeId: string) => VideoComposition;
};

const TimelineContext = React.createContext<TimelineContextValue | undefined>(
  undefined
);

export const TimelineProvider = ({ children }: { children: ReactNode }) => {
  const [timeline, setTimeline] = useState<VideoComposition>(SLOT_MACHINE_TEMPLATE);
  const [playheadFrame, setPlayheadFrame] = useState(0);
  const [selection, setSelection] = useState<Selection>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const addComponentToTimeline = useCallback(
    (component: SceneComponentType) => {
      const next = addComponent({ timeline, component, frame: playheadFrame });
      setTimeline(next);
      setSelection({ kind: "component", id: component.id });
      return next;
    },
    [timeline, playheadFrame]
  );

  const editComponentInTimeline = useCallback(
    (componentId: string, divStyles: CSSProperties) => {
      const next = editComponent({ timeline, componentId, divStyles });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const patchComponentInTimeline = useCallback(
    (componentId: string, patch: Partial<SceneComponentType>) => {
      const next = patchComponent({ timeline, componentId, patch });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const deleteSceneFromTimeline = useCallback(
    (sceneId: string) => {
      const next = deleteScene({ timeline, sceneId });
      setTimeline(next);
      if (selection?.kind === "scene" && selection.id === sceneId) setSelection(null);
      return next;
    },
    [timeline, selection]
  );

  const addSceneToTimeline = useCallback(() => {
    const next = addScene({ timeline });
    setTimeline(next);
    const newScene = next.VideoTrack.at(-1);
    if (newScene) setSelection({ kind: "scene", id: newScene.id });
    return next;
  }, [timeline]);

  const updateSceneDuration = useCallback(
    (sceneId: string, durationFrames: number) => {
      const duration = Math.max(secondsToFrames(0.5), durationFrames);
      const next = updateScene({ timeline, sceneId, patch: { duration } });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const addAudioToTimeline = useCallback(
    (src: string, atFrame = playheadFrame, durationSec = 5) => {
      const next = addAudio({ timeline, src, atFrame, durationSec });
      setTimeline(next);
      const segment = next.AudioTrack.at(-1);
      if (segment) setSelection({ kind: "audio", id: segment.id });
      return next;
    },
    [timeline, playheadFrame]
  );

  const updateAudioSegment = useCallback(
    (
      audioId: string,
      patch: Partial<{ from: number; startFrame: number; endFrame: number; src: string }>
    ) => {
      const next = updateAudio({ timeline, audioId, patch });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const removeAudioFromTimeline = useCallback(
    (audioId: string) => {
      const next = removeAudio({ timeline, audioId });
      setTimeline(next);
      if (selection?.kind === "audio" && selection.id === audioId) setSelection(null);
      return next;
    },
    [timeline, selection]
  );

  const addKeyframeToComponent = useCallback(
    (componentId: string, frame: number, divStyles: CSSProperties) => {
      const next = addKeyframeAtFrame({ timeline, componentId, frame, divStyles });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const updateKeyframeOnComponent = useCallback(
    (componentId: string, keyframe: ComponentKeyframe) => {
      const next = upsertKeyframe({ timeline, componentId, keyframe });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const deleteKeyframeFromComponent = useCallback(
    (componentId: string, keyframeId: string) => {
      const next = removeKeyframe({ timeline, componentId, keyframeId });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const togglePlayback = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const value = useMemo<TimelineContextValue>(
    () => ({
      timeline,
      playheadFrame,
      selection,
      isPlaying,
      setTimeline,
      setPlayheadFrame,
      setIsPlaying,
      togglePlayback,
      select: setSelection,
      clearSelection: () => setSelection(null),
      addComponent: addComponentToTimeline,
      editComponent: editComponentInTimeline,
      patchComponent: patchComponentInTimeline,
      addScene: addSceneToTimeline,
      deleteScene: deleteSceneFromTimeline,
      updateSceneDuration,
      addAudio: addAudioToTimeline,
      updateAudioSegment,
      removeAudio: removeAudioFromTimeline,
      addKeyframe: addKeyframeToComponent,
      updateKeyframe: updateKeyframeOnComponent,
      deleteKeyframe: deleteKeyframeFromComponent,
    }),
    [
      timeline,
      playheadFrame,
      selection,
      isPlaying,
      togglePlayback,
      addComponentToTimeline,
      editComponentInTimeline,
      patchComponentInTimeline,
      addSceneToTimeline,
      deleteSceneFromTimeline,
      updateSceneDuration,
      addAudioToTimeline,
      updateAudioSegment,
      removeAudioFromTimeline,
      addKeyframeToComponent,
      updateKeyframeOnComponent,
      deleteKeyframeFromComponent,
    ]
  );

  return (
    <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within TimelineProvider");
  }
  return context;
};
