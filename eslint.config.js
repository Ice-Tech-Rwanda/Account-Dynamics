const nextCoreWebVitals = require("eslint-config-next/core-web-vitals")
const tseslint = require("typescript-eslint")

module.exports = [
  ...nextCoreWebVitals,
  {
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@next/next/no-img-element": "warn",
    },
  },
]
