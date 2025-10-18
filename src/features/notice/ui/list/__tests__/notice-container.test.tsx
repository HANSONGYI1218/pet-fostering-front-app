import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NoticeContainer } from '../notice-container';
import { NoticeType } from '@/shared/types/notice/notice';

const createNotice = (overrides: Partial<Parameters<typeof NoticeContainer>[0]['notices'][number]>) => ({
  id: 'notice-id',
  title: '공지 제목',
  type: NoticeType.GENERAL,
  isFixed: false,
  createdAt: new Date('2024-02-01T12:00:00Z'),
  hasAttachments: false,
  ...overrides,
});

describe('NoticeContainer', () => {
  it('첨부파일이 있는 공지에는 숨김 텍스트로 첨부파일 배지를 노출한다', () => {
    const notices = [
      createNotice({ id: 'fixed', isFixed: true, hasAttachments: true }),
      createNotice({ id: 'general', title: '두 번째 공지' }),
    ];

    render(<NoticeContainer notices={notices} />);

    expect(screen.getByText('첨부파일')).toBeInTheDocument();
  });

  it('상단에는 고정 공지가 먼저 배치된다', () => {
    const notices = [
      createNotice({ id: 'general', title: '일반 공지' }),
      createNotice({ id: 'fixed', title: '고정 공지', isFixed: true }),
    ];

    render(<NoticeContainer notices={notices} />);

    const items = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('/notice/'));

    expect(items[0]).toHaveAttribute('href', '/notice/fixed');
  });
});
