import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  Center,
  PopoverBody,
  SimpleGrid,
  Input,
} from "@chakra-ui/react";

type ColorPickerProps = {
  color: string;
  colors: string[];
  setColorHandler: (color: string) => void;
};

const ColorPicker = ({ color, colors, setColorHandler }: ColorPickerProps) => {
  return (
    <Popover variant="picker">
      <PopoverTrigger>
        <Button
          aria-label={color}
          background={color}
          height="40px"
          width="100%"
          padding={0}
          minWidth="unset"
          borderRadius={3}
          border="2px"
          borderColor="divider"
        />
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow bg={color} />
        <PopoverCloseButton color="white" />
        <PopoverHeader
          height="100px"
          backgroundColor={color}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
        >
          <Center height="100%" />
        </PopoverHeader>
        <PopoverBody>
          <SimpleGrid columns={5} spacing={2}>
            {colors.map((c) => (
              <Button
                key={c}
                aria-label={c}
                background={c}
                height="25px"
                width="25px"
                padding={0}
                minWidth="unset"
                borderRadius={3}
                border="1px"
                borderColor="divider"
                _hover={{ background: c }}
                onClick={() => setColorHandler(c)}
              />
            ))}
          </SimpleGrid>
          <Input
            marginTop={3}
            size="sm"
            value={color}
            onChange={() => setColorHandler(color)}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
