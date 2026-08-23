import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "coverage/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "lib/env.ts",
        "lib/security/**/*.ts",
        "lib/services/**/*.ts",
        "lib/tasks/**/*.ts",
        "lib/validations/**/*.ts",
        "components/auth/logout-button.tsx",
        "components/dashboard/dashboard-shell.tsx",
        "components/dashboard/stat-card.tsx",
        "components/tasks/task-board-toolbar.tsx",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "generated/**",
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
