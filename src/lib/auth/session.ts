import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
} from './kakao';

type StorageSource = Pick<Storage, 'getItem' | 'removeItem'>;

type StoredProfile = {
  displayName: string | null;
  avatarUrl: string | null;
};

type BufferCtor = typeof import('buffer').Buffer;

type JwtPayload = {
  sub?: unknown;
  role?: unknown;
  displayName?: unknown;
  avatarUrl?: unknown;
};

export type AuthClaims = {
  userId: string;
  role?: string;
  displayName: string | null;
  avatarUrl: string | null;
};

const resolveStorage = (candidate?: StorageSource | null) => {
  if (candidate) {
    return candidate;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return null;
};

const decodeBase64 = (value: string) => {
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(value);

    try {
      const percentEncoded = Array.from(binary)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .map((hex) => `%${hex}`)
        .join('');

      return decodeURIComponent(percentEncoded);
    } catch {
      return binary;
    }
  }

  const bufferCtor = (globalThis as { Buffer?: BufferCtor }).Buffer;

  if (bufferCtor) {
    return bufferCtor.from(value, 'base64').toString('utf-8');
  }

  throw new Error('Base64 decoder unavailable');
};

const decodeBase64Url = (segment: string) => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding
    ? normalized.padEnd(normalized.length + (4 - padding), '=')
    : normalized;

  return decodeBase64(padded);
};

const parseStoredProfile = (value: string | null): StoredProfile | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as {
      displayName?: unknown;
      avatarUrl?: unknown;
    };

    const displayName =
      typeof parsed.displayName === 'string'
        ? parsed.displayName.trim() || null
        : null;
    const avatarUrl =
      typeof parsed.avatarUrl === 'string'
        ? parsed.avatarUrl.trim() || null
        : null;

    if (displayName === null && avatarUrl === null) {
      return null;
    }

    return { displayName, avatarUrl };
  } catch {
    return null;
  }
};

const resolveStoredProfile = (storage?: StorageSource | null) => {
  const source = resolveStorage(storage);
  const raw = source?.getItem(USER_PROFILE_STORAGE_KEY) ?? null;

  return parseStoredProfile(raw);
};

export const parseAuthClaims = (token: string): AuthClaims | null => {
  const payloadSegment = token.split('.')[1];

  if (!payloadSegment) {
    return null;
  }

  try {
    const decoded = decodeBase64Url(payloadSegment);
    const payload = JSON.parse(decoded) as JwtPayload;
    const rawUserId = payload.sub;

    if (typeof rawUserId !== 'string') {
      return null;
    }

    const trimmedUserId = rawUserId.trim();

    if (!trimmedUserId) {
      return null;
    }

    const role = typeof payload.role === 'string' ? payload.role : undefined;
    const displayName =
      typeof payload.displayName === 'string'
        ? payload.displayName.trim() || null
        : null;
    const avatarUrl =
      typeof payload.avatarUrl === 'string'
        ? payload.avatarUrl.trim() || null
        : null;

    return {
      userId: trimmedUserId,
      role,
      displayName,
      avatarUrl,
    };
  } catch {
    return null;
  }
};

export const resolveStoredAccessToken = (storage?: StorageSource | null) => {
  const source = resolveStorage(storage);

  return source?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
};

export const resolveStoredAuthClaims = (storage?: StorageSource | null) => {
  const token = resolveStoredAccessToken(storage);

  if (!token) {
    return null;
  }
  const claims = parseAuthClaims(token);

  if (!claims) {
    return null;
  }

  const profile = resolveStoredProfile(storage);

  if (!profile) {
    return claims;
  }

  return {
    ...claims,
    displayName: claims.displayName ?? profile.displayName,
    avatarUrl: claims.avatarUrl ?? profile.avatarUrl,
  };
};

export const clearStoredAuthTokens = (storage?: StorageSource | null) => {
  const source = resolveStorage(storage);

  if (!source) {
    return;
  }

  source.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  source.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  source.removeItem(USER_PROFILE_STORAGE_KEY);
};
