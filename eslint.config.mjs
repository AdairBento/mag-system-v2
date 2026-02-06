import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // Regras específicas para testes: permitir 'any'
    files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
