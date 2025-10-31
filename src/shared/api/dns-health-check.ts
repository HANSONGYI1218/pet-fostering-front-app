type ValidateDnsTargetsInput = {
  readonly hostname: string;
  readonly records: readonly string[];
};

type ResolveDnsRecordsInput = {
  readonly hostname: string;
  readonly resolver?: (hostname: string) => Promise<readonly string[]>;
};

const defaultResolver = async (
  hostname: string,
): Promise<readonly string[]> => {
  const { lookup } = await import('node:dns/promises');
  const results = await lookup(hostname, { all: true });
  return results.map((entry) => entry.address);
};

export const validateDnsTargets = ({
  hostname,
  records,
}: ValidateDnsTargetsInput): readonly string[] => {
  if (records.length === 0) {
    throw new Error(`DNS 레코드를 찾을 수 없습니다: ${hostname}`);
  }

  return records;
};

export const resolveHostname = (candidate: string): string => {
  const trimmed = candidate.trim();

  if (!trimmed) {
    throw new Error('호스트명을 확인할 수 없습니다.');
  }

  try {
    return new URL(trimmed).hostname;
  } catch {
    if (/^[-a-zA-Z0-9.@]+$/.test(trimmed)) {
      return trimmed;
    }

    throw new Error(`유효한 호스트명이 아닙니다: ${trimmed}`);
  }
};

export const resolveDnsRecords = async ({
  hostname,
  resolver = defaultResolver,
}: ResolveDnsRecordsInput): Promise<readonly string[]> => {
  const records = await resolver(hostname);

  return validateDnsTargets({ hostname, records });
};

export const buildHealthcheckUrl = (baseUrl: string): string => {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return `${trimmed}/health`;
};
