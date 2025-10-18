import { describe, expect, it } from 'vitest';

import { mapNoticeDetail, mapNoticeListItems } from '../notice';
import { NoticeType } from '@/entities/notice/notice';

describe('notice api mappers', () => {
  it('mapNoticeListItems는 목록 DTO를 도메인 모델로 변환한다', () => {
    const dto = {
      items: [
        {
          id: 'n-1',
          title: '공지 1',
          type: 'GENERAL',
          isFixed: true,
          createdAt: '2024-02-01T12:00:00Z',
          attachments: 0,
        },
      ],
    };

    expect(mapNoticeListItems(dto)).toEqual([
      {
        id: 'n-1',
        title: '공지 1',
        type: NoticeType.GENERAL,
        isFixed: true,
        createdAt: new Date('2024-02-01T12:00:00Z'),
        hasAttachments: false,
      },
    ]);
  });

  it('mapNoticeDetail는 상세 DTO를 도메인 모델로 변환한다', () => {
    const dto = {
      id: 'n-2',
      title: '상세 공지',
      type: 'EVENT',
      isFixed: false,
      createdAt: '2024-03-05T09:30:00Z',
      content: '본문',
      attachmentFiles: ['file-a.pdf', 'file-b.pdf'],
    };

    expect(mapNoticeDetail(dto)).toEqual({
      id: 'n-2',
      title: '상세 공지',
      type: NoticeType.EVENT,
      isFixed: false,
      createdAt: new Date('2024-03-05T09:30:00Z'),
      content: '본문',
      attachments: ['file-a.pdf', 'file-b.pdf'],
    });
  });
});
