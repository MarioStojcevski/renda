import {
  type ThemeConfig,
  extendTheme,
  type StyleFunctionProps,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `"Poppins", system-ui, sans-serif`,
    body: `"Poppins", system-ui, sans-serif`,
  },
  colors: {
    brand: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
  },
  semanticTokens: {
    colors: {
      "bg.canvas": { default: "gray.50", _dark: "#09090b" },
      "bg.surface": { default: "white", _dark: "#141416" },
      "bg.elevated": { default: "gray.50", _dark: "#1c1c1f" },
      "border.subtle": { default: "gray.200", _dark: "whiteAlpha.200" },
      "text.muted": { default: "gray.600", _dark: "gray.400" },
      "accent": { default: "brand.600", _dark: "brand.400" },
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: "bg.canvas",
        color: "chakra-body-text",
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm",
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.400" : undefined,
          },
        }),
        ghost: {
          _hover: { bg: "whiteAlpha.100" },
        },
      },
    },
    Input: {
      defaultProps: {
        size: "sm",
        variant: "filled",
      },
      variants: {
        filled: {
          field: {
            bg: "bg.elevated",
            border: "1px solid",
            borderColor: "border.subtle",
            _hover: { bg: "bg.elevated" },
            _focus: {
              bg: "bg.elevated",
              borderColor: "brand.500",
            },
          },
        },
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
        variant: "filled",
      },
    },
  },
});

export default theme;
