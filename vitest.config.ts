import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],

    include: ["**/*.{test,spec}.{ts,tsx}"],

    exclude: ["node_modules/**", ".next/**", "coverage/**", "e2e/**"],

    coverage: {
      provider: "v8",

      reporter: ["text", "html", "lcov"],

      include: ["components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],

      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "generated/**",
      ],
    },
  },
});
