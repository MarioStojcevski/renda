import { Box, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import Section from "../section";
import { solutionSteps } from "../data";

const Solution = () => (
  <Section anchor="how-it-works" bg="bg.subtle">
    <VStack spacing={4} mb={{ base: 10, md: 16 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        Describe it. Generate it. Refine it. Ship it.
      </Heading>
    </VStack>

    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      {solutionSteps.map((step, i) => (
        <Box
          key={step.title}
          position="relative"
          p={8}
          borderRadius="panel"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
        >
          <Flex
            align="center"
            justify="center"
            w={12}
            h={12}
            borderRadius="full"
            bg="accent.subtle"
            color="accent.hover"
            fontWeight="bold"
            fontSize="xl"
            mb={5}
          >
            {step.badge}
          </Flex>
          <Heading as="h3" fontSize="xl" mb={3}>
            {step.title}
          </Heading>
          <Text color="text.muted" lineHeight="tall">
            {step.body}
          </Text>

          {i < solutionSteps.length - 1 && (
            <Box
              display={{ base: "none", md: "block" }}
              position="absolute"
              right="-21px"
              top="56px"
              color="accent.muted"
              fontSize="2xl"
              zIndex={1}
            >
              →
            </Box>
          )}
        </Box>
      ))}
    </SimpleGrid>
  </Section>
);

export default Solution;
