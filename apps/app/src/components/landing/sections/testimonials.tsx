import { Avatar, Box, Heading, SimpleGrid, Text, VStack, HStack } from "@chakra-ui/react";

import Section from "../section";
import { testimonials } from "../data";

const Testimonials = () => (
  <Section>
    <VStack spacing={4} mb={{ base: 10, md: 16 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        Real creators are already using rendalone.
      </Heading>
    </VStack>

    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      {testimonials.map((t) => (
        <VStack
          key={t.name}
          align="stretch"
          spacing={5}
          p={7}
          borderRadius="panel"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
        >
          <Text color="text.secondary" lineHeight="tall" flex={1}>
            "{t.quote}"
          </Text>
          <HStack spacing={3}>
            <Avatar name={t.name} size="sm" bg="accent.muted" color="white" />
            <Box>
              <Text fontWeight="semibold" fontSize="sm">
                {t.name}
              </Text>
              <Text fontSize="xs" color="text.muted">
                {t.title}
              </Text>
            </Box>
          </HStack>
        </VStack>
      ))}
    </SimpleGrid>
  </Section>
);

export default Testimonials;
