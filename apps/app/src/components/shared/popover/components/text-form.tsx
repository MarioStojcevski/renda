import { Button, FormLabel, HStack, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { FPS } from "@renda/shared/lib/video";
import { useTimeline } from "../../../../providers/timeline";
import ColorPicker from "../../color-picker";
import availableColors from "../../color-picker/colors";

const TextForm = () => {
  const [textColor, setTextColor] = useState<string>("white");
  const [textSize, setTextSize] = useState<number>(25);
  const [text, setText] = useState<string>("");
  const { addComponent, timeline, playheadFrame } = useTimeline();

  const handleClick = () => {
    const videoLane = timeline.lanes.find((l) => l.type === "video");
    if (!videoLane) return;
    addComponent({
      id: uuid(),
      type: "Text",
      animation: "Placeholder",
      content: text,
      startFrame: playheadFrame,
      duration: FPS * 5,
      textStyles: {
        color: textColor,
        fontSize: textSize,
        fontWeight: 400,
      },
      divStyles: {
        position: "absolute",
        left: 120,
        top: 120,
        width: 600,
        height: 80,
        zIndex: 3,
      },
    }, videoLane.id);
  };

  return (
    <form>
      <Input
        m="1"
        w="100%"
        placeholder="Write Something Here.."
        onChange={(event) => setText(event.target.value)}
      />
      <HStack w="100%" m="1">
        <VStack w="60%" m="1">
          <FormLabel textAlign="left" w="100%">
            Text Size
          </FormLabel>
          <Input
            m="1"
            w="100%"
            type="number"
            placeholder="25"
            onChange={(event) => setTextSize(parseInt(event.target.value, 10))}
          />
        </VStack>
        <VStack w="40%">
          <FormLabel textAlign="left" w="100%">
            Text Color
          </FormLabel>
          <ColorPicker
            color={textColor}
            setColorHandler={(color) => setTextColor(color)}
            colors={availableColors}
          />
        </VStack>
      </HStack>
      <Button w="full" colorScheme="brand" onClick={handleClick}>
        Add
      </Button>
    </form>
  );
};

export default TextForm;
