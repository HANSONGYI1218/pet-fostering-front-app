'use client';

import { useEffect, useState } from 'react';

import { resolveStoredAuthClaims, type AuthClaims } from '@/lib/auth/session';
import { AUTH_CHANGE_EVENT_NAME } from '@/lib/auth/events';

const readStoredClaims = (): AuthClaims | null => {
  return resolveStoredAuthClaims();
};

export const useAuthClaims = () => {
  const [claims, setClaims] = useState<AuthClaims | null>(() =>
    readStoredClaims(),
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncClaims = () => {
      setClaims(readStoredClaims());
    };

    const handleStorage = () => syncClaims();
    const handleAuthChange = () => syncClaims();

    syncClaims();

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT_NAME, handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT_NAME, handleAuthChange);
    };
  }, []);

  return {
    claims,
    isAuthenticated: Boolean(claims),
  };
};
