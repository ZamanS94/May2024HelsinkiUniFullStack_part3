import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    },
  },
];
