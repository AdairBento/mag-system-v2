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

// BLOQUEIO NODE-ONLY NO WEB
{
  files: ["apps/web/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          { group: ["fs", "fs/*", "node:fs", "node:fs/*"], message: "❌ BLOQUEADO: 'fs' é Node-only. Mova para apps/api ou use APIs web" },
          { group: ["path", "path/*", "node:path", "node:path/*"], message: "❌ BLOQUEADO: 'path' é Node-only. Mova para apps/api ou use APIs web" },
          { group: ["crypto", "node:crypto"], message: "❌ BLOQUEADO: 'crypto' Node-only. Use Web Crypto API (window.crypto)" },
          { group: ["@nestjs/*"], message: "❌ BLOQUEADO: NestJS é server-side. Não importe no Web" },
          { group: ["@prisma/*"], message: "❌ BLOQUEADO: Prisma é server-side. Use APIs/Server Actions" },
          { group: ["**/apps/api/**"], message: "❌ BLOQUEADO: Não importe código de apps/api no Web" }
        ]
      }
    ]
  }
},
];
