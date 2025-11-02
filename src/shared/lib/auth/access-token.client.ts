'use client';

import { useSyncExternalStore } from 'react';
import { toast } from 'sonner';

import { AUTH_CHANGE_EVENT_NAME } from '@/lib/auth/events';
import { readAccessToken } from './access-token';

export type EnsureAccessTokenOptions = {
  readonly silent?: boolean;
  readonly toastMessage?: string;
  readonly onMissing?: () => void;
};

export const ensureAccessToken = (
  options: EnsureAccessTokenOptions = {},
): string | null => {
  const token = readAccessToken();

  if (token) {
    return token;
  }

  if (!options.silent) {
    toast(options.toastMessage ?? '로그인이 필요합니다.');
  }

  options.onMissing?.();
  return null;
};

type StoreSubscriber = (onStoreChange: () => void) => () => void;

const createTokenStoreSubscriber = (): StoreSubscriber => {
  if (typeof window === 'undefined') {
    return () => () => {};
  }

  return (onStoreChange: () => void) => {
    const handler = () => onStoreChange();
    window.addEventListener('storage', handler);
    window.addEventListener(AUTH_CHANGE_EVENT_NAME, handler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener(AUTH_CHANGE_EVENT_NAME, handler);
    };
  };
};

const subscribe = createTokenStoreSubscriber();

export const useAccessToken = (): string | null =>
  useSyncExternalStore(
    subscribe,
    () => readAccessToken(),
    () => null,
  );
