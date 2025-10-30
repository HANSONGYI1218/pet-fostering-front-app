import { resolveEndpoint } from '@/shared/api/config';
import { userHeaders } from '@/features/mypage/api/user';

export type ReportTargetType = 'POST' | 'COMMENT';

export type CreateReportPayload = {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
};

export type ReportResponse = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
};

export const createReport = async (
  token: string | undefined,
  payload: CreateReportPayload,
): Promise<ReportResponse> => {
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const response = await fetch(resolveEndpoint('/reports'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...userHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`신고 요청 실패: ${response.status}`);
  }

  return (await response.json()) as ReportResponse;
};
