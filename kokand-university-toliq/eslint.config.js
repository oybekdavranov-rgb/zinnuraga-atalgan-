'use strict';
// ESLint 9 flat config
module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['public/**', 'admin-static/**', 'node_modules/**', 'data/**'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { process: 'readonly', Buffer: 'readonly', console: 'readonly', require: 'readonly', module: 'writable', __dirname: 'readonly', fetch: 'readonly', Request: 'readonly', setInterval: 'readonly', setTimeout: 'readonly', URL: 'readonly', URLSearchParams: 'readonly', BigInt: 'readonly', crypto: 'readonly' },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'warn',
    },
  },
];
