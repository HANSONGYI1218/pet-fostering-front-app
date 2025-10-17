import { resolveEndpoint } from '@/lib/api/config';
import { dispatchAuthChangeEvent } from '@/lib/auth/events';
import { clearBrowserCookie, setBrowserCookie } from './cookie-utils';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_LOGOUT_URL = 'https://kauth.kakao.com/oauth/logout';
const ENV_ERROR_MESSAGE =
  '카카오 로그인에 필요한 환경 변수가 설정되지 않았습니다.';

export const ACCESS_TOKEN_STORAGE_KEY = 'pet.accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'pet.refreshToken';
export const USER_PROFILE_STORAGE_KEY = 'pet.userProfile';

type Maybe<T> = T | null | undefined;

type RedirectDependencies = {
  location?: Pick<Location, 'assign'>;
  buildAuthorizeUrl?: () => string;
};

type ExchangeDependencies = {
  code: string;
  fetcher?: typeof fetch;
};

export type AuthTokenPair = {
  token: string;
  refreshToken: string;
  displayName: string | null;
  avatarUrl: string | null;
};

type PersistDependencies = {
  tokens: AuthTokenPair;
  storage?: Pick<Storage, 'setItem'>;
};

type CompleteDependencies = {
  code: Maybe<string>;
  exchangeCode?: (deps: ExchangeDependencies) => Promise<AuthTokenPair>;
  persistTokens?: (deps: PersistDependencies) => unknown;
  storage?: Pick<Storage, 'setItem'>;
  fetcher?: typeof fetch;
  onSuccess?: (deps: { tokens: AuthTokenPair }) => void;
};

const requireEnv = (value: Maybe<string>): string => {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error(ENV_ERROR_MESSAGE);
  }

  return trimmed;
};

const resolveAuthorizeParams = () => {
  const clientId = requireEnv(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
  const redirectUri = requireEnv(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI);

  return { clientId, redirectUri };
};

const resolveLogoutParams = () => {
  const clientId = requireEnv(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
  const logoutRedirectUri = requireEnv(
    process.env.NEXT_PUBLIC_KAKAO_LOGOUT_REDIRECT_URI,
  );

  return { clientId, logoutRedirectUri };
};

export const buildKakaoAuthorizeUrl = () => {
  const { clientId, redirectUri } = resolveAuthorizeParams();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

export const redirectToKakaoLogin = ({
  location = typeof window !== 'undefined' ? window.location : undefined,
  buildAuthorizeUrl = buildKakaoAuthorizeUrl,
}: RedirectDependencies = {}) => {
  if (!location) {
    throw new Error('브라우저 환경에서만 카카오 로그인을 시작할 수 있습니다.');
  }

  const authorizeUrl = buildAuthorizeUrl();

  location.assign(authorizeUrl);
};

export const buildKakaoLogoutUrl = () => {
  const { clientId, logoutRedirectUri } = resolveLogoutParams();

  const params = new URLSearchParams({
    client_id: clientId,
    logout_redirect_uri: logoutRedirectUri,
  });

  return `${KAKAO_LOGOUT_URL}?${params.toString()}`;
};

type LogoutDependencies = {
  location?: Pick<Location, 'assign'>;
  buildLogoutUrl?: () => string;
};

export const redirectToKakaoLogout = ({
  location = typeof window !== 'undefined' ? window.location : undefined,
  buildLogoutUrl = buildKakaoLogoutUrl,
}: LogoutDependencies = {}) => {
  if (!location) {
    throw new Error(
      '브라우저 환경에서만 카카오 로그아웃을 시작할 수 있습니다.',
    );
  }

  const logoutUrl = buildLogoutUrl();

  location.assign(logoutUrl);
};

export const exchangeKakaoAuthorizationCode = async ({
  code,
  fetcher = fetch,
}: ExchangeDependencies): Promise<AuthTokenPair> => {
  const response = await fetcher(resolveEndpoint('/auth/kakao'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const reason = await response.text().catch(() => '');
    const suffix = reason ? ` ${reason}` : '';
    throw new Error(
      `카카오 로그인 요청이 실패했습니다 (${response.status}).${suffix}`,
    );
  }

  return response.json() as Promise<AuthTokenPair>;
};

const resolveStorage = (candidate?: Pick<Storage, 'setItem'>) => {
  if (candidate) {
    return candidate;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return null;
};

export const persistAuthTokens = ({ tokens, storage }: PersistDependencies) => {
  const targetStorage = resolveStorage(storage);

  if (!targetStorage) {
    throw new Error('토큰을 저장할 Storage가 필요합니다.');
  }

  targetStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.token);
  targetStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
  targetStorage.setItem(
    USER_PROFILE_STORAGE_KEY,
    JSON.stringify({
      displayName: tokens.displayName ?? null,
      avatarUrl: tokens.avatarUrl ?? null,
    }),
  );
  setBrowserCookie(ACCESS_TOKEN_STORAGE_KEY, tokens.token);
  setBrowserCookie(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);

  dispatchAuthChangeEvent();

  return tokens;
};

export const completeKakaoLogin = async ({
  code,
  exchangeCode = exchangeKakaoAuthorizationCode,
  persistTokens = persistAuthTokens,
  storage,
  fetcher,
  onSuccess,
}: CompleteDependencies) => {
  if (!code) {
    throw new Error('카카오 인가 코드가 필요합니다.');
  }

  const exchangeDependencies: ExchangeDependencies = {
    code,
    ...(fetcher ? { fetcher } : {}),
  };

  const tokens = await exchangeCode(exchangeDependencies);

  const targetStorage = resolveStorage(storage);

  persistTokens(
    targetStorage ? { tokens, storage: targetStorage } : { tokens },
  );

  onSuccess?.({ tokens });

  return tokens;
};
