import { describe, expect, it } from 'vitest';

import { parseEnvFile } from '../env-utils';

describe('parseEnvFile', () => {
  it('주석과 공백을 건너뛰고 key-value 페어를 파싱한다', () => {
    const content = `# comment\nKEY=value\n ANOTHER = spaced value \n`;

    expect(parseEnvFile(content)).toEqual({
      KEY: 'value',
      ANOTHER: 'spaced value',
    });
  });

  it('중복 키가 나오면 예외를 던진다', () => {
    const content = `KEY=first\nKEY=second`;

    expect(() => parseEnvFile(content)).toThrowError(
      '중복된 환경 변수 KEY가 발견되었습니다.',
    );
  });

  it('값이 비어 있으면 빈 문자열을 그대로 유지한다', () => {
    const content = `EMPTY=`;

    expect(parseEnvFile(content)).toEqual({ EMPTY: '' });
  });
});
