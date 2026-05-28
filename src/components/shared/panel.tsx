import { Box, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PanelProps = BoxProps & {
  title?: string;
  children: ReactNode;
};

const Panel = ({ title, children, ...props }: PanelProps) => (
  <Box
    bg="bg.surface"
    border="1px solid"
    borderColor="border.subtle"
    borderRadius="lg"
    p={4}
    {...props}
  >
    {title && (
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="text.muted" mb={3}>
        {title}
      </Text>
    )}
    {children}
  </Box>
);

export default Panel;
