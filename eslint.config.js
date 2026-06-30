import js from '@eslint/js';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...sveltePlugin.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            ecmaVersion: 2022,
            sourceType: 'module',
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
        },
    },
    {
        ignores: [
            'node_modules/',
            'docs/',
            'static/',
            'schemas/',
            'package-lock.json',
        ],
    },
];
