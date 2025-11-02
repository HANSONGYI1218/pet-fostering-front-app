import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_CHANGE_EVENT_NAME } from '@/lib/auth/events';
import { readAccessToken } from '../auth/access-token';
import { ensureAccessToken, useAccessToken } from '../auth/access-token.client';

const toastMock = vi.hoisted(() => vi.fn());
const resolveAccessTokenMock = vi.hoisted(() =>
  vi.fn<() => string | null>(() => 'token-123'),
);

vi.mock('sonner', () => ({
  toast: toastMock,
}));

vi.mock('@/lib/auth/session', () => ({
  resolveStoredAccessToken: resolveAccessTokenMock,
}));

describe('access-token helpers', () => {
  beforeEach(() => {
    resolveAccessTokenMock.mockReset();
    resolveAccessTokenMock.mockReturnValue('token-123');
    toastMock.mockReset();
  });

  it('readAccessToken은 현재 저장된 토큰을 반환한다', () => {
    resolveAccessTokenMock.mockReturnValue('stored-token');

    expect(readAccessToken()).toBe('stored-token');
    expect(resolveAccessTokenMock).toHaveBeenCalled();
  });

  it('ensureAccessToken은 토큰이 없으면 토스트를 노출하고 null을 반환한다', () => {
    resolveAccessTokenMock.mockReturnValue(null);

    expect(ensureAccessToken()).toBeNull();
    expect(toastMock).toHaveBeenCalledWith('로그인이 필요합니다.');
  });

  it('ensureAccessToken은 토큰이 있으면 그대로 반환한다', () => {
    resolveAccessTokenMock.mockReturnValue('available');

    expect(ensureAccessToken()).toBe('available');
    expect(toastMock).not.toHaveBeenCalled();
  });

  it('useAccessToken은 이벤트에 따라 최신 토큰을 제공한다', () => {
    const { result } = renderHook(() => useAccessToken());

    expect(result.current).toBe('token-123');

    resolveAccessTokenMock.mockReturnValue('token-456');

    act(() => {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT_NAME));
    });

    expect(result.current).toBe('token-456');
  });
});
