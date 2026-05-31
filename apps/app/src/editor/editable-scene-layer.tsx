import React, { useLayoutEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { flushSync } from "react-dom";
import type { CSSProperties } from "react";

import type { TimedComponent } from "@renda/shared/types/timed-component";
import { SceneCompositionInner } from "@renda/composition/scene-composition";

type Props = {
  components: TimedComponent[];
  sceneFrame: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onTransform?: (id: string, divStyles: CSSProperties) => void;
};

const readStylesFromElement = (el: HTMLElement): CSSProperties => ({
  position: "absolute",
  left: el.style.left || `${el.offsetLeft}px`,
  top: el.style.top || `${el.offsetTop}px`,
  width: el.style.width || `${el.offsetWidth}px`,
  height: el.style.height || `${el.offsetHeight}px`,
  transform: el.style.transform || undefined,
});

/** Interactive editor overlay with drag/resize/rotate handles. */
export const EditableSceneLayer: React.FC<Props> = ({
  components,
  sceneFrame,
  selectedId = null,
  onSelect,
  onTransform,
}) => {
  const targetsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [moveableTarget, setMoveableTarget] = useState<HTMLElement | null>(null);
  const [liveStyles, setLiveStyles] = useState<Record<string, CSSProperties>>({});

  const selectedComponent = components.find((c) => c.id === selectedId);
  const lockTransform = selectedComponent?.type === "Background";

  useLayoutEffect(() => {
    if (!selectedId || lockTransform) {
      setMoveableTarget(null);
      return;
    }
    setMoveableTarget(targetsRef.current[selectedId] ?? null);
  }, [selectedId, lockTransform, components, sceneFrame]);

  const patchLive = (id: string, patch: CSSProperties) => {
    setLiveStyles((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const clearLive = (id: string) => {
    setLiveStyles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SceneCompositionInner
        components={components}
        sceneFrame={sceneFrame}
        selectedId={selectedId}
        interactive
        onSelect={onSelect}
        targetRefs={targetsRef}
        styleOverrides={liveStyles}
      />
      {moveableTarget && selectedId && onTransform && !lockTransform && (
        <Moveable
          target={moveableTarget}
          flushSync={flushSync}
          draggable
          resizable
          rotatable
          throttleDrag={0}
          throttleResize={0}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          onDrag={({ target, transform, left, top }) => {
            target.style.transform = transform;
            if (left !== undefined) target.style.left = `${left}px`;
            if (top !== undefined) target.style.top = `${top}px`;
            patchLive(selectedId, {
              transform,
              ...(left !== undefined ? { left: `${left}px` } : {}),
              ...(top !== undefined ? { top: `${top}px` } : {}),
            });
          }}
          onResize={({ target, width, height, drag, transform }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            if (drag) target.style.transform = drag.transform;
            patchLive(selectedId, {
              width: `${width}px`,
              height: `${height}px`,
              transform: drag?.transform ?? transform,
            });
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
            patchLive(selectedId, { transform });
          }}
          onDragEnd={({ target }) => {
            onTransform(selectedId, readStylesFromElement(target as HTMLElement));
            clearLive(selectedId);
          }}
          onResizeEnd={({ target }) => {
            onTransform(selectedId, readStylesFromElement(target as HTMLElement));
            clearLive(selectedId);
          }}
          onRotateEnd={({ target }) => {
            onTransform(selectedId, readStylesFromElement(target as HTMLElement));
            clearLive(selectedId);
          }}
        />
      )}
    </div>
  );
};
