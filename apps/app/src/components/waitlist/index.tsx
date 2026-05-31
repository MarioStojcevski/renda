import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";

import Logo from "../shared/logo";

const benefits = [
  "Free first month",
  "Direct access to the founder",
  "Lifetime discount (exclusive to beta users)",
  "Shape the product with your feedback",
];

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Join the rendalone. waitlist";
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <Flex
      minH="100vh"
      bg="bg.canvas"
      color="text.primary"
      align="center"
      justify="center"
      px={6}
      py={16}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-10%"
        left="50%"
        transform="translateX(-50%)"
        w="800px"
        maxW="100vw"
        h="500px"
        bgGradient="radial(closest-side, rgba(20,184,166,0.18), transparent)"
        pointerEvents="none"
      />

      <VStack position="relative" spacing={8} maxW="lg" w="full" textAlign="center">
        <Link
          as={RouterLink}
          to="/"
          display="flex"
          alignItems="center"
          gap={2}
          _hover={{ textDecoration: "none" }}
        >
          <Logo w={8} h={8} />
          <Text fontWeight="bold" fontSize="xl">
            rendalone.
          </Text>
        </Link>

        {submitted ? (
          <VStack
            spacing={4}
            p={10}
            borderRadius="panel"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            w="full"
          >
            <Flex
              align="center"
              justify="center"
              w={14}
              h={14}
              borderRadius="full"
              bg="accent.subtle"
              color="accent.hover"
              fontSize="2xl"
            >
              🎬
            </Flex>
            <Heading as="h1" fontSize="2xl">
              You're on the list.
            </Heading>
            <Text color="text.secondary" lineHeight="tall">
              Check your email for the beta link. If it doesn't arrive in 5 minutes,
              check spam. Welcome to rendalone.
            </Text>
            <Button as={RouterLink} to="/" variant="ghost" size="sm">
              Back to home
            </Button>
          </VStack>
        ) : (
          <>
            <VStack spacing={4}>
              <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} letterSpacing="-0.02em">
                You're about to change how you make videos.
              </Heading>
              <Text color="text.secondary" fontSize="lg" lineHeight="tall">
                rendalone. launches soon. Free beta testing. Get early access:
              </Text>
            </VStack>

            <Box as="form" onSubmit={handleSubmit} w="full" maxW="md">
              <Flex direction={{ base: "column", sm: "row" }} gap={3}>
                <Input
                  type="email"
                  size="lg"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  flex={1}
                  aria-label="Email address"
                />
                <Button type="submit" colorScheme="brand" size="lg" px={8}>
                  Get early access
                </Button>
              </Flex>
              {error && (
                <Text color="status.danger" fontSize="sm" mt={2} textAlign="left">
                  {error}
                </Text>
              )}
            </Box>

            <List spacing={2} textAlign="left">
              {benefits.map((benefit) => (
                <ListItem key={benefit} display="flex" alignItems="center" color="text.muted" fontSize="sm">
                  <ListIcon as={CheckCircleIcon} color="accent.hover" />
                  {benefit}
                </ListItem>
              ))}
            </List>

            <HStack spacing={1} fontSize="sm" color="text.muted">
              <Text>Already have an account?</Text>
              <Link as={RouterLink} to="/editor" color="accent.hover">
                Open the editor
              </Link>
            </HStack>
          </>
        )}
      </VStack>
    </Flex>
  );
};

export default WaitlistPage;
