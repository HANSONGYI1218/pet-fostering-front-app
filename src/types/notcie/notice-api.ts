import { NoticeType } from './notice';

export type NoticeListItem = {
  id: string;
  type: NoticeType;
  title: string;
  isFiled: boolean;
  isFixed: boolean;
  index: number;
  createdAt: Date;
};

export type NoticeDetailItem = {
  id: string;
  type: NoticeType;
  title: string;
  content: string;
  files: string[]; //첨부파일
  isFixed: boolean;
  index: number;
  createdAt: Date;
};
