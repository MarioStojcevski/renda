import { Flex, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => (
  <Flex bg="bg.canvas" align="center" justify="center" minH="calc(100vh - 3.5rem)">
    <Spinner size="lg" color="accent" thickness="3px" speed="0.7s" emptyColor="whiteAlpha.200" />
  </Flex>
);

export default LoadingSpinner;
