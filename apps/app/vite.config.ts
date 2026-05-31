import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  publicDir: path.resolve(root, "../../packages/composition/public"),
  resolve: {
    alias: {
      "@renda/shared": path.resolve(root, "../../packages/shared/src"),
      "@renda/composition": path.resolve(root, "../../packages/composition/src"),
    },
  },
});
