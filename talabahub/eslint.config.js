'use strict';
// ESLint 9 flat config
module.exports = [
  // Global ignore (build artefaktlari, uchinchi tomon skriptlari)
  { ignores: ['public/js/**', 'public/i18n.js', 'public/cms-runtime.js', 'node_modules/**', 'data/**'] },

  // Node tomoni (server, src, testlar)
  {
    files: ['src/**/*.js', 'server.js', 'test/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly', Buffer: 'readonly', console: 'readonly', require: 'readonly',
        module: 'writable', __dirname: 'readonly', fetch: 'readonly', Request: 'readonly',
        setInterval: 'readonly', setTimeout: 'readonly', URL: 'readonly', WebSocket: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'warn',
    },
  },

  // Brauzer tomoni (admin panel va umumiy UX skriptlari)
  {
    files: ['admin-static/**/*.js', 'public/ku-ux.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: {
        window: 'readonly', document: 'readonly', location: 'readonly', navigator: 'readonly',
        localStorage: 'readonly', fetch: 'readonly', FormData: 'readonly', alert: 'readonly',
        confirm: 'readonly', setTimeout: 'readonly', setInterval: 'readonly',
        requestAnimationFrame: 'readonly', getComputedStyle: 'readonly', matchMedia: 'readonly',
        IntersectionObserver: 'readonly', URL: 'readonly', console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'off',
    },
  },
];
