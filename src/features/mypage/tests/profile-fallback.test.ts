import { describe, expect, it } from 'vitest';

import type { AuthClaims } from '@/lib/auth/session';
import type { UserProfileItem } from '@/entities/user/user-api';
import { mergeProfileWithClaims } from '@/features/mypage/lib/profile-fallback';

const createProfile = (
  overrides: Partial<UserProfileItem> = {},
): UserProfileItem => ({
  id: 'user-123',
  name: null,
  email: null,
  phoneNumber: null,
  zipcode: null,
  address: null,
  addressDetail: null,
  introduction: null,
  isEligibleForFoster: false,
  ...overrides,
});

const createClaims = (overrides: Partial<AuthClaims> = {}): AuthClaims => ({
  userId: 'user-123',
  displayName: 'Muna',
  avatarUrl: 'https://example.com/avatar.png',
  ...overrides,
});

describe('mergeProfileWithClaims', () => {
  it('returns null when no profile and no claims', () => {
    expect(mergeProfileWithClaims(null, null)).toBeNull();
  });

  it('fills missing profile name from auth claims', () => {
    const claims = createClaims();

    const result = mergeProfileWithClaims(null, claims);

    expect(result).toEqual(
      createProfile({ id: claims.userId, name: claims.displayName }),
    );
  });

  it('keeps existing profile name when provided by API', () => {
    const profile = createProfile({ name: 'Existing' });
    const claims = createClaims({ displayName: 'Other' });

    const result = mergeProfileWithClaims(profile, claims);

    expect(result).toEqual(profile);
  });

  it('ignores empty display name from claims', () => {
    const profile = createProfile();
    const claims = createClaims({ displayName: '   ' });

    const result = mergeProfileWithClaims(profile, claims);

    expect(result).toEqual(profile);
  });
});
