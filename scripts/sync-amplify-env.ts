#!/usr/bin/env tsx

import { readFile } from 'node:fs/promises';

import { PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

import { parseEnvFile } from './env-utils';

type CliOptions = {
  filePath: string;
  parameterPath: string;
  region?: string;
  profile?: string;
  dryRun: boolean;
};

const exitWithUsage = (message?: string): never => {
  if (message) {
    console.error(message);
  }

  console.error(
    `사용법: pnpm sync:amplify-env [--file <env 파일>] [--path <ssm 경로>] [--region ap-northeast-2] [--profile default] [--dry-run]`,
  );
  console.error(
    '환경 변수 AMPLIFY_ENV_FILE, AMPLIFY_SSM_PATH 로도 기본값을 지정할 수 있습니다.',
  );
  process.exit(1);
};

const normalizePath = (rawPath: string) =>
  rawPath.endsWith('/') ? rawPath : `${rawPath}/`;

const parseArgs = (argv: string[]): CliOptions => {
  const options: Partial<CliOptions> = { dryRun: false };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      exitWithUsage(`알 수 없는 인자: ${token}`);
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    switch (key) {
      case 'file':
        if (!next) {
          exitWithUsage('--file 인자에 값이 필요합니다.');
        }
        options.filePath = next;
        index += 1;
        break;
      case 'path':
        if (!next) {
          exitWithUsage('--path 인자에 값이 필요합니다.');
        }
        options.parameterPath = normalizePath(next);
        index += 1;
        break;
      case 'region':
        if (!next) {
          exitWithUsage('--region 인자에 값이 필요합니다.');
        }
        options.region = next;
        index += 1;
        break;
      case 'profile':
        if (!next) {
          exitWithUsage('--profile 인자에 값이 필요합니다.');
        }
        options.profile = next;
        index += 1;
        break;
      case 'dry-run':
        options.dryRun = true;
        break;
      default:
        exitWithUsage(`지원하지 않는 옵션: --${key}`);
    }
  }

  const envFile =
    process.env.AMPLIFY_ENV_FILE ?? 'deployment/amplify/env.local';
  const envPath = process.env.AMPLIFY_SSM_PATH;

  options.filePath ??= envFile;
  options.parameterPath ??= envPath ? normalizePath(envPath) : undefined;

  if (!options.filePath || !options.parameterPath) {
    exitWithUsage(
      '필수 입력(파일 경로, SSM 경로)을 인자나 환경 변수로 지정해야 합니다.',
    );
  }

  return options as CliOptions;
};

const buildClient = ({ region, profile }: CliOptions) => {
  if (profile) {
    process.env.AWS_PROFILE = profile;
  }

  return new SSMClient(region ? { region } : {});
};

const putParameters = async (
  client: SSMClient,
  basePath: string,
  records: Record<string, string>,
  dryRun: boolean,
) => {
  const entries = Object.entries(records);

  if (entries.length === 0) {
    console.log('적용할 환경 변수가 없습니다.');
    return;
  }

  const actions = entries.map(async ([key, value]) => {
    const name = `${basePath}${key}`;

    if (dryRun) {
      console.log(`[dry-run] ${name} ← ${value}`);
      return;
    }

    const command = new PutParameterCommand({
      Name: name,
      Value: value,
      Overwrite: true,
      Type: 'SecureString',
    });

    await client.send(command);
    console.log(`적용 완료: ${name}`);
  });

  await Promise.all(actions);
};

const main = async () => {
  try {
    const options = parseArgs(process.argv.slice(2));
    const { filePath, parameterPath, dryRun } = options;

    const rawEnv = await readFile(filePath, 'utf-8');
    const records = parseEnvFile(rawEnv);

    const client = buildClient(options);
    await putParameters(client, parameterPath, records, dryRun);

    if (!dryRun) {
      console.log('모든 환경 변수를 SSM에 동기화했습니다.');
    }
  } catch (error) {
    console.error('동기화에 실패했습니다.', error);
    process.exit(1);
  }
};

void main();
