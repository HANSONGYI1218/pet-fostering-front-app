import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AnimalCreateDialog } from '../animal-create-dialog';

const toastMock = vi.hoisted(() => {
  const toastFn = vi.fn() as unknown as typeof import('sonner').toast;
  toastFn.success = vi.fn();
  toastFn.error = vi.fn();
  return toastFn;
});

const sessionMocks = vi.hoisted(() => ({
  resolveStoredAccessToken: vi.fn<() => string | null>(),
}));

const fosterApiMocks = vi.hoisted(() => ({
  createOrganizationAnimal: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: toastMock,
}));

vi.mock('@/lib/auth/session', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/auth/session')>(
      '@/lib/auth/session',
    );

  return {
    ...actual,
    resolveStoredAccessToken: sessionMocks.resolveStoredAccessToken,
  };
});

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
    sessionMocks.resolveStoredAccessToken.mockReturnValue(null);
    toastMock.mockClear();
    toastMock.success.mockClear();
    toastMock.error.mockClear();
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
