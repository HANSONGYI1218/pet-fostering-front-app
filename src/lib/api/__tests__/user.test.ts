import { vi } from 'vitest';

import {
  deleteMyAccount,
  updateMyNotificationSetting,
  updateMyProfile,
} from '../user';

vi.mock('../config', () => ({
  resolveEndpoint: (path: string) => `https://example.com${path}`,
}));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('user api update', () => {
  it('updates profile with provided payload', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'user-1',
          name: '홍길동',
          email: 'hong@example.com',
          phoneNumber: '010-0000-0000',
          zipcode: '01234',
          address: '서울시',
          addressDetail: '101호',
          introduction: '소개',
          isEligibleForFoster: true,
        }),
      }) as Response,
    );

    const profile = await updateMyProfile('token-123', {
      name: '홍길동',
      introduction: '소개',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users/me/profile',
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token-123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '홍길동',
          introduction: '소개',
        }),
      },
    );

    expect(profile).toMatchObject({
      id: 'user-1',
      name: '홍길동',
      introduction: '소개',
    });
  });

  it('updates notification settings with payload', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          commentEmail: false,
          fosterAnimalInfoEmail: true,
          fosterAnimalInfoKakao: false,
          marketingEmail: true,
          marketingKakao: true,
        }),
      }) as Response,
    );

    const settings = await updateMyNotificationSetting('token-123', {
      commentEmail: false,
      marketingEmail: true,
      marketingKakao: true,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.com/users/me/notification-settings',
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token-123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentEmail: false,
          marketingEmail: true,
          marketingKakao: true,
        }),
      },
    );

    expect(settings).toMatchObject({
      commentEmail: false,
      marketingEmail: true,
      marketingKakao: true,
    });
  });

  it('deletes account', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
      }) as Response,
    );

    await expect(deleteMyAccount('token-123')).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/users/me', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer token-123',
      },
    });
  });
});
