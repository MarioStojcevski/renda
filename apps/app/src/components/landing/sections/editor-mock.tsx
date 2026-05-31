import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";

const Dot = ({ color }: { color: string }) => (
  <Box w="10px" h="10px" borderRadius="full" bg={color} />
);

const trackClips = [
  { w: "28%", bg: "accent.muted", label: "Intro" },
  { w: "34%", bg: "brand.600", label: "Product" },
  { w: "22%", bg: "accent", label: "CTA" },
];

/** Stylized, static mock of the rendalone. editor used in the hero. */
const EditorMock = () => (
  <Box
    borderRadius="xl"
    overflow="hidden"
    border="1px solid"
    borderColor="border.strong"
    bg="bg.surface"
    boxShadow="elevated"
    w="full"
  >
    {/* Title bar */}
    <Flex
      h={9}
      px={4}
      align="center"
      justify="space-between"
      bg="bg.subtle"
      borderBottom="1px solid"
      borderColor="border.divider"
    >
      <HStack spacing={2}>
        <Dot color="status.danger" />
        <Dot color="status.warning" />
        <Dot color="status.success" />
      </HStack>
      <Text fontSize="xs" color="text.muted">
        rendalone. — launch-video.mp4
      </Text>
      <Box w={12} />
    </Flex>

    <Flex h={{ base: "260px", md: "340px" }}>
      {/* AI chat panel */}
      <VStack
        align="stretch"
        spacing={3}
        w={{ base: "42%", md: "38%" }}
        p={4}
        bg="bg.surface"
        borderRight="1px solid"
        borderColor="border.divider"
      >
        <Text fontSize="2xs" textTransform="uppercase" letterSpacing="0.08em" color="text.muted">
          AI Panel
        </Text>
        <Box
          alignSelf="flex-end"
          maxW="90%"
          bg="accent"
          color="white"
          px={3}
          py={2}
          borderRadius="lg"
          borderBottomRightRadius="sm"
          fontSize="xs"
        >
          Make a 60s launch video with my logo, upbeat music, and captions.
        </Box>
        <Box
          alignSelf="flex-start"
          maxW="90%"
          bg="bg.elevated"
          px={3}
          py={2}
          borderRadius="lg"
          borderBottomLeftRadius="sm"
          fontSize="xs"
          color="text.secondary"
        >
          Done — drafted 3 scenes with transitions and captions. Want me to swap the track?
        </Box>
        <HStack spacing={1} pt={1}>
          <Box w="6px" h="6px" borderRadius="full" bg="accent" />
          <Box w="6px" h="6px" borderRadius="full" bg="accent.muted" />
          <Box w="6px" h="6px" borderRadius="full" bg="border.strong" />
          <Text fontSize="2xs" color="text.muted" pl={1}>
            generating…
          </Text>
        </HStack>
      </VStack>

      {/* Preview + timeline */}
      <VStack align="stretch" flex={1} spacing={0}>
        <Flex flex={1} align="center" justify="center" bg="bg.preview" p={4}>
          <Box
            w="80%"
            h="78%"
            borderRadius="md"
            bgGradient="linear(135deg, brand.500, brand.800)"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                w={0}
                h={0}
                borderTop="14px solid transparent"
                borderBottom="14px solid transparent"
                borderLeft="22px solid"
                borderLeftColor="whiteAlpha.900"
                ml={2}
              />
            </Box>
            <Box
              position="absolute"
              bottom={3}
              left={3}
              right={3}
              h="6px"
              borderRadius="full"
              bg="blackAlpha.500"
            >
              <Box w="46%" h="full" borderRadius="full" bg="whiteAlpha.800" />
            </Box>
          </Box>
        </Flex>

        {/* Timeline */}
        <VStack
          align="stretch"
          spacing={2}
          p={3}
          bg="bg.subtle"
          borderTop="1px solid"
          borderColor="border.divider"
        >
          <HStack spacing={2}>
            {trackClips.map((clip) => (
              <Flex
                key={clip.label}
                w={clip.w}
                h={7}
                bg={clip.bg}
                borderRadius="sm"
                align="center"
                px={2}
              >
                <Text fontSize="2xs" color="whiteAlpha.900" noOfLines={1}>
                  {clip.label}
                </Text>
              </Flex>
            ))}
          </HStack>
          <Box h={5} borderRadius="sm" bg="bg.elevated" position="relative" overflow="hidden">
            <Flex h="full" align="center" px={2} gap="2px">
              {Array.from({ length: 40 }).map((_, i) => (
                <Box
                  key={i}
                  flex={1}
                  h={`${20 + ((i * 37) % 60)}%`}
                  bg="accent.muted"
                  opacity={0.7}
                  borderRadius="full"
                />
              ))}
            </Flex>
          </Box>
        </VStack>
      </VStack>
    </Flex>
  </Box>
);

export default EditorMock;
