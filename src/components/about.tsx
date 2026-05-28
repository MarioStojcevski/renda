import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Suspense } from "react";

import LoadingSpinner from "./shared/loading-spinner";

const About = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Box maxW="lg" mx="auto" py={16} px={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">renda</Heading>
        <Text color="text.muted" lineHeight="tall">
          A simple editor for product videos. Build scenes, add components, save templates,
          and export with Remotion.
        </Text>
      </VStack>
    </Box>
  </Suspense>
);

export default About;
