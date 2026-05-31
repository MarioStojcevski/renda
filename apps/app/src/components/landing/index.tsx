import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

import MarketingNav from "./marketing-nav";
import MarketingFooter from "./marketing-footer";
import Hero from "./sections/hero";
import Problem from "./sections/problem";
import Solution from "./sections/solution";
import HowItWorks from "./sections/how-it-works";
import Features from "./sections/features";
import Pricing from "./sections/pricing";
import Testimonials from "./sections/testimonials";
import Faq from "./sections/faq";
import CtaSection from "./sections/cta";

const LandingPage = () => {
  useEffect(() => {
    document.title = "rendalone. — Describe it. Generate it. Ship it.";
  }, []);

  return (
    <Box bg="bg.canvas" color="text.primary" minH="100vh" overflowX="hidden">
      <MarketingNav />
      <Box as="main">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaSection />
      </Box>
      <MarketingFooter />
    </Box>
  );
};

export default LandingPage;
