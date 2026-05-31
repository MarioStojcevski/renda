import React, { useRef } from "react";
import Moveable from "react-moveable";
import { flushSync } from "react-dom";

import type { TimedComponent } from "@renda/shared/types/timed-component";
import { SceneCompositionInner } from "@renda/composition/scene-composition";

type Props = {
  components: TimedComponent[];
  sceneFrame: number;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onTransform?: (id: string, divStyles: React.CSSProperties) => void;
};

const readStylesFromElement = (el: HTMLElement): React.CSSProperties => ({
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
  const selectedTarget = selectedId ? targetsRef.current[selectedId] : null;
  const selectedComponent = components.find((c) => c.id === selectedId);
  const lockTransform = selectedComponent?.type === "Background";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SceneCompositionInner
        components={components}
        sceneFrame={sceneFrame}
        selectedId={selectedId}
        interactive
        onSelect={onSelect}
        targetRefs={targetsRef}
      />
      {selectedTarget && selectedId && onTransform && !lockTransform && (
        <Moveable
          target={selectedTarget}
          flushSync={flushSync}
          draggable
          resizable
          rotatable
          throttleResize={1}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          onDrag={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            if (drag) target.style.transform = drag.transform;
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={({ target }) =>
            onTransform(selectedId, readStylesFromElement(target as HTMLElement))
          }
          onResizeEnd={({ target }) =>
            onTransform(selectedId, readStylesFromElement(target as HTMLElement))
          }
          onRotateEnd={({ target }) =>
            onTransform(selectedId, readStylesFromElement(target as HTMLElement))
          }
        />
      )}
    </div>
  );
};
