import { describe, expect, it, vi, afterEach } from 'vitest';

const cookiesMock = vi.fn();
const parseAuthClaimsMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('./session', () => ({
  parseAuthClaims: parseAuthClaimsMock,
}));

describe('server-session', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('awaits cookies before reading access token', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: encodeURIComponent('token') }),
    });

    const { resolveServerAccessToken } = await import('./server-session');

    await expect(resolveServerAccessToken()).resolves.toBe('token');
    expect(cookiesMock).toHaveBeenCalledTimes(1);
  });

  it('returns null claims when access token is missing', async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    });
    parseAuthClaimsMock.mockReturnValue({ sub: 'user' });

    const { resolveServerAuthClaims } = await import('./server-session');

    await expect(resolveServerAuthClaims()).resolves.toBeNull();
    expect(parseAuthClaimsMock).not.toHaveBeenCalled();
  });
});
