import { Box, Button, Heading, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const CtaSection = () => (
  <Box as="section" px={6} py={{ base: 16, md: 28 }}>
    <Box
      maxW="4xl"
      mx="auto"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      border="1px solid"
      borderColor="accent.muted"
      bg="bg.surface"
      px={{ base: 8, md: 16 }}
      py={{ base: 12, md: 16 }}
      textAlign="center"
    >
      <Box
        position="absolute"
        top="-40%"
        left="50%"
        transform="translateX(-50%)"
        w="700px"
        maxW="100vw"
        h="400px"
        bgGradient="radial(closest-side, rgba(20,184,166,0.22), transparent)"
        pointerEvents="none"
      />

      <VStack position="relative" spacing={6}>
        <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em" maxW="2xl">
          Stop spending 2 hours editing a 60-second video.
        </Heading>

        <Text color="text.secondary" fontSize={{ base: "md", md: "lg" }} maxW="xl" lineHeight="tall">
          Renda is free to start. No credit card. No watermarks on the free plan.
          Describe a video. Get a draft. Export. Done.
        </Text>

        <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={2} align="center">
          <Button as={RouterLink} to="/editor" colorScheme="brand" size="lg" px={8}>
            Get Started Free
          </Button>
          <Link href="#" color="text.secondary" fontSize="sm" _hover={{ color: "text.primary" }}>
            Or watch a 2-minute demo →
          </Link>
        </Stack>
      </VStack>
    </Box>
  </Box>
);

export default CtaSection;
