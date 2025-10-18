import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('@/features/organization/api/organization', () => ({
  fetchOrganizationAnimalDetail: vi.fn().mockResolvedValue({
    id: 'animal-1',
    name: '몽실이',
    images: [],
  }),
}));

vi.mock('@/shared/widgets/navigation/back-button', () => ({
  __esModule: true,
  default: () => <div data-testid="back-button" />,
}));

vi.mock(
  '@/features/organization/ui/animal-list/animal-detail-container',
  () => ({
    __esModule: true,
    default: (props: unknown) => (
      <div
        data-testid="animal-detail-container"
        data-props={JSON.stringify(props)}
      />
    ),
  }),
);

vi.mock('@/shared/widgets/feedback/fetch-error-box', () => ({
  __esModule: true,
  default: () => <div data-testid="fetch-error" />,
}));

vi.mock('@/shared/ui/button', () => ({
  __esModule: true,
  Button: ({ children }: { children?: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

vi.mock('@/shared/widgets/map/kakao-maps-script', () => ({
  __esModule: true,
  default: () => null,
}));

describe('AnimalListDetailPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('awaits params before fetching animal detail', async () => {
    const { fetchOrganizationAnimalDetail } = await import(
      '@/features/organization/api/organization'
    );
    const { default: AnimalListDetailPage } = await import('./page');

    const element = await AnimalListDetailPage({
      params: Promise.resolve({ id: 'animal-1' }),
    });

    render(element);

    expect(fetchOrganizationAnimalDetail).toHaveBeenCalledWith('animal-1');
  });
});
