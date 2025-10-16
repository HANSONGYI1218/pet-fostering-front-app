export type FosterRecord = {
  id: string;
  title: string;
  content: string;
  files: string[]; //첨부파일
  isFixed: boolean;
  index: number; // 고정된 공지 중 우선순위
  createdAt: Date;
  updatedAt: Date;
};
