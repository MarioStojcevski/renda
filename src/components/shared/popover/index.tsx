import type { ReactNode } from "react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

import GifForm from "./components/gif-form";
import ShapeForm from "./components/shape-form";
import TextForm from "./components/text-form";
import type { RendaMediaType } from "./utils/popover-types";

const forms: Record<RendaMediaType, ReactNode> = {
  Text: <TextForm />,
  Shape: <ShapeForm />,
  Gif: <GifForm />,
};

const PopoverComponent = ({ type }: { type: RendaMediaType }) => (
  <Popover placement="right-start">
    <PopoverTrigger>
      <Button size="sm" variant="outline" w="full" justifyContent="flex-start">
        {type}
      </Button>
    </PopoverTrigger>
    <PopoverContent bg="bg.elevated" borderColor="border.subtle" w="260px">
      <PopoverArrow bg="bg.elevated" />
      <PopoverCloseButton />
      <PopoverHeader borderColor="border.subtle" fontSize="sm" py={2}>
        Add {type}
      </PopoverHeader>
      <PopoverBody pb={4}>{forms[type]}</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default PopoverComponent;
