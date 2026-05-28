import { Box, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import DarkModeSwitch from "../light-dark-switch";
import Logo from "../logo";
import EditorMenuBar from "./editor-menu-bar";

const Header = () => {
  const { pathname } = useLocation();
  const onEditor = pathname.startsWith("/editor");

  return (
    <Box
      as="header"
      h={10}
      borderBottom="1px solid"
      borderColor="border.subtle"
      bg="bg.surface"
      px={3}
    >
      <Flex h="100%" align="center" justify="space-between">
        <HStack spacing={2}>
          <Link
            as={RouterLink}
            to="/editor"
            display="flex"
            alignItems="center"
            gap={2}
            _hover={{ textDecoration: "none" }}
          >
            <Logo w={7} h={7} color="accent" />
            <Text fontWeight="semibold" fontSize="sm" letterSpacing="-0.02em">
              renda
            </Text>
          </Link>

          {onEditor && <EditorMenuBar />}

          {!onEditor && (
            <Link
              as={RouterLink}
              to="/about"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="sm"
              color="text.muted"
              _hover={{ color: "chakra-body-text", textDecoration: "none" }}
            >
              About
            </Link>
          )}
        </HStack>

        <DarkModeSwitch />
      </Flex>
    </Box>
  );
};

export default Header;
