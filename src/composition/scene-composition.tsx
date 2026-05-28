import React, { useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import Moveable from "react-moveable";
import { flushSync } from "react-dom";

import { getComponentStyleAtFrame } from "../lib/keyframes";
import { sortComponentsForRender } from "../lib/sort-components";
import type { SceneComponentType } from "../types/scene-component";
import {
  isBackground,
  isGif,
  isImage,
  isLottie,
  isShape,
  isSlotMachine,
  isText,
  isVideo,
} from "./guards";
import BackgroundRenderer from "./renderers/background-component";
import GifRenderer from "./renderers/gif-component";
import ImageRenderer from "./renderers/image-component";
import LottieRenderer from "./renderers/lottie-component";
import ShapeRenderer from "./renderers/shape-component";
import SlotMachineRenderer from "./renderers/slot-machine-component";
import TextRenderer from "./renderers/text-component";
import VideoRenderer from "./renderers/video-component";

type InnerProps = {
  components: SceneComponentType[];
  sceneFrame: number;
  selectedId?: string | null;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  onTransform?: (id: string, divStyles: React.CSSProperties) => void;
};

const renderContent = (
  component: SceneComponentType,
  frame: number,
  remotion: boolean
) => {
  if (isBackground(component)) return <BackgroundRenderer {...component} />;
  if (isShape(component)) return <ShapeRenderer {...component} />;
  if (isText(component)) return <TextRenderer {...component} />;
  if (isImage(component)) return <ImageRenderer {...component} remotion={remotion} />;
  if (isVideo(component)) return <VideoRenderer {...component} remotion={remotion} />;
  if (isLottie(component)) return <LottieRenderer {...component} remotion={remotion} />;
  if (isGif(component)) return <GifRenderer {...component} remotion={remotion} />;
  if (isSlotMachine(component)) {
    return <SlotMachineRenderer {...component} frame={frame} remotion={remotion} />;
  }
  return null;
};

const readStylesFromElement = (el: HTMLElement): React.CSSProperties => ({
  position: "absolute",
  left: el.style.left || `${el.offsetLeft}px`,
  top: el.style.top || `${el.offsetTop}px`,
  width: el.style.width || `${el.offsetWidth}px`,
  height: el.style.height || `${el.offsetHeight}px`,
  transform: el.style.transform || undefined,
});

const SceneCompositionInner: React.FC<InnerProps> = ({
  components,
  sceneFrame,
  selectedId = null,
  interactive = false,
  onSelect,
  onTransform,
}) => {
  const sorted = useMemo(() => sortComponentsForRender(components), [components]);
  const targetsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const selectedTarget = selectedId ? targetsRef.current[selectedId] : null;
  const selectedComponent = sorted.find((c) => c.id === selectedId);
  const lockTransform = selectedComponent?.type === "Background";

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {sorted.map((component) => {
        const style = getComponentStyleAtFrame(component, sceneFrame);
        const selected = selectedId === component.id;
        const isBack = component.type === "Background";

        return (
          <div
            key={component.id}
            ref={(el) => {
              targetsRef.current[component.id] = el;
            }}
            style={{
              ...style,
              outline: selected ? "2px solid #2dd4bf" : undefined,
              outlineOffset: selected ? 2 : undefined,
              cursor: interactive && !isBack ? "pointer" : undefined,
              pointerEvents: isBack && !interactive ? "none" : undefined,
            }}
            onClick={(e) => {
              if (!interactive) return;
              e.stopPropagation();
              onSelect?.(component.id);
            }}
          >
            {renderContent(component, sceneFrame, !interactive)}
          </div>
        );
      })}

      {interactive && selectedTarget && selectedId && onTransform && !lockTransform && (
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

type Props = {
  components: SceneComponentType[];
  selectedId?: string | null;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  onTransform?: (id: string, divStyles: React.CSSProperties) => void;
};

/** Used inside Remotion Player / export — pulls frame from Remotion context. */
export const SceneComposition: React.FC<Props> = (props) => {
  const sceneFrame = useCurrentFrame();
  return <SceneCompositionInner sceneFrame={sceneFrame} {...props} />;
};

/** Used in the editor overlay (outside Remotion). */
export const EditableSceneLayer: React.FC<InnerProps> = (props) => (
  <SceneCompositionInner {...props} />
);
