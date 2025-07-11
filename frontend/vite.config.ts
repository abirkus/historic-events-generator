import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults } from "vitest/config";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  base: "/historic-events-generator/",
  plugins: [react(), tailwindcss(), svgr()],
  test: {
    ...configDefaults,
    environment: "jsdom",
    globals: true,
    clearMocks: true,
    setupFiles: ["./test.setup.ts"],
  },
});
