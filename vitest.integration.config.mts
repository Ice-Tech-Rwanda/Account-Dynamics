import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/*.test.ts"],
    exclude: [
      "src/__tests__/{validation,members,donations,uploads}.test.ts",
      "src/__tests__/e2e/**",
      "node_modules/**",
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
