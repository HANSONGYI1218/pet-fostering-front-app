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
  created_at: Date;
};

export type CommentItem = {
  id: string;
  parent_id: string | null;
  post_id: string;
  user: CommentUserItem;
  content: string;
  likes: number;
  created_at: Date;
  reply_comments: ReplyCommentItem[] | null;
};
