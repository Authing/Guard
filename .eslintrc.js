module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'es2015'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  rules: {
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ],
    // `eslint/no-unused-vars` will check all qualified ts files, include d.ts
    // using interface to define function types is compliant, but `eslint/no-unused-vars` will prompt for unused parameters......
    // so set `args === none` here
    // and leave `no-unused-vars` to `@typescript-eslint/no-unused-vars`
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
    "@typescript-eslint/no-unused-vars": ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  }
}