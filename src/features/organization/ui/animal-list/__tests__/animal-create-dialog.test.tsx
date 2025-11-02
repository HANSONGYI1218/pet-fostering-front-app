import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AnimalCreateDialog } from '../animal-create-dialog';

const toastMock = vi.hoisted(() => {
  const toastFn = vi.fn() as unknown as typeof import('sonner').toast;
  toastFn.success = vi.fn();
  toastFn.error = vi.fn();
  return toastFn;
});

const authTokenMocks = vi.hoisted(() => ({
  useAccessToken: vi.fn<() => string | null>(() => null),
  ensureAccessToken: vi.fn<() => string | null>(() => 'token'),
}));

const fosterApiMocks = vi.hoisted(() => ({
  createOrganizationAnimal: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: toastMock,
}));

vi.mock('@/shared/lib/auth/access-token.client', () => ({
  useAccessToken: authTokenMocks.useAccessToken,
  ensureAccessToken: authTokenMocks.ensureAccessToken,
}));

vi.mock('@/features/organization/api/foster-admin', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/organization/api/foster-admin')
  >('@/features/organization/api/foster-admin');

  return {
    ...actual,
    createOrganizationAnimal: fosterApiMocks.createOrganizationAnimal,
  };
});

describe('AnimalCreateDialog', () => {
  beforeEach(() => {
    fosterApiMocks.createOrganizationAnimal.mockResolvedValue({
      id: 'animal-1',
      name: '두부',
      status: 'IN_PROGRESS',
      shared: false,
      orgId: 'org-1',
      ownerUserId: null,
      fosterDays: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    authTokenMocks.useAccessToken.mockReturnValue(null);
    authTokenMocks.ensureAccessToken.mockImplementation(() => {
      toastMock('로그인이 필요합니다.');
      return null;
    });
    toastMock.mockClear();
    toastMock.success.mockClear();
    toastMock.error.mockClear();
    Object.assign(URL, {
      createObjectURL: vi.fn(() => 'blob:preview-1'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    fosterApiMocks.createOrganizationAnimal.mockReset();
  });

  it('로그인하지 않은 상태에서는 다이얼로그를 열 수 없다', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AnimalCreateDialog />
      </QueryClientProvider>,
    );

    const button = screen.getByRole('button', { name: /보호 동물 추가/i });
    fireEvent.click(button);

    expect(toastMock).toHaveBeenCalledWith('로그인이 필요합니다.');
    expect(fosterApiMocks.createOrganizationAnimal).not.toHaveBeenCalled();

    queryClient.clear();
  });
});
