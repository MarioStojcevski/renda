import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";

import About from "../about";
import Editor from "../editor";
import ErrorPage from "../shared/error-page";
import Header from "../shared/header/authenticated-header";

const Layout = () => (
  <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
    <Header />
    <Box as="main" flex="1" overflow="hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/editor" replace />} />
        <Route path="/editor" element={<Editor />} errorElement={<ErrorPage />} />
        <Route path="/about" element={<About />} errorElement={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Box>
  </Box>
);

export default Layout;
