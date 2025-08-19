import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["axios"],
        },
      },
    },
  },
  publicDir: "public",
  test: {
    ...configDefaults,
    environment: "jsdom",
    globals: true,
    clearMocks: true,
    setupFiles: ["./test.setup.ts"],
  },
});
