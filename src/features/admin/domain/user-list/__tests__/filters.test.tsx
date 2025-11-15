import { describe, it, expect } from 'vitest';
import { filterUserList } from '../filters';
import type { UserInfoItem } from '@/entities/user/user-api';

const createUser = (overrides: Partial<UserInfoItem> = {}): UserInfoItem => ({
  id: 'user-1',
  name: '홍길동',
  phoneNumber: '010-1234-5678',
  email: 'test@example.com',
  address: '서울시 강남구',
  addressDetail: '역삼동',
  displayName: 'tester',
  zipcode: '12345',
  introduction: '안녕하세요',
  isEligibleForFoster: true,
  notification: {
    commentEmail: false,
    fosterAnimalInfoEmail: false,
    fosterAnimalInfoKakao: false,
    marketingEmail: false,
    marketingKakao: false,
  },
  posts: [],
  comments: [],
  animals: [],
  ...overrides,
});

describe('filterUserList', () => {
  const users: UserInfoItem[] = [
    createUser({ id: '1', name: '홍길동', isEligibleForFoster: true }),
    createUser({ id: '2', name: '김철수', isEligibleForFoster: false }),
    createUser({
      id: '3',
      name: '이영희',
      phoneNumber: '010-9999-8888',
      email: 'lee@test.com',
      address: '서울시 마포구',
      isEligibleForFoster: false,
    }),
  ];

  it('필터 조건이 없으면 모든 유저를 반환한다', () => {
    const result = filterUserList(users, {
      eligibleForFosterStatus: '전체',
      keyword: '',
    });
    expect(result).toEqual(users);
  });

  it('임보 등록 상태 "등록" 필터를 적용한다', () => {
    const result = filterUserList(users, {
      eligibleForFosterStatus: '등록',
      keyword: '',
    });
    expect(result).toEqual([users[0]]);
  });

  it('임보 등록 상태 "미등록" 필터를 적용한다', () => {
    const result = filterUserList(users, {
      eligibleForFosterStatus: '미등록',
      keyword: '',
    });
    expect(result).toEqual([users[1], users[2]]);
  });

  it('키워드로 이름, 전화번호, 이메일, 주소를 검색한다', () => {
    expect(
      filterUserList(users, {
        eligibleForFosterStatus: '전체',
        keyword: '홍길',
      }),
    ).toEqual([users[0]]);
    expect(
      filterUserList(users, {
        eligibleForFosterStatus: '전체',
        keyword: '010-9999',
      }),
    ).toEqual([users[2]]);
    expect(
      filterUserList(users, {
        eligibleForFosterStatus: '전체',
        keyword: 'LEE@TEST',
      }),
    ).toEqual([users[2]]);
    expect(
      filterUserList(users, {
        eligibleForFosterStatus: '전체',
        keyword: '마포구',
      }),
    ).toEqual([users[2]]);
  });

  it('임보 상태 필터와 키워드 필터를 동시에 적용한다', () => {
    const result = filterUserList(users, {
      eligibleForFosterStatus: '미등록',
      keyword: 'lee@test.com',
    });
    expect(result).toEqual([users[2]]);
  });
});
