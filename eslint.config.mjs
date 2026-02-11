import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // IGNORAR ARQUIVOS GERADOS
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

  // BASE JS + TS
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // REGRAS GLOBAIS
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

  // PACKAGES MAIS RIGOROSOS
  {
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // TESTES MAIS FLEXÍVEIS
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // API (Nest)
  {
    files: ["apps/api/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
