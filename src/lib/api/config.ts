const PROD_API_BASE_URL = 'https://api.impomatch.com/api';
const LOCAL_API_BASE_URL = 'http://localhost:3001';

const DEFAULT_API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? PROD_API_BASE_URL
    : LOCAL_API_BASE_URL;

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
