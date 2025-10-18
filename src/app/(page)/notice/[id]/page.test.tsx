import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const renderStub = vi.fn();

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('not-found');
  }),
}));

vi.mock('@/features/notice/api/notice', () => ({
  fetchNoticeDetail: vi.fn(),
}));

vi.mock('@/shared/widgets/navigation/back-button', () => ({
  __esModule: true,
  default: (props: unknown) => {
    renderStub(props);
    return null;
  },
}));

vi.mock('@/shared/widgets/feedback/fetch-error-box', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/shared/ui/button', () => ({
  __esModule: true,
  Button: (props: { children?: React.ReactNode }) => (
    <button>{props.children}</button>
  ),
}));

vi.mock('@/shared/ui/badge', () => ({
  __esModule: true,
  Badge: (props: { children?: React.ReactNode }) => (
    <span>{props.children}</span>
  ),
}));

vi.mock('@/shared/lib/logging', () => ({
  logError: vi.fn(),
}));

const mockNotice = {
  id: 'notice-1',
  title: '테스트 공지',
  type: 'GENERAL',
  isFixed: false,
  createdAt: new Date('2024-10-01T00:00:00.000Z'),
  content: '공지 내용',
  attachments: ['https://cdn/file.pdf'],
};

describe('NoticeDetailPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('awaits params before fetching detail', async () => {
    const { fetchNoticeDetail } = await import('@/features/notice/api/notice');
    fetchNoticeDetail.mockResolvedValue(mockNotice);
    const { default: NoticeDetailPage } = await import('./page');

    const element = await NoticeDetailPage({
      params: Promise.resolve({ id: mockNotice.id }),
    });

    render(element);

    expect(fetchNoticeDetail).toHaveBeenCalledWith(mockNotice.id);
    expect(screen.getByText('테스트 공지')).toBeInTheDocument();
  });

  it('calls notFound when detail is missing', async () => {
    const { fetchNoticeDetail } = await import('@/features/notice/api/notice');
    fetchNoticeDetail.mockRejectedValue(
      Object.assign(new Error('missing'), { status: 404 }),
    );
    const { default: NoticeDetailPage } = await import('./page');

    await expect(
      NoticeDetailPage({
        params: Promise.resolve({ id: 'missing-notice' }),
      }),
    ).rejects.toThrow('not-found');
  });
});
