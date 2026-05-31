import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { Suspense } from "react";
import { Link as RouterLink } from "react-router-dom";

import LoadingSpinner from "./loading-spinner";

const ErrorPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Box display="flex" alignItems="center" justifyContent="center" minH="calc(100vh - 3.5rem)">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold" color="accent">
          404
        </Text>
        <Text color="text.muted">Page not found.</Text>
        <Button as={RouterLink} to="/editor" colorScheme="brand" size="sm">
          Back to editor
        </Button>
      </VStack>
    </Box>
  </Suspense>
);

export default ErrorPage;
