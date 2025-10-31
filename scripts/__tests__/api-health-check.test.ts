import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveBaseUrl, runApiHealthCheck } from '../api-health-check';

const ORIGINAL_ENV = process.env;

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('resolveBaseUrl', () => {
  it('returns explicit url when provided', async () => {
    await expect(
      resolveBaseUrl({ explicitUrl: 'https://api.example.com' }),
    ).resolves.toBe('https://api.example.com');
  });

  it('uses environment variable when available', async () => {
    const env: NodeJS.ProcessEnv = {
      NEXT_PUBLIC_API_BASE_URL: 'https://env.example.com',
    };

    await expect(resolveBaseUrl({ env })).resolves.toBe(
      'https://env.example.com',
    );
  });

  it('loads value from env file when environment is empty', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'api-health-test-'));
    const filePath = join(dir, '.env');
    await writeFile(
      filePath,
      'NEXT_PUBLIC_API_BASE_URL=https://file.example.com',
    );

    await expect(
      resolveBaseUrl({ filePath, env: {} as NodeJS.ProcessEnv }),
    ).resolves.toBe('https://file.example.com');
  });

  it('throws when no value is available', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(
      resolveBaseUrl({
        env: {} as NodeJS.ProcessEnv,
        filePath: '/non-existent.env',
      }),
    ).rejects.toThrowError('NEXT_PUBLIC_API_BASE_URL 값을 찾을 수 없습니다');

    warnSpy.mockRestore();
  });
});

describe('runApiHealthCheck', () => {
  it('returns health check result using injected dependencies', async () => {
    const resolver = vi.fn().mockResolvedValue(['1.1.1.1']);
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response('{}', { status: 200 }));

    const result = await runApiHealthCheck({
      baseUrl: 'https://api.example.com',
      resolver,
      fetcher,
      timeoutMs: 100,
    });

    expect(resolver).toHaveBeenCalledWith('api.example.com');
    expect(fetcher).toHaveBeenCalled();
    expect(result).toEqual({
      hostname: 'api.example.com',
      records: ['1.1.1.1'],
      healthUrl: 'https://api.example.com/health',
      statusCode: 200,
    });
  });

  it('throws when response is not ok', async () => {
    const resolver = vi.fn().mockResolvedValue(['1.1.1.1']);
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response('fail', { status: 503 }));

    await expect(
      runApiHealthCheck({
        baseUrl: 'https://api.example.com',
        resolver,
        fetcher,
        timeoutMs: 100,
      }),
    ).rejects.toThrowError('헬스 체크 응답이 실패했습니다 (503).');
  });
});
