import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createReport } from '../report';

vi.mock('@/shared/api/config', () => ({
  resolveEndpoint: (path: string) => path,
}));

vi.mock('@/features/mypage/api/user', () => ({
  userHeaders: (token?: string) =>
    token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
}));

describe('community report api', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('정상 응답이면 신고 정보를 반환한다', async () => {
    const payload = {
      targetType: 'COMMENT' as const,
      targetId: 'comment-1',
      reason: '스팸입니다',
    };
    const response = {
      id: 'report-1',
      targetType: 'COMMENT' as const,
      targetId: 'comment-1',
      reason: '스팸입니다',
      reporterId: 'user-1',
      createdAt: '2024-06-01T00:00:00.000Z',
      updatedAt: '2024-06-01T00:00:00.000Z',
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => response,
    });

    await expect(createReport('token-1', payload)).resolves.toEqual(response);

    expect(fetchMock).toHaveBeenCalledWith('/reports', {
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-1',
      }),
      body: JSON.stringify(payload),
    });
  });

  it('응답이 실패하면 명확한 오류를 던진다', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(
      createReport('token-2', {
        targetType: 'POST',
        targetId: 'post-1',
        reason: '부적절한 게시글',
      }),
    ).rejects.toThrow('신고 요청 실패: 400');
  });

  it('토큰이 없으면 즉시 오류를 던진다', async () => {
    await expect(
      createReport(undefined, {
        targetType: 'POST',
        targetId: 'post-2',
        reason: '광고성 게시글',
      }),
    ).rejects.toThrow('로그인이 필요합니다.');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
