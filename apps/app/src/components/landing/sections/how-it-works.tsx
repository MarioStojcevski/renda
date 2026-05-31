import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";

import Section from "../section";
import { workSteps } from "../data";

const HowItWorks = () => (
  <Section maxW="4xl">
    <VStack spacing={4} mb={{ base: 10, md: 14 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        Here's what a real workflow looks like
      </Heading>
    </VStack>

    <VStack align="stretch" spacing={0}>
      {workSteps.map((step, i) => (
        <Flex key={step.title} gap={6} align="stretch">
          {/* Timeline rail */}
          <Flex direction="column" align="center" flexShrink={0}>
            <Flex
              align="center"
              justify="center"
              w={10}
              h={10}
              borderRadius="full"
              bg="accent"
              color="white"
              fontWeight="bold"
              fontSize="sm"
            >
              {i + 1}
            </Flex>
            {i < workSteps.length - 1 && (
              <Box flex={1} w="2px" bg="border.strong" my={2} minH={6} />
            )}
          </Flex>

          <Box pb={i < workSteps.length - 1 ? 10 : 0}>
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.08em"
              color="accent.hover"
              fontWeight="semibold"
              mb={1}
            >
              {step.step}
            </Text>
            <Heading as="h3" fontSize="xl" mb={2}>
              {step.title}
            </Heading>
            <Text color="text.muted" lineHeight="tall" maxW="2xl">
              {step.body}
            </Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  </Section>
);

export default HowItWorks;
