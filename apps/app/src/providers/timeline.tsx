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
import { addLane } from "@renda/shared/lib/timeline-utils/add-lane";
import { deleteLane } from "@renda/shared/lib/timeline-utils/delete-lane";
import {
  addComponentToLane,
  addComponentAtFrame,
} from "@renda/shared/lib/timeline-utils/add-component";
import { removeComponent } from "@renda/shared/lib/timeline-utils/remove-component";
import { moveComponent } from "@renda/shared/lib/timeline-utils/move-component";
import {
  trimComponentStart,
  trimComponentEnd,
} from "@renda/shared/lib/timeline-utils/trim-component";
import { editComponent } from "@renda/shared/lib/timeline-utils/edit-component";
import { patchComponent } from "@renda/shared/lib/timeline-utils/patch-component";
import {
  addKeyframeAtFrame,
  removeKeyframe,
  upsertKeyframe,
} from "@renda/shared/lib/timeline-utils/keyframes";
import type { ComponentKeyframe } from "@renda/shared/types/keyframe";
import type { TimedComponent } from "@renda/shared/types/timed-component";
import type { VideoComposition } from "@renda/shared/types/video-composition";

export type Selection =
  | { kind: "component"; id: string }
  | { kind: "lane"; id: string }
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
  addLane: (name?: string, type?: "video" | "audio") => VideoComposition;
  deleteLane: (laneId: string) => VideoComposition;
  addComponent: (component: TimedComponent, laneId: string) => VideoComposition;
  addComponentAtFrame: (component: TimedComponent, laneId: string, frame: number) => VideoComposition;
  moveComponent: (componentId: string, newStartFrame: number) => VideoComposition;
  trimComponentStart: (componentId: string, deltaFrames: number) => VideoComposition;
  trimComponentEnd: (componentId: string, deltaFrames: number) => VideoComposition;
  removeComponent: (componentId: string) => VideoComposition;
  editComponent: (componentId: string, divStyles: CSSProperties) => VideoComposition;
  patchComponent: (
    componentId: string,
    patch: Partial<TimedComponent>
  ) => VideoComposition;
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

  const addLaneToTimeline = useCallback(
    (name?: string, type?: "video" | "audio") => {
      const next = addLane({ timeline, name, type });
      setTimeline(next);
      const newLane = next.lanes.at(-1);
      if (newLane) setSelection({ kind: "lane", id: newLane.id });
      return next;
    },
    [timeline]
  );

  const deleteLaneFromTimeline = useCallback(
    (laneId: string) => {
      const next = deleteLane({ timeline, laneId });
      setTimeline(next);
      if (selection?.kind === "lane" && selection.id === laneId) setSelection(null);
      return next;
    },
    [timeline, selection]
  );

  const addComponentToTimeline = useCallback(
    (component: TimedComponent, laneId: string) => {
      const next = addComponentToLane({ timeline, laneId, component });
      setTimeline(next);
      setSelection({ kind: "component", id: component.id });
      return next;
    },
    [timeline]
  );

  const addComponentAtFrameToTimeline = useCallback(
    (component: TimedComponent, laneId: string, frame: number) => {
      const next = addComponentAtFrame({ timeline, laneId, component, frame });
      setTimeline(next);
      setSelection({ kind: "component", id: component.id });
      return next;
    },
    [timeline]
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
    (componentId: string, patch: Partial<TimedComponent>) => {
      const next = patchComponent({ timeline, componentId, patch });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const moveComponentInTimeline = useCallback(
    (componentId: string, newStartFrame: number) => {
      const next = moveComponent({ timeline, componentId, newStartFrame });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const trimComponentStartInTimeline = useCallback(
    (componentId: string, deltaFrames: number) => {
      const next = trimComponentStart({ timeline, componentId, deltaFrames });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const trimComponentEndInTimeline = useCallback(
    (componentId: string, deltaFrames: number) => {
      const next = trimComponentEnd({ timeline, componentId, deltaFrames });
      setTimeline(next);
      return next;
    },
    [timeline]
  );

  const removeComponentFromTimeline = useCallback(
    (componentId: string) => {
      const next = removeComponent({ timeline, componentId });
      setTimeline(next);
      if (selection?.kind === "component" && selection.id === componentId) setSelection(null);
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
      addLane: addLaneToTimeline,
      deleteLane: deleteLaneFromTimeline,
      addComponent: addComponentToTimeline,
      addComponentAtFrame: addComponentAtFrameToTimeline,
      moveComponent: moveComponentInTimeline,
      trimComponentStart: trimComponentStartInTimeline,
      trimComponentEnd: trimComponentEndInTimeline,
      removeComponent: removeComponentFromTimeline,
      editComponent: editComponentInTimeline,
      patchComponent: patchComponentInTimeline,
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
      addLaneToTimeline,
      deleteLaneFromTimeline,
      addComponentToTimeline,
      addComponentAtFrameToTimeline,
      moveComponentInTimeline,
      trimComponentStartInTimeline,
      trimComponentEndInTimeline,
      removeComponentFromTimeline,
      editComponentInTimeline,
      patchComponentInTimeline,
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
