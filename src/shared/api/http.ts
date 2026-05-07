import { readAccessToken } from '@/shared/lib/auth/access-token';
import { resolveEndpoint } from './config';

type AuthMode = 'none' | 'optional' | 'required';

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//.test(value);

export class AuthorizationError extends Error {
  constructor(message = '인증이 필요합니다.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export interface ApiFetchOptions extends RequestInit {
  readonly auth?: AuthMode;
  readonly token?: string | null;
}

export interface FetchJsonOptions extends Omit<ApiFetchOptions, 'headers'> {
  readonly headers?: Record<string, string>;
  readonly errorMessage?: string;
}

const resolveUrl = (input: string): string =>
  isAbsoluteUrl(input) ? input : resolveEndpoint(input);

const mergeHeaders = (
  headers: HeadersInit | undefined,
  authorization: string | null,
): Headers => {
  const next = new Headers(headers ?? {});
  if (authorization) {
    next.set('Authorization', authorization);
  }
  return next;
};

export const apiFetch = async (
  input: string,
  options: ApiFetchOptions = {},
): Promise<Response> => {
  const { auth = 'optional', token, ...rest } = options;

  let authorization: string | null = null;

  if (auth !== 'none') {
    const resolvedToken = token ?? readAccessToken();

    if (resolvedToken) {
      authorization = `Bearer ${resolvedToken}`;
    } else if (auth === 'required') {
      throw new AuthorizationError();
    }
  }

  const headers = mergeHeaders(rest.headers, authorization);
  const url = resolveUrl(input);

  return fetch(url, { ...rest, headers });
};

export const fetchJson = async (
  input: string,
  options: FetchJsonOptions = {},
): Promise<Response> => {
  const { errorMessage = '요청 실패', headers, ...rest } = options;

  const response = await apiFetch(input, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(headers ?? {}),
    },
  });

  if (!response.ok) {
    const error = new Error(`${errorMessage}: ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  return response;
};
