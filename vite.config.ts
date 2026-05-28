import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { rendaRenderPlugin } from "./vite-plugin-renda-render";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), rendaRenderPlugin()],
  server: {
    port: 3000,
  },
});
