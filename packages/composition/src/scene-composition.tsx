import React, { useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";

import { getComponentStyleAtFrame } from "@renda/shared/lib/keyframes";
import { sortComponentsForRender } from "@renda/shared/lib/sort-components";
import type { TimedComponent } from "@renda/shared/types/timed-component";
import {
  isBackground,
  isGif,
  isImage,
  isLottie,
  isShape,
  isText,
  isVideo,
} from "./guards";
import BackgroundRenderer from "./renderers/background-component";
import GifRenderer from "./renderers/gif-component";
import ImageRenderer from "./renderers/image-component";
import LottieRenderer from "./renderers/lottie-component";
import ShapeRenderer from "./renderers/shape-component";
import TextRenderer from "./renderers/text-component";
import VideoRenderer from "./renderers/video-component";

export type SceneCompositionInnerProps = {
  components: TimedComponent[];
  sceneFrame: number;
  selectedId?: string | null;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  targetRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  /** Live drag/resize overrides keyed by component id (editor only). */
  styleOverrides?: Record<string, CSSProperties>;
};

const renderContent = (
  component: TimedComponent,
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
  return null;
};

export const SceneCompositionInner: React.FC<SceneCompositionInnerProps> = ({
  components,
  sceneFrame,
  selectedId = null,
  interactive = false,
  onSelect,
  targetRefs,
  styleOverrides,
}) => {
  const sorted = useMemo(() => sortComponentsForRender(components), [components]);
  const internalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const refs = targetRefs ?? internalRefs;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {sorted.map((component) => {
        const style = {
          ...getComponentStyleAtFrame(component, sceneFrame),
          ...styleOverrides?.[component.id],
        };
        const selected = selectedId === component.id;
        const isBack = component.type === "Background";

        return (
          <div
            key={component.id}
            ref={(el) => {
              refs.current[component.id] = el;
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
    </div>
  );
};

type Props = {
  components: TimedComponent[];
  selectedId?: string | null;
  interactive?: boolean;
  onSelect?: (id: string) => void;
};

/** Used inside Remotion Player / export — pulls frame from Remotion context. */
export const SceneComposition: React.FC<Props> = (props) => {
  const sceneFrame = useCurrentFrame();
  return <SceneCompositionInner sceneFrame={sceneFrame} {...props} />;
};
