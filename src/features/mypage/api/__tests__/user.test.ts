import { vi } from 'vitest';

import {
  deleteMyAccount,
  updateMyNotificationSetting,
  updateMyProfile,
} from '../user';

vi.mock('@/shared/api/config', () => ({
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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestedUrl, init] = fetchMock.mock.calls[0] ?? [];
    expect(requestedUrl).toBe('https://example.com/users/me/profile');
    expect(init).toMatchObject({
      method: 'PATCH',
      body: JSON.stringify({
        name: '홍길동',
        introduction: '소개',
      }),
    });
    const headers = init?.headers as Headers | undefined;
    expect(headers).toBeInstanceOf(Headers);
    expect(headers?.get('accept')).toBe('application/json');
    expect(headers?.get('content-type')).toBe('application/json');
    expect(headers?.get('authorization')).toBe('Bearer token-123');

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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestedUrl, init] = fetchMock.mock.calls[0] ?? [];
    expect(requestedUrl).toBe(
      'https://example.com/users/me/notification-settings',
    );
    expect(init).toMatchObject({
      method: 'PATCH',
      body: JSON.stringify({
        commentEmail: false,
        marketingEmail: true,
        marketingKakao: true,
      }),
    });
    const headers = init?.headers as Headers | undefined;
    expect(headers).toBeInstanceOf(Headers);
    expect(headers?.get('accept')).toBe('application/json');
    expect(headers?.get('content-type')).toBe('application/json');
    expect(headers?.get('authorization')).toBe('Bearer token-123');

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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestedUrl, init] = fetchMock.mock.calls[0] ?? [];
    expect(requestedUrl).toBe('https://example.com/users/me');
    expect(init).toMatchObject({ method: 'DELETE' });
    const headers = init?.headers as Headers | undefined;
    expect(headers).toBeInstanceOf(Headers);
    expect(headers?.get('authorization')).toBe('Bearer token-123');
  });
});
