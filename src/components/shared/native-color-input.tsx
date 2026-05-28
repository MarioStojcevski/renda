import { FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

const toPickerHex = (value: string) => (HEX_RE.test(value) ? value : "#131317");

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  allowGradient?: boolean;
};

const NativeColorInput = ({ label, value, onChange, allowGradient = true }: Props) => (
  <FormControl>
    {label && (
      <FormLabel fontSize="xs" mb={1}>
        {label}
      </FormLabel>
    )}
    <HStack spacing={2}>
      <Input
        type="color"
        value={toPickerHex(value)}
        onChange={(e) => onChange(e.target.value)}
        w="44px"
        h="32px"
        minW="44px"
        p={0}
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="md"
        cursor="pointer"
        sx={{
          "&::-webkit-color-swatch-wrapper": { padding: "2px" },
          "&::-webkit-color-swatch": { border: "none", borderRadius: "4px" },
        }}
      />
      <Input
        size="sm"
        flex={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={allowGradient ? "#131317 or linear-gradient(...)" : "#131317"}
      />
    </HStack>
  </FormControl>
);

export default NativeColorInput;
