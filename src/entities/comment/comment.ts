export type Comment = {
  id: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: Date;
  user_id: string;
  parent_id: string | null;
  post_id: string;
};
