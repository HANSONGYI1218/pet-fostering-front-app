// eslint-disable-next-line no-restricted-imports
import { resolveStoredAccessToken } from '@/lib/auth/session';

export const readAccessToken = (): string | null => resolveStoredAccessToken();
