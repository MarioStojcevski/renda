import { VStack, FormLabel, Input, Button, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import { defaultMediaStyles } from "@renda/shared/lib/component-defaults";
import { useTimeline } from "../../../../providers/timeline";

const GifForm = () => {
  const { addComponent } = useTimeline();
  const [src, setSrc] = useState(import.meta.env.VITE_GIF_DEFAULT_URL ?? "");

  const handleClick = () => {
    if (!src.trim()) return;
    addComponent({
      id: uuid(),
      type: "Gif",
      src: src.trim(),
      divStyles: { ...defaultMediaStyles },
    });
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
