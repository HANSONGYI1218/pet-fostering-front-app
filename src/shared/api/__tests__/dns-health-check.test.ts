import { describe, expect, it, vi } from 'vitest';

import {
  buildHealthcheckUrl,
  resolveDnsRecords,
  resolveHostname,
  validateDnsTargets,
} from '../dns-health-check';

describe('validateDnsTargets', () => {
  it('throws when target list is empty', () => {
    expect(() =>
      validateDnsTargets({ hostname: 'example.com', records: [] }),
    ).toThrowError('DNS 레코드를 찾을 수 없습니다');
  });

  it('returns records when present', () => {
    const records = validateDnsTargets({
      hostname: 'example.com',
      records: ['1.1.1.1'],
    });

    expect(records).toEqual(['1.1.1.1']);
  });
});

describe('resolveHostname', () => {
  it('extracts hostname from url with path', () => {
    expect(resolveHostname('https://api.furdiz.com/api/health')).toBe(
      'api.furdiz.com',
    );
  });

  it('extracts hostname from bare host', () => {
    expect(resolveHostname('api.furdiz.com')).toBe('api.furdiz.com');
  });

  it('throws when value is blank', () => {
    expect(() => resolveHostname('   ')).toThrowError(
      '호스트명을 확인할 수 없습니다.',
    );
  });
});

describe('resolveDnsRecords', () => {
  it('uses provided resolver dependency', async () => {
    const resolver = vi.fn().mockResolvedValue(['1.1.1.1']);

    const records = await resolveDnsRecords({
      hostname: 'example.com',
      resolver,
    });

    expect(records).toEqual(['1.1.1.1']);
    expect(resolver).toHaveBeenCalledWith('example.com');
  });

  it('throws when resolver returns empty array', async () => {
    const resolver = vi.fn().mockResolvedValue([]);

    await expect(
      resolveDnsRecords({ hostname: 'example.com', resolver }),
    ).rejects.toThrowError('DNS 레코드를 찾을 수 없습니다');
  });
});

describe('buildHealthcheckUrl', () => {
  it('appends /health to base url', () => {
    expect(buildHealthcheckUrl('https://api.furdiz.com')).toBe(
      'https://api.furdiz.com/health',
    );
  });

  it('handles base url with trailing slash', () => {
    expect(buildHealthcheckUrl('https://api.furdiz.com/api/')).toBe(
      'https://api.furdiz.com/api/health',
    );
  });
});
