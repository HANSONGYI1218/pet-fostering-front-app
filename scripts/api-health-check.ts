import {
  buildHealthcheckUrl,
  resolveDnsRecords,
  resolveHostname,
} from '@/shared/api/dns-health-check';
import { loadEnvRecords } from './env-file';

type ResolveBaseUrlOptions = {
  readonly filePath?: string;
  readonly explicitUrl?: string;
  readonly env?: NodeJS.ProcessEnv;
};

export const resolveBaseUrl = async ({
  filePath,
  explicitUrl,
  env = process.env,
}: ResolveBaseUrlOptions): Promise<string> => {
  if (explicitUrl && explicitUrl.trim()) {
    return explicitUrl;
  }

  if (env.NEXT_PUBLIC_API_BASE_URL && env.NEXT_PUBLIC_API_BASE_URL.trim()) {
    return env.NEXT_PUBLIC_API_BASE_URL;
  }

  const fileEnv = await loadEnvRecords(filePath);
  const candidate = fileEnv.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!candidate) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL 값을 찾을 수 없습니다. --url 또는 환경 변수를 지정하세요.',
    );
  }

  return candidate;
};

type HealthCheckDependencies = {
  readonly baseUrl: string;
  readonly resolver?: (hostname: string) => Promise<readonly string[]>;
  readonly fetcher?: typeof fetch;
  readonly timeoutMs?: number;
};

export type ApiHealthCheckResult = {
  readonly hostname: string;
  readonly records: readonly string[];
  readonly healthUrl: string;
  readonly statusCode: number;
};

const DEFAULT_TIMEOUT = 5000;

export const runApiHealthCheck = async ({
  baseUrl,
  resolver,
  fetcher = fetch,
  timeoutMs = DEFAULT_TIMEOUT,
}: HealthCheckDependencies): Promise<ApiHealthCheckResult> => {
  const hostname = resolveHostname(baseUrl);
  const records = await resolveDnsRecords({ hostname, resolver });
  const healthUrl = buildHealthcheckUrl(baseUrl);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(healthUrl, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`헬스 체크 응답이 실패했습니다 (${response.status}).`);
    }

    return {
      hostname,
      records,
      healthUrl,
      statusCode: response.status,
    };
  } finally {
    clearTimeout(timer);
  }
};
