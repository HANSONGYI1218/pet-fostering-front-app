import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    parser: '@typescript-eslint/parser',
    extends: [
      'airbnb',
      'airbnb-typescript',
      'airbnb/hooks',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      project: './tsconfig.json',
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    plugins: ['react', '@typescript-eslint', 'import', 'prettier'],
    rules: {
      // ✅ React 관련
      'react/react-in-jsx-scope': 'off', // Next.js에선 필요 없음
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // TSX만 허용
      'react/require-default-props': 'off', // TypeScript에선 선택 props를 타입으로 표현함
      'react/jsx-props-no-spreading': 'off', // props 확산 허용 (필요할 때 유용)

      // ✅ TypeScript 관련
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 리턴 타입 강제 안 함
      '@typescript-eslint/no-explicit-any': 'warn',

      // ✅ Import 관련
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
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
        },
      ],

      // ✅ 일반 JS 규칙
      'no-console': 'warn',
      'no-underscore-dangle': 'off', // _id 같은 필드 허용
      'no-use-before-define': 'off', // TypeScript가 알아서 체크
      '@typescript-eslint/no-use-before-define': ['error'],

      // ✅ 기타
      'jsx-a11y/anchor-is-valid': 'off', // Next.js의 <Link> 내부 <a> 처리 관련
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export default eslintConfig;
