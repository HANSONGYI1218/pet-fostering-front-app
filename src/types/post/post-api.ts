export type PostUserItem = {
  id: string;
  nickname: string;
};

export type PostItem = {
  id: string;
  user: PostUserItem;
  images: string[];
  title: string;
  content: string;
  likes: number;
  views: number;
  created_at: string; // ISO 날짜 문자열 형식. 필요시 Date로 변환
};
