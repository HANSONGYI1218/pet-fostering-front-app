#!/usr/bin/env tsx

import { resolveBaseUrl, runApiHealthCheck } from './api-health-check';

const exitWithMessage = (message: string): never => {
  console.error(message);
  process.exit(1);
};

type CliOptions = {
  readonly filePath?: string;
  readonly url?: string;
};

const parseArgs = (argv: readonly string[]): CliOptions => {
  const options: CliOptions = {};

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
    } else if (key === 'url') {
      const next = argv[index + 1];

      if (!next) {
        exitWithMessage('--url 인자에 값이 필요합니다.');
      }

      options.url = next;
      index += 1;
    } else {
      exitWithMessage(`지원하지 않는 옵션: --${key}`);
    }
  }

  return options;
};

const logSuccess = (message: string) => {
  console.log(message);
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  const baseUrl = await resolveBaseUrl({
    filePath: options.filePath,
    explicitUrl: options.url,
  });

  const result = await runApiHealthCheck({ baseUrl });

  logSuccess(`[dns] ${result.hostname} → ${result.records.join(', ')}`);
  logSuccess(`[health] ${result.healthUrl} (${result.statusCode})`);
};

void main().catch((error) => {
  console.error('API 헬스 체크 중 오류가 발생했습니다.', error);
  process.exit(1);
});
