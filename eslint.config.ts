import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", "node_modules/", "package-lock.json", "AGENTS.md", "CLAUDE.md"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    // Tailwind at-rules (@custom-variant, @theme...) are not plain CSS.
    languageOptions: { tolerant: true },
    extends: ["css/recommended"],
    rules: {
      // Tailwind directives and CSS variables defined at build time.
      "css/no-invalid-at-rules": "off",
      "css/no-invalid-properties": "off",
      // Intentional overrides of third-party widget styles.
      "css/no-important": "off",
      "css/use-baseline": "off",
    },
  },
]);
