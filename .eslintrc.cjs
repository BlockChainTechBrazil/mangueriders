module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // Add custom rules here
  },
  overrides: [
    {
      files: ['hardhat.config.js', 'scripts/**/*.js', 'test/**/*.js'],
      env: {
        node: true,
        mocha: true,
      },
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
