import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('@/features/record/api/record', () => ({
  fetchRecordDetail: vi.fn().mockResolvedValue({
    info: {
      id: 'match-1',
      state: 'IN_PROGRESS',
      organization: {
        id: 'org-1',
        name: '기관',
        phone_number: '',
        zipcode: '',
        address_detail: '',
        address: '',
        email: '',
      },
      animal: {
        name: '나비',
        type: 'CAT',
        breed: '',
        birth_date: new Date('2024-01-01T00:00:00.000Z'),
        gender: 'FEMALE',
        remark: '',
        images: [],
      },
      created_at: new Date('2024-01-01T00:00:00.000Z'),
    },
    records: [],
  }),
}));

vi.mock('@/shared/widgets/navigation/back-button', () => ({
  __esModule: true,
  default: () => <div data-testid="back-button" />,
}));

vi.mock('@/features/record/ui/record/foster-info-tile', () => ({
  __esModule: true,
  default: (props: unknown) => (
    <div data-testid="foster-info" data-props={JSON.stringify(props)} />
  ),
}));

vi.mock('@/features/record/ui/record/record-container', () => ({
  __esModule: true,
  default: (props: unknown) => (
    <div data-testid="record-container" data-props={JSON.stringify(props)} />
  ),
}));

describe('RecordDetailPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('awaits params before fetching detail', async () => {
    const { fetchRecordDetail } = await import('@/features/record/api/record');
    const { default: RecordDetailPage } = await import('./page');

    const element = await RecordDetailPage({
      params: Promise.resolve({ id: 'seed-animal-nabi' }),
    });

    render(element);

    expect(fetchRecordDetail).toHaveBeenCalledWith('seed-animal-nabi');
  });
});
