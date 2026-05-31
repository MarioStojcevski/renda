import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  useDisclosure,
  IconButton,
  Collapse,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

import Logo from "../shared/logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const MarketingNav = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg="rgba(19, 19, 23, 0.8)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="border.subtle"
    >
      <Flex
        maxW="6xl"
        mx="auto"
        h={16}
        px={6}
        align="center"
        justify="space-between"
      >
        <Link
          as={RouterLink}
          to="/"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ textDecoration: "none" }}
        >
          <Logo w={7} h={7} />
          <Text fontWeight="bold" fontSize="lg" letterSpacing="-0.02em">
            rendalone.
          </Text>
        </Link>

        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              fontSize="sm"
              color="text.secondary"
              _hover={{ color: "text.primary", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </HStack>

        <HStack spacing={3} display={{ base: "none", md: "flex" }}>
          <Button
            as={RouterLink}
            to="/editor"
            variant="ghost"
            size="sm"
          >
            Open editor
          </Button>
          <Button as={RouterLink} to="/waitlist" colorScheme="brand" size="sm">
            Get Early Access
          </Button>
        </HStack>

        <IconButton
          aria-label="Toggle menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="ghost"
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          display={{ md: "none" }}
          px={6}
          pb={4}
          spacing={2}
          borderBottom="1px solid"
          borderColor="border.subtle"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              py={2}
              fontSize="sm"
              color="text.secondary"
              onClick={onClose}
              _hover={{ color: "text.primary", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
          <Button
            as={RouterLink}
            to="/waitlist"
            colorScheme="brand"
            size="sm"
            mt={2}
            onClick={onClose}
          >
            Get Early Access
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default MarketingNav;
