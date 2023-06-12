module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    jest: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'no-console': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
};
