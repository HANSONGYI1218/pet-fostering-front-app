import { apiFetch } from '@/shared/api/http';
import { expectOk } from '@/features/mypage/api/user';
import { persistAuthTokens, AuthTokenPair } from '@/lib/auth/kakao';

/**
 * 서버에 ID/Password로 로그인 요청하고 토큰 쌍을 반환
 */
export const exchangeCredentials = async ({
  id,
  password,
  fetcher = fetch,
}: {
  id: string;
  password: string;
  fetcher?: typeof fetch;
}): Promise<AuthTokenPair> => {
  const response = await expectOk(
    await apiFetch('/auth/organization/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
      cache: 'no-store',
    }),
  );

  if (!response.ok) {
    const reason = await response.text().catch(() => '');
    const suffix = reason ? ` ${reason}` : '';
    throw new Error(
      `일반 로그인 요청이 실패했습니다 (${response.status}).${suffix}`,
    );
  }

  return response.json() as Promise<AuthTokenPair>;
};

/**
 * 일반 로그인 완료 처리
 * - 토큰 저장
 * - 성공 콜백
 */
export const completeLoginWithCredentials = async ({
  id,
  password,
  exchangeFn = exchangeCredentials,
  persistTokens = persistAuthTokens,
  storage,
}: {
  id: string;
  password: string;
  exchangeFn?: typeof exchangeCredentials;
  persistTokens?: typeof persistAuthTokens;
  storage?: Storage;
}) => {
  if (!id || !password) {
    throw new Error('아이디와 비밀번호가 필요합니다.');
  }

  const tokens = await exchangeFn({ id, password });

  const targetStorage = storage || localStorage;

  persistTokens(
    targetStorage ? { tokens, storage: targetStorage } : { tokens },
  );

  return tokens;
};
