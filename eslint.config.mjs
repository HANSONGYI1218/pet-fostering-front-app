import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
// ES 모듈에서는 require 대신 import 사용
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 기존 ESLint config 변환
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Flat Config 형식에 맞춘 직접 설정
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-use-before-define': ['error'],

      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/shared',
              from: './src/features',
              message:
                'shared 계층에서 feature 코드를 직접 참조할 수 없습니다. alias나 엔터티 레이어를 사용하세요.',
            },
          ],
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.{ts,tsx}',
            '**/test/**',
            '**/tests/**',
            '**/*.stories.{ts,tsx}',
            '**/vite.config.ts',
            '**/next.config.js',
            '**/next.config.mjs',
            '**/.eslintrc.js',
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/auth/session',
              importNames: ['resolveStoredAccessToken'],
              message:
                '공용 액세스 토큰 유틸을 사용해주세요: @/shared/lib/auth/access-token.client',
            },
          ],
        },
      ],
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      'no-console': 'warn',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "FunctionDeclaration > ObjectPattern > Identifier[name='params'][typeAnnotation.typeAnnotation.type='TSTypeLiteral']",
          message:
            'Next.js 동적 라우트에서는 params를 AsyncParams<T>로 선언하고 await 해야 합니다.',
        },
        {
          selector:
            "ArrowFunctionExpression > ObjectPattern > Identifier[name='params'][typeAnnotation.typeAnnotation.type='TSTypeLiteral']",
          message:
            'Next.js 동적 라우트에서는 params를 AsyncParams<T>로 선언하고 await 해야 합니다.',
        },
        {
          selector:
            "FunctionDeclaration > ObjectPattern > Identifier[name='searchParams'][typeAnnotation.typeAnnotation.type='TSTypeLiteral']",
          message:
            'Next.js 동적 라우트에서는 searchParams를 AsyncSearchParams<T>로 선언하고 await 해야 합니다.',
        },
        {
          selector:
            "ArrowFunctionExpression > ObjectPattern > Identifier[name='searchParams'][typeAnnotation.typeAnnotation.type='TSTypeLiteral']",
          message:
            'Next.js 동적 라우트에서는 searchParams를 AsyncSearchParams<T>로 선언하고 await 해야 합니다.',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
