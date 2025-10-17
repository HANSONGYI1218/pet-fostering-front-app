import { NoticeType } from './notice';

export type NoticeListItem = {
  id: string;
  type: NoticeType;
  title: string;
  isFixed: boolean;
  createdAt: Date;
  hasAttachments: boolean;
};

export type NoticeDetailItem = {
  id: string;
  type: NoticeType;
  title: string;
  content: string;
  attachments: string[];
  isFixed: boolean;
  createdAt: Date;
};
