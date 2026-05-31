import { Box, Heading, Stack, Text, VStack } from "@chakra-ui/react";

import Section from "../section";

const comparisons = [
  { tool: "Premiere", verdict: "Too expensive and too much." },
  { tool: "CapCut", verdict: "Works, but you're learning a new tool every month." },
  { tool: "Canva", verdict: "Beautiful templates, but no real timeline control." },
];

const Problem = () => (
  <Section maxW="4xl">
    <VStack spacing={8} align="stretch">
      <Heading
        as="h2"
        fontSize={{ base: "2xl", md: "4xl" }}
        letterSpacing="-0.02em"
        textAlign="center"
      >
        Most creators spend more time editing than creating.
      </Heading>

      <Text fontSize={{ base: "md", md: "lg" }} color="text.secondary" textAlign="center" maxW="2xl" mx="auto" lineHeight="tall">
        You've got an idea. You record it. Then you're trapped in a software maze for two hours.
      </Text>

      <Stack spacing={3} maxW="xl" mx="auto" w="full">
        {comparisons.map((c) => (
          <Box
            key={c.tool}
            display="flex"
            gap={3}
            alignItems="baseline"
            p={4}
            borderRadius="panel"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
          >
            <Text fontWeight="semibold" color="text.primary" minW="84px">
              {c.tool}?
            </Text>
            <Text color="text.muted">{c.verdict}</Text>
          </Box>
        ))}
      </Stack>

      <Text
        fontSize={{ base: "lg", md: "xl" }}
        fontWeight="semibold"
        textAlign="center"
        pt={2}
      >
        Your real problem isn't the software.{" "}
        <Box as="span" color="accent.hover">
          It's the blank canvas.
        </Box>
      </Text>
    </VStack>
  </Section>
);

export default Problem;
