import { Box, Container, type BoxProps } from "@chakra-ui/react";

type SectionProps = BoxProps & {
  /** Optional id for in-page anchor links. */
  anchor?: string;
  /** Max width of the inner container. */
  maxW?: string;
};

/** Consistent vertical rhythm + centered container for landing sections. */
const Section = ({ anchor, maxW = "6xl", children, ...rest }: SectionProps) => (
  <Box as="section" id={anchor} py={{ base: 16, md: 28 }} px={6} {...rest}>
    <Container maxW={maxW} px={0}>
      {children}
    </Container>
  </Box>
);

export default Section;
