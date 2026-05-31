import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

import Section from "../section";
import { plans } from "../data";

const Pricing = () => (
  <Section anchor="pricing" bg="bg.subtle">
    <VStack spacing={4} mb={{ base: 10, md: 16 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        No gotchas. One price per plan. Forever.
      </Heading>
    </VStack>

    <Flex
      gap={6}
      direction={{ base: "column", lg: "row" }}
      align={{ base: "stretch", lg: "flex-start" }}
    >
      {plans.map((plan) => (
        <Box
          key={plan.name}
          flex={1}
          position="relative"
          p={8}
          borderRadius="panel"
          bg="bg.surface"
          border={plan.highlighted ? "2px solid" : "1px solid"}
          borderColor={plan.highlighted ? "accent" : "border.subtle"}
          boxShadow={plan.highlighted ? "elevated" : undefined}
          transform={{ lg: plan.highlighted ? "scale(1.03)" : undefined }}
        >
          {plan.highlighted && (
            <Badge
              position="absolute"
              top={-3}
              left="50%"
              transform="translateX(-50%)"
              bg="accent"
              color="white"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="none"
              fontSize="xs"
            >
              Recommended
            </Badge>
          )}

          <Heading as="h3" fontSize="xl" mb={1}>
            {plan.name}
          </Heading>
          <Flex align="baseline" gap={1} mb={5}>
            <Text fontSize="4xl" fontWeight="bold">
              {plan.price}
            </Text>
            <Text color="text.muted">{plan.period}</Text>
          </Flex>

          <List spacing={3} mb={6}>
            {plan.features.map((feature) => (
              <ListItem key={feature} display="flex" alignItems="flex-start">
                <ListIcon as={CheckCircleIcon} color="accent.hover" mt={1} />
                <Text color="text.secondary" fontSize="sm">
                  {feature}
                </Text>
              </ListItem>
            ))}
          </List>

          <Button
            as={RouterLink}
            to={plan.ctaTo}
            w="full"
            colorScheme={plan.highlighted ? "brand" : undefined}
            variant={plan.highlighted ? "solid" : "outline"}
            size="md"
            mb={4}
          >
            {plan.cta}
          </Button>

          <Text fontSize="xs" color="text.muted">
            Best for: {plan.bestFor}
          </Text>
        </Box>
      ))}
    </Flex>

    <Text mt={10} textAlign="center" fontSize="sm" color="text.muted" maxW="2xl" mx="auto">
      All plans start free. No credit card required for Free or Pro. Studio is
      invite-only during beta. Billing monthly or annually (save 20%).
    </Text>
  </Section>
);

export default Pricing;
