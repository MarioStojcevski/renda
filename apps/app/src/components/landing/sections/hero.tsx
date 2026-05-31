import { Badge, Box, Button, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import EditorMock from "./editor-mock";

const Hero = () => (
  <Box
    as="section"
    position="relative"
    overflow="hidden"
    px={6}
    pt={{ base: 16, md: 24 }}
    pb={{ base: 16, md: 24 }}
  >
    {/* Ambient glow */}
    <Box
      position="absolute"
      top="-20%"
      left="50%"
      transform="translateX(-50%)"
      w="900px"
      maxW="100vw"
      h="600px"
      bgGradient="radial(closest-side, rgba(20,184,166,0.18), transparent)"
      pointerEvents="none"
    />

    <VStack position="relative" maxW="4xl" mx="auto" spacing={6} textAlign="center">
      <Badge
        px={3}
        py={1}
        borderRadius="full"
        bg="accent.subtle"
        color="accent.hover"
        fontWeight="medium"
        textTransform="none"
        fontSize="xs"
      >
        AI video editing, now in early access
      </Badge>

      <Heading
        as="h1"
        fontSize={{ base: "4xl", md: "6xl" }}
        lineHeight="1.05"
        letterSpacing="-0.03em"
        fontWeight="bold"
      >
        Describe your video.{" "}
        <Box as="span" color="accent.hover">
          We'll build the first draft.
        </Box>
      </Heading>

      <Text fontSize={{ base: "lg", md: "xl" }} color="text.secondary" maxW="2xl" lineHeight="tall">
        Stop staring at blank timelines. Tell Renda what you want. Get a polished
        video in 30 seconds. Tweak it in seconds more. Ship it.
      </Text>

      <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={2}>
        <Button as={RouterLink} to="/waitlist" colorScheme="brand" size="lg" px={8}>
          Get Early Access
        </Button>
        <Button as={RouterLink} to="/editor" variant="outline" size="lg" px={8}>
          Open the editor
        </Button>
      </Stack>

      <HStack spacing={2} color="text.muted" fontSize="sm" pt={1}>
        <Text>
          For solopreneurs, course creators, and marketers who make videos but hate editing.
        </Text>
      </HStack>
    </VStack>

    <Box position="relative" maxW="5xl" mx="auto" mt={{ base: 12, md: 16 }}>
      <EditorMock />
    </Box>
  </Box>
);

export default Hero;
