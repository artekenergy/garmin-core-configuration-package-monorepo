/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: [
    'dist/',
    'build/',
    'coverage/',
    'node_modules/',
    'packages/web-configurator/public/deployment-package/',
    'web/**',
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.base.json'],
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    },
  ],
};