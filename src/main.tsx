import "@fontsource/poppins";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import App from "./App";
import theme from "./theme";
import "./index.css";
import { EditorUiProvider } from "./providers/editor-ui";
import { TimelineProvider } from "./providers/timeline";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <TimelineProvider>
          <EditorUiProvider>
            <App />
          </EditorUiProvider>
        </TimelineProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
