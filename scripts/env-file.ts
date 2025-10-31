import { readFile } from 'node:fs/promises';

import { parseEnvFile } from './env-utils';

export type EnvRecords = Record<string, string>;

export const DEFAULT_ENV_FILE = 'deployment/amplify/env.local';

export const loadEnvRecords = async (
  filePath?: string,
): Promise<EnvRecords> => {
  const target = filePath ?? process.env.AMPLIFY_ENV_FILE ?? DEFAULT_ENV_FILE;

  try {
    const content = await readFile(target, 'utf-8');
    return parseEnvFile(content);
  } catch (error) {
    console.warn(
      `환경 변수 파일을 열 수 없습니다 (${target}). 건너뜁니다.`,
      error,
    );
    return {};
  }
};
