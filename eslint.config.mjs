import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // ========================================
  // IGNORES - Diretórios gerados/build
  // ========================================
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

  // ========================================
  // BASE CONFIGS - Recommended ESLint + TS
  // ========================================
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // ========================================
  // GLOBAL RULES - Padrão do projeto
  // ========================================
  {
    rules: {
      // Console permitido (NestJS usa logger próprio)
      "no-console": "off",

      // Variáveis/args não usados com _ são OK
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // any é warning por padrão
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // ========================================
  // PACKAGES/** - Strict TypeScript
  // ========================================
  {
    files: ["packages/**/*.{ts,tsx}"],
    rules: {
      // Packages devem ser type-safe
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
    },
  },

  // ========================================
  // TESTS - Permissivo (any OK em mocks)
  // ========================================
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // ========================================
  // API (NestJS) - Pragmático
  // ========================================
  {
    files: ["apps/api/**/*.{ts,tsx}"],
    rules: {
      // NestJS usa decorators que podem ter any
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // ========================================
  // WEB (Next.js) - Ignora (usa next lint)
  // ========================================
  {
    ignores: ["apps/web/**"],
  },
];