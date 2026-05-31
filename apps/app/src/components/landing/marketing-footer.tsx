import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import Logo from "../shared/logo";

const MarketingFooter = () => (
  <Box as="footer" borderTop="1px solid" borderColor="border.subtle" px={6} py={12}>
    <Flex
      maxW="6xl"
      mx="auto"
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={6}
    >
      <Box>
        <Link
          as={RouterLink}
          to="/"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ textDecoration: "none" }}
        >
          <Logo w={6} h={6} color="accent" />
          <Text fontWeight="bold">renda</Text>
        </Link>
        <Text mt={2} fontSize="sm" color="text.muted">
          Describe it. Generate it. Ship it.
        </Text>
      </Box>

      <HStack spacing={6} flexWrap="wrap" fontSize="sm">
        <Link href="#" color="text.secondary" _hover={{ color: "text.primary" }}>
          Privacy Policy
        </Link>
        <Link href="#" color="text.secondary" _hover={{ color: "text.primary" }}>
          Terms of Service
        </Link>
        <Link
          href="https://x.com"
          isExternal
          color="text.secondary"
          _hover={{ color: "text.primary" }}
        >
          Twitter / X
        </Link>
        <Link
          href="mailto:hello@renda.io"
          color="text.secondary"
          _hover={{ color: "text.primary" }}
        >
          hello@renda.io
        </Link>
      </HStack>
    </Flex>

    <Text mt={8} fontSize="xs" color="text.disabled" textAlign="center">
      © {new Date().getFullYear()} Renda. All rights reserved.
    </Text>
  </Box>
);

export default MarketingFooter;
