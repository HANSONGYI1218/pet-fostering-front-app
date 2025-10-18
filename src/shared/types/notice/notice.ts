export enum NoticeType {
  GENERAL = 'GENERAL', // 일반 공지
  EVENT = 'EVENT', // 이벤트 안내
  MAINTENANCE = 'MAINTENANCE', // 서비스 점검/업데이트
  POLICY = 'POLICY', // 정책 변경 안내
  RECRUITMENT = 'RECRUITMENT', // 채용 관련 공지
}

export type Notice = {
  id: string;
  type: NoticeType;
  title: string;
  content: string;
  attachments: string[];
  isFixed: boolean;
  createdAt: Date;
  updatedAt: Date;
};
