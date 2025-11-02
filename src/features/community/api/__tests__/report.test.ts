import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createReport } from '../report';

const apiFetchMock = vi.hoisted(() =>
  vi.fn<(input: string, init?: Record<string, unknown>) => Promise<Response>>(),
);

vi.mock('@/shared/api/config', () => ({
  resolveEndpoint: (path: string) => path,
}));

vi.mock('@/shared/api/http', () => ({
  apiFetch: apiFetchMock,
}));

describe('community report api', () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
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

    apiFetchMock.mockResolvedValue({
      ok: true,
      json: async () => response,
    } as Response);

    await expect(createReport('token-1', payload)).resolves.toEqual(response);

    expect(apiFetchMock).toHaveBeenCalledWith('/reports', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      auth: 'required',
      token: 'token-1',
      body: JSON.stringify(payload),
    });
  });

  it('응답이 실패하면 명확한 오류를 던진다', async () => {
    apiFetchMock.mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

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
    expect(apiFetchMock).not.toHaveBeenCalled();
  });
});
