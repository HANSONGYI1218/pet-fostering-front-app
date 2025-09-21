export type PostUserItem = {
  id: string;
  nickname: string | null;
};

export type PostItem = {
  id: string;
  user: PostUserItem;
  title: string;
  content: string;
  likes: number;
  views: number;
  created_at: string;
} & {
  authorId?: string;
  images?: string[];
  commentCount?: number;
  updated_at?: string;
};
