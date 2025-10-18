import type { AuthClaims } from '@/lib/auth/session';
import type { UserProfileItem } from '@/entities/user/user-api';

const trimToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : null;
};

const createProfileFromClaims = (claims: AuthClaims): UserProfileItem => ({
  id: claims.userId,
  name: trimToNull(claims.displayName),
  email: null,
  phoneNumber: null,
  zipcode: null,
  address: null,
  addressDetail: null,
  introduction: null,
  isEligibleForFoster: false,
});

export const mergeProfileWithClaims = (
  profile: UserProfileItem | null,
  claims: AuthClaims | null,
): UserProfileItem | null => {
  if (!profile && !claims) {
    return null;
  }

  if (!claims) {
    return profile;
  }

  const fallbackProfile = createProfileFromClaims(claims);

  if (!profile) {
    return fallbackProfile;
  }

  const nextName = profile.name ?? fallbackProfile.name;
  const nextId = profile.id || fallbackProfile.id;

  if (nextName === profile.name && nextId === profile.id) {
    return profile;
  }

  return {
    ...profile,
    id: nextId,
    name: nextName,
  };
};
