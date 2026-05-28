import {
  type ThemeConfig,
  extendTheme,
  type StyleFunctionProps,
} from "@chakra-ui/react";

/**
 * renda — dark-only design system.
 *
 * Palette is inspired by Adobe Premiere Pro / DaVinci Resolve / Final Cut:
 * a neutral charcoal scale that is intentionally dark to keep focus on the
 * work, but never pitch black. Panels sit on top of a darker "seam" so the
 * layout reads clearly without heavy borders.
 *
 * Token contract (also mirrored as CSS variables in `index.css`):
 *
 *   bg.app        deepest layer / seam between panels
 *   bg.canvas     main work area background (alias of bg.app today)
 *   bg.surface    panels & sidebars (one step lighter than canvas)
 *   bg.subtle     sub-sections inside a panel (inputs, track lanes)
 *   bg.elevated   floating UI: modals, menus, popovers
 *   bg.preview    the video preview area (very dark, near-black)
 *   bg.hover      neutral hover overlay
 *   bg.active     neutral pressed/active overlay
 *   bg.selected   tinted accent selection overlay
 *
 *   border.divider  crisp panel-to-panel seam (darker than panels)
 *   border.subtle   default UI border
 *   border.strong   emphasized border (focus rings, dividers)
 *
 *   text.primary    body / titles
 *   text.secondary  default copy
 *   text.muted      labels, helper text
 *   text.disabled   disabled state
 *
 *   accent          brand primary (teal)
 *   accent.hover    brand hover
 *   accent.muted    brand pressed / outline
 *   accent.subtle   tinted accent surface
 *
 *   danger / warning / success — semantic status colors
 */

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

const palette = {
  bg: {
    app: "#131317",
    canvas: "#131317",
    surface: "#232328",
    subtle: "#1a1a1e",
    elevated: "#2d2d33",
    preview: "#0a0a0c",
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.09)",
    selected: "rgba(20, 184, 166, 0.18)",
    scrim: "rgba(0, 0, 0, 0.6)",
  },
  border: {
    divider: "#0e0e11",
    subtle: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
  },
  text: {
    primary: "#e6e6ea",
    secondary: "#b8b8c0",
    muted: "#8b8b94",
    disabled: "#5a5a62",
  },
  accent: {
    base: "#14b8a6",
    hover: "#2dd4bf",
    muted: "#0f766e",
    subtle: "rgba(20, 184, 166, 0.16)",
  },
  status: {
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
  },
} as const;

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
      "bg.app": palette.bg.app,
      "bg.canvas": palette.bg.canvas,
      "bg.surface": palette.bg.surface,
      "bg.subtle": palette.bg.subtle,
      "bg.elevated": palette.bg.elevated,
      "bg.preview": palette.bg.preview,
      "bg.hover": palette.bg.hover,
      "bg.active": palette.bg.active,
      "bg.selected": palette.bg.selected,
      "bg.scrim": palette.bg.scrim,

      "border.divider": palette.border.divider,
      "border.subtle": palette.border.subtle,
      "border.strong": palette.border.strong,

      "text.primary": palette.text.primary,
      "text.secondary": palette.text.secondary,
      "text.muted": palette.text.muted,
      "text.disabled": palette.text.disabled,

      "accent": palette.accent.base,
      "accent.hover": palette.accent.hover,
      "accent.muted": palette.accent.muted,
      "accent.subtle": palette.accent.subtle,

      "status.danger": palette.status.danger,
      "status.warning": palette.status.warning,
      "status.success": palette.status.success,

      "chakra-body-bg": palette.bg.canvas,
      "chakra-body-text": palette.text.primary,
      "chakra-border-color": palette.border.subtle,
      "chakra-subtle-bg": palette.bg.subtle,
    },
    radii: {
      "panel": "8px",
      "control": "6px",
    },
  },
  radii: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  shadows: {
    panel:
      "0 1px 0 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
    elevated:
      "0 10px 24px -8px rgba(0, 0, 0, 0.55), 0 4px 8px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
    focusRing: `0 0 0 2px ${palette.accent.subtle}`,
  },
  styles: {
    global: (_props: StyleFunctionProps) => ({
      "html, body": {
        bg: "bg.canvas",
        color: "text.primary",
        colorScheme: "dark",
      },
      "::selection": {
        background: palette.accent.subtle,
        color: palette.text.primary,
      },
      "*::-webkit-scrollbar": {
        width: "10px",
        height: "10px",
      },
      "*::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "*::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255, 255, 255, 0.16)",
        backgroundClip: "content-box",
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm",
      },
      baseStyle: {
        fontWeight: "medium",
        borderRadius: "control",
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorScheme === "brand" ? "accent" : undefined,
          color: props.colorScheme === "brand" ? "white" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "accent.hover" : undefined,
          },
          _active: {
            bg: props.colorScheme === "brand" ? "accent.muted" : undefined,
          },
        }),
        ghost: {
          color: "text.secondary",
          _hover: { bg: "bg.hover", color: "text.primary" },
          _active: { bg: "bg.active" },
        },
        outline: {
          borderColor: "border.subtle",
          color: "text.secondary",
          _hover: { bg: "bg.hover", color: "text.primary" },
          _active: { bg: "bg.active" },
        },
      },
    },
    IconButton: {
      defaultProps: {
        size: "sm",
        variant: "ghost",
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
            bg: "bg.subtle",
            border: "1px solid",
            borderColor: "border.subtle",
            color: "text.primary",
            _hover: { bg: "bg.subtle", borderColor: "border.strong" },
            _focusVisible: {
              bg: "bg.subtle",
              borderColor: "accent",
              boxShadow: "focusRing",
            },
            _placeholder: { color: "text.disabled" },
          },
        },
      },
    },
    NumberInput: {
      defaultProps: {
        size: "sm",
        variant: "filled",
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
        variant: "filled",
      },
      variants: {
        filled: {
          field: {
            bg: "bg.subtle",
            border: "1px solid",
            borderColor: "border.subtle",
            color: "text.primary",
            _hover: { bg: "bg.subtle", borderColor: "border.strong" },
            _focusVisible: {
              bg: "bg.subtle",
              borderColor: "accent",
              boxShadow: "focusRing",
            },
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "bg.elevated",
          borderColor: "border.subtle",
          boxShadow: "elevated",
          py: 1,
        },
        item: {
          bg: "transparent",
          color: "text.secondary",
          _hover: { bg: "bg.hover", color: "text.primary" },
          _focus: { bg: "bg.hover", color: "text.primary" },
        },
        divider: {
          borderColor: "border.subtle",
        },
      },
    },
    Popover: {
      baseStyle: {
        content: {
          bg: "bg.elevated",
          borderColor: "border.subtle",
          boxShadow: "elevated",
        },
        header: {
          borderColor: "border.subtle",
          color: "text.primary",
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "bg.elevated",
          borderColor: "border.subtle",
          borderWidth: "1px",
          boxShadow: "elevated",
        },
        overlay: {
          bg: "bg.scrim",
          backdropFilter: "blur(2px)",
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: "bg.elevated",
        color: "text.primary",
        borderRadius: "control",
        fontSize: "xs",
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "border.subtle",
      },
    },
  },
});

export default theme;
