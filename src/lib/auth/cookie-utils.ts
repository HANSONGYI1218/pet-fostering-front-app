const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 6;

const isHttps = () =>
  typeof window !== 'undefined' && window.location?.protocol === 'https:';

export const setBrowserCookie = (
  key: string,
  value: string,
  maxAge = DEFAULT_MAX_AGE_SECONDS,
) => {
  if (typeof document === 'undefined') {
    return;
  }

  const secure = isHttps() ? '; Secure' : '';
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const clearBrowserCookie = (key: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax`;
};
