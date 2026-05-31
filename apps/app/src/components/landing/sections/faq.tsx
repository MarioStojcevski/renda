import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import Section from "../section";
import { faqs } from "../data";

const Faq = () => (
  <Section anchor="faq" maxW="3xl">
    <VStack spacing={4} mb={{ base: 10, md: 14 }} textAlign="center">
      <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="-0.02em">
        Questions? We've got answers.
      </Heading>
    </VStack>

    <Accordion allowMultiple>
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.q}
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="panel"
          mb={3}
          bg="bg.surface"
          overflow="hidden"
        >
          <AccordionButton py={4} px={5} _hover={{ bg: "bg.hover" }}>
            <Box flex={1} textAlign="left" fontWeight="medium">
              {faq.q}
            </Box>
            <AccordionIcon color="accent.hover" />
          </AccordionButton>
          <AccordionPanel pb={4} px={5} color="text.muted" lineHeight="tall">
            {faq.a}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Section>
);

export default Faq;
