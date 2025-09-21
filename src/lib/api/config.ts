const DEFAULT_API_BASE_URL =
  'https://vfow5t29gb.execute-api.ap-northeast-2.amazonaws.com/dev/api';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`;

export const getApiBaseUrl = () => {
  const candidate = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!candidate) {
    return DEFAULT_API_BASE_URL;
  }

  return trimTrailingSlash(candidate);
};

export const resolveEndpoint = (path: string) =>
  `${getApiBaseUrl()}${ensureLeadingSlash(path)}`;
