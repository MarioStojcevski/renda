import { Badge, Box, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  ChatIcon,
  SettingsIcon,
  StarIcon,
  AtSignIcon,
  EditIcon,
  CopyIcon,
} from "@chakra-ui/icons";
import type { ComponentType } from "react";

import Section from "../section";
import { features } from "../data";

const icons: ComponentType[] = [ChatIcon, SettingsIcon, AtSignIcon, StarIcon, EditIcon, CopyIcon];

const Features = () => (
  <Section anchor="features">
    <VStack spacing={4} mb={{ base: 10, md: 16 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        Everything you need. Nothing you don't.
      </Heading>
    </VStack>

    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {features.map((feature, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Box
            key={feature.title}
            p={7}
            borderRadius="panel"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            transition="border-color 0.2s, transform 0.2s"
            _hover={{ borderColor: "accent.muted", transform: "translateY(-2px)" }}
          >
            <Flex
              align="center"
              justify="center"
              w={11}
              h={11}
              borderRadius="control"
              bg="accent.subtle"
              color="accent.hover"
              mb={5}
            >
              <Icon />
            </Flex>
            <Flex align="center" gap={2} mb={2}>
              <Heading as="h3" fontSize="lg">
                {feature.title}
              </Heading>
              {feature.badge && (
                <Badge
                  bg="accent.subtle"
                  color="accent.hover"
                  borderRadius="full"
                  px={2}
                  textTransform="none"
                  fontSize="2xs"
                >
                  {feature.badge}
                </Badge>
              )}
            </Flex>
            <Text color="text.muted" lineHeight="tall" fontSize="sm">
              {feature.body}
            </Text>
          </Box>
        );
      })}
    </SimpleGrid>
  </Section>
);

export default Features;
