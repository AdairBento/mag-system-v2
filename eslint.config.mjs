import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [

  // ================================
  // IGNORES
  // ================================
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/.prisma/**",
    ],
  },

  // ================================
  // BASE (JS + TS)
  // ================================
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ================================
  // NEXT.JS (convertido do legacy)
  // ================================
  ...compat.extends("next/core-web-vitals"),

  // ================================
  // REGRAS GLOBAIS
  // ================================
  {
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // ================================
  // PACKAGES = MAIS RIGOR
  // ================================
  {
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // ================================
  // TESTES = MAIS FLEXÍVEL
  // ================================
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // ================================
  // API (Nest)
  // ================================
  {
    files: ["apps/api/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
