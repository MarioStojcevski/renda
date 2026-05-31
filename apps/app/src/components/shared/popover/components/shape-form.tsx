import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { defaultShapeStyles } from "@renda/shared/lib/component-defaults";
import { FPS } from "@renda/shared/lib/video";
import type { ShapeKind } from "@renda/shared/types/components/shape-component";
import { useTimeline } from "../../../../providers/timeline";

const ShapeForm = () => {
  const { addComponent, timeline, playheadFrame } = useTimeline();
  const [shape, setShape] = useState<ShapeKind>("rectangle");
  const [fill, setFill] = useState("#14b8a6");
  const [stroke, setStroke] = useState("#0f766e");

  const handleAdd = () => {
    const videoLane = timeline.lanes.find((l) => l.type === "video");
    if (!videoLane) return;
    addComponent({
      id: uuid(),
      type: "Shape",
      shape,
      fill,
      stroke,
      strokeWidth: shape === "line" ? 4 : 2,
      startFrame: playheadFrame,
      duration: FPS * 5,
      divStyles: {
        ...defaultShapeStyles,
        ...(shape === "line" ? { height: 4, width: 320 } : {}),
      },
    }, videoLane.id);
  };

  return (
    <VStack align="stretch" spacing={3}>
      <FormControl>
        <FormLabel fontSize="xs">Shape</FormLabel>
        <Select size="sm" value={shape} onChange={(e) => setShape(e.target.value as ShapeKind)}>
          <option value="rectangle">Rectangle</option>
          <option value="ellipse">Ellipse</option>
          <option value="line">Line</option>
        </Select>
      </FormControl>
      {shape !== "line" && (
        <FormControl>
          <FormLabel fontSize="xs">Fill</FormLabel>
          <Input size="sm" value={fill} onChange={(e) => setFill(e.target.value)} />
        </FormControl>
      )}
      <FormControl>
        <FormLabel fontSize="xs">{shape === "line" ? "Line color" : "Stroke"}</FormLabel>
        <Input size="sm" value={stroke} onChange={(e) => setStroke(e.target.value)} />
      </FormControl>
      <Button w="full" colorScheme="brand" onClick={handleAdd}>
        Add shape
      </Button>
    </VStack>
  );
};

export default ShapeForm;
