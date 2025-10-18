import { resolveEndpoint } from '@/shared/api/config';
import { toDate } from '@/shared/lib/utils';
import { NoticeType } from '@/entities/notice/notice';
import type {
  NoticeDetailItem,
  NoticeListItem,
} from '@/entities/notice/notice-api';

type NoticeListItemDto = {
  id: string;
  title: string;
  type?: keyof typeof NoticeType | null;
  isFixed?: boolean | null;
  createdAt: string;
  attachments?: number | null;
};

type NoticeListResponseDto = {
  items: NoticeListItemDto[];
};

type NoticeDetailDto = {
  id: string;
  title: string;
  type?: keyof typeof NoticeType | null;
  isFixed?: boolean | null;
  createdAt: string;
  content: string;
  attachmentFiles?: string[] | null;
};

const createResponseError = (resource: string, response: Response) => {
  const error = new Error(`${resource} 요청 실패: ${response.status}`);
  (error as Error & { status?: number }).status = response.status;
  return error;
};

const coerceNoticeType = (
  value?: keyof typeof NoticeType | null,
): NoticeType => {
  if (!value) {
    return NoticeType.GENERAL;
  }

  return NoticeType[value] ?? NoticeType.GENERAL;
};

export const mapNoticeListItems = (
  dto: NoticeListResponseDto,
): NoticeListItem[] =>
  dto.items.map((item) => ({
    id: item.id,
    title: item.title,
    type: coerceNoticeType(item.type),
    isFixed: Boolean(item.isFixed),
    createdAt: toDate(item.createdAt),
    hasAttachments: Boolean(item.attachments && item.attachments > 0),
  }));

export const mapNoticeDetail = (dto: NoticeDetailDto): NoticeDetailItem => ({
  id: dto.id,
  title: dto.title,
  type: coerceNoticeType(dto.type),
  isFixed: Boolean(dto.isFixed),
  createdAt: toDate(dto.createdAt),
  content: dto.content,
  attachments: dto.attachmentFiles?.slice() ?? [],
});

export const fetchNoticeList = async (): Promise<NoticeListItem[]> => {
  const endpoint = resolveEndpoint('/public/notices');
  const response = await fetch(endpoint, { cache: 'no-store' });

  if (!response.ok) {
    throw createResponseError('공지 목록', response);
  }

  const payload = (await response.json()) as NoticeListResponseDto;

  return mapNoticeListItems(payload);
};

export const fetchNoticeDetail = async (
  id: string,
): Promise<NoticeDetailItem> => {
  const endpoint = resolveEndpoint(`/public/notices/${id}`);
  const response = await fetch(endpoint, { cache: 'no-store' });

  if (!response.ok) {
    throw createResponseError('공지 상세', response);
  }

  const payload = (await response.json()) as NoticeDetailDto;

  return mapNoticeDetail(payload);
};
