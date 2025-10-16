export type NoticeListItem = {
  id: string;
  title: string;
  isFiled: boolean;
  isFixed: boolean;
  index: number;
  createdAt: Date;
};

export type NoticeDetailItem = {
  id: string;
  title: string;
  content: string;
  files: string[]; //첨부파일
  isFixed: boolean;
  index: number;
  createdAt: Date;
};
