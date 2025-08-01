export type CommentUserItem = {
  id: string;
  nickname: string;
};

export type ReplyCommentItem = {
  id: string;
  parent_id: string;
  post_id: string;
  user: CommentUserItem;
  content: string;
  likes: number;
  created_at: string; // 또는 Date, 백엔드 응답 형식에 따라
};

export type CommentItem = {
  id: string;
  parent_id: string | null;
  post_id: string;
  user: CommentUserItem;
  content: string;
  likes: number;
  created_at: string;
  reply_comments: ReplyCommentItem[] | null;
};
