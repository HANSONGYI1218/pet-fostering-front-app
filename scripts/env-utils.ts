export type EnvRecords = Record<string, string>;

const isIgnorableLine = (line: string) => {
  const trimmed = line.trim();

  return trimmed.length === 0 || trimmed.startsWith('#');
};

const splitKeyValue = (line: string): [string, string] => {
  const [rawKey, ...rest] = line.split('=');

  if (!rawKey || rest.length === 0) {
    throw new Error(`잘못된 환경 변수 형식입니다: ${line}`);
  }

  const key = rawKey.trim();
  const value = rest.join('=').trim();

  if (!key) {
    throw new Error(`키가 비어 있습니다: ${line}`);
  }

  return [key, value];
};

export const parseEnvFile = (content: string): EnvRecords =>
  content.split(/\r?\n/).reduce<EnvRecords>((acc, line) => {
    if (isIgnorableLine(line)) {
      return acc;
    }

    const [key, value] = splitKeyValue(line);

    if (Object.prototype.hasOwnProperty.call(acc, key)) {
      throw new Error(`중복된 환경 변수 ${key}가 발견되었습니다.`);
    }

    return { ...acc, [key]: value };
  }, {});
