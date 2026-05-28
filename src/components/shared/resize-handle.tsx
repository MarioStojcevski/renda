import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";

type Axis = "horizontal" | "vertical";

type Props = {
  axis: Axis;
  onResize: (delta: number) => void;
};

const ResizeHandle = ({ axis, onResize }: Props) => {
  const dragging = useRef(false);
  const startPos = useRef(0);
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startPos.current = axis === "horizontal" ? e.clientX : e.clientY;
    },
    [axis]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const pos = axis === "horizontal" ? e.clientX : e.clientY;
      const delta = pos - startPos.current;
      startPos.current = pos;
      onResizeRef.current(delta);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [axis]);

  return (
    <Box
      flexShrink={0}
      w={axis === "horizontal" ? "6px" : "100%"}
      h={axis === "horizontal" ? "100%" : "6px"}
      cursor={axis === "horizontal" ? "col-resize" : "row-resize"}
      bg="transparent"
      _hover={{ bg: "bg.hover" }}
      transition="background 120ms ease"
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation={axis === "horizontal" ? "vertical" : "horizontal"}
    />
  );
};

export default ResizeHandle;
