module.exports = {
  root: true,
  extends: ['@mag-system/eslint-config/base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo'],
};
