import { Box } from "@chakra-ui/react";
import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router-dom";

import About from "../about";
import ErrorPage from "../shared/error-page";
import Header from "../shared/header/authenticated-header";
import LoadingSpinner from "../shared/loading-spinner";
import LandingPage from "../landing";
import WaitlistPage from "../waitlist";

const Editor = lazy(() => import("../editor"));

const AppShell = ({ children }: { children: ReactNode }) => (
  <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
    <Header />
    <Box as="main" flex="1" overflow="hidden">
      {children}
    </Box>
  </Box>
);

const Layout = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/waitlist" element={<WaitlistPage />} />
    <Route
      path="/editor"
      element={
        <AppShell>
          <Suspense fallback={<LoadingSpinner />}>
            <Editor />
          </Suspense>
        </AppShell>
      }
    />
    <Route
      path="/about"
      element={
        <AppShell>
          <About />
        </AppShell>
      }
    />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default Layout;
