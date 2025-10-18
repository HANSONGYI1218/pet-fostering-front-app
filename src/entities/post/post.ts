export type Post = {
  id: string;
  images: string[];
  title: string;
  content: string;
  likes: number;
  views: number;
  created_at: string;
  updated_at: Date;
  user_id: string;
};
