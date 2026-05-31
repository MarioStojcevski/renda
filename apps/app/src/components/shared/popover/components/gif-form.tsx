import { VStack, FormLabel, Input, Button, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { defaultMediaStyles } from "@renda/shared/lib/component-defaults";
import { FPS } from "@renda/shared/lib/video";
import { useTimeline } from "../../../../providers/timeline";

const GifForm = () => {
  const { addComponent, timeline, playheadFrame } = useTimeline();
  const [src, setSrc] = useState(import.meta.env.VITE_GIF_DEFAULT_URL ?? "");

  const handleClick = () => {
    if (!src.trim()) return;
    const videoLane = timeline.lanes.find((l) => l.type === "video");
    if (!videoLane) return;
    addComponent({
      id: uuid(),
      type: "Gif",
      src: src.trim(),
      startFrame: playheadFrame,
      duration: FPS * 5,
      divStyles: { ...defaultMediaStyles },
    }, videoLane.id);
  };

  return (
    <form>
      <VStack m="1">
        <FormLabel textAlign="left" w="100%">
          Link to gif
        </FormLabel>
        <Input
          m="1"
          w="100%"
          placeholder="gif.com"
          onChange={(event) => setSrc(event.target.value)}
        />
      </VStack>

      <Spacer />

      <Button w="full" colorScheme="brand" onClick={handleClick}>
        Add
      </Button>
    </form>
  );
};

export default GifForm;
