import { UserInfoItem } from '@/entities/user/user-api';

export type FosterFilterValue<T> = T | '전체';

export type UserFilterOptions = {
  eligibleForFosterStatus: '전체' | '등록' | '미등록';
  keyword: string;
};

const matchesEligibleFoster = (
  user: UserInfoItem,
  status: '전체' | '등록' | '미등록',
): boolean => {
  if (status === '전체') return true;
  const checked = status === '등록';
  return user.isEligibleForFoster === checked;
};

const matchesKeyword = (user: UserInfoItem, keyword: string): boolean => {
  if (!keyword) return true;

  const normalizedKeyword = keyword.toLowerCase();

  const fields = [
    user.name ?? '',
    user.phoneNumber ?? '',
    user.email ?? '',
    user.address ?? '',
  ].map((field) => field.toLowerCase()); // null 안전하게 소문자로 변환

  return fields.some((field) => field.includes(normalizedKeyword));
};

export const filterUserList = (
  users: UserInfoItem[],
  options: UserFilterOptions,
): UserInfoItem[] => {
  const { eligibleForFosterStatus, keyword } = options;

  return users.filter(
    (user) =>
      matchesEligibleFoster(user, eligibleForFosterStatus) &&
      matchesKeyword(user, keyword),
  );
};
