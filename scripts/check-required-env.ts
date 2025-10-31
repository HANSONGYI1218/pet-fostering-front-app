#!/usr/bin/env tsx

import { findMissingKeys } from './env-check';
import { loadEnvRecords } from './env-file';

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_KAKAO_CLIENT_ID',
  'NEXT_PUBLIC_KAKAO_REDIRECT_URI',
  'NEXT_PUBLIC_KAKAO_LOGOUT_REDIRECT_URI',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_SOCKET_URL',
  'NEXT_PUBLIC_MAP_KEY',
] as const;

const exitWithMessage = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const parseArgs = (argv: string[]) => {
  const options: { filePath?: string } = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      exitWithMessage(`알 수 없는 인자: ${token}`);
    }

    const key = token.slice(2);

    if (key === 'file') {
      const next = argv[index + 1];

      if (!next) {
        exitWithMessage('--file 인자에 값이 필요합니다.');
      }

      options.filePath = next;
      index += 1;
    } else {
      exitWithMessage(`지원하지 않는 옵션: --${key}`);
    }
  }

  return options;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const fileEnv = await loadEnvRecords(options.filePath);

  const combined = {
    ...fileEnv,
    ...Object.fromEntries(
      REQUIRED_KEYS.map((key) => [key, process.env[key] ?? fileEnv[key]]),
    ),
  } as Record<string, string | undefined>;

  const missing = findMissingKeys(combined, REQUIRED_KEYS);

  if (missing.length > 0) {
    exitWithMessage(`필수 환경 변수가 비어 있습니다: ${missing.join(', ')}`);
  }

  console.log('필수 환경 변수가 모두 설정되었습니다.');
};

void main().catch((error) => {
  console.error('환경 변수 검증 중 오류가 발생했습니다.', error);
  process.exit(1);
});
