export enum NoticeType {
  GENERAL = 'GENERAL',
  EVENT = 'EVENT',
  MAINTENANCE = 'MAINTENANCE',
  POLICY = 'POLICY',
  RECRUITMENT = 'RECRUITMENT',
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
