type BufferCtor = typeof import('buffer').Buffer;

const decodeBase64 = (value: string): string => {
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

export const decodeBase64Url = (segment: string): string => {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding
    ? normalized.padEnd(normalized.length + (4 - padding), '=')
    : normalized;

  return decodeBase64(padded);
};

export const decodeJwtPayload = <T = unknown>(token: string): T | null => {
  const payloadSegment = token.split('.')[1];
  if (!payloadSegment) {
    return null;
  }

  try {
    const decoded = decodeBase64Url(payloadSegment);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};

type JwtPayloadWithExp = {
  readonly exp?: number | string | null;
};

export const extractJwtExpiration = (token: string): number | null => {
  const payload = decodeJwtPayload<JwtPayloadWithExp>(token);
  if (!payload) {
    return null;
  }

  const { exp } = payload;
  const parsed =
    typeof exp === 'number'
      ? exp
      : typeof exp === 'string'
        ? Number.parseInt(exp, 10)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const ms = parsed * 1000;
  if (!Number.isFinite(ms) || ms <= 0) {
    return null;
  }

  return ms;
};
