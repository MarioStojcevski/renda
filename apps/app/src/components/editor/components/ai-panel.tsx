import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const AiPanel = () => {
  return (
    <Flex direction="column" h="100%">
      <Flex align="center" gap={2} mb={3} flexShrink={0}>
        <Box as={SparklesIcon} w="16px" h="16px" color="teal.400" />
        <Text fontSize="xs" fontWeight="semibold" color="text.muted" textTransform="uppercase">
          AI Assistant
        </Text>
      </Flex>

      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        gap={3}
        border="1px dashed"
        borderColor="border.subtle"
        borderRadius="md"
        p={4}
        mb={3}
      >
        <Text fontSize="sm" color="text.muted" textAlign="center">
          AI-powered editing coming soon.
        </Text>
        <Text fontSize="xs" color="text.muted" textAlign="center">
          Generate clips, remove backgrounds, and more.
        </Text>
      </Flex>

      <Flex gap={2} flexShrink={0}>
        <Input
          size="sm"
          placeholder="Ask AI to edit your video…"
          isDisabled
          borderRadius="md"
        />
      </Flex>
    </Flex>
  );
};

export default AiPanel;
