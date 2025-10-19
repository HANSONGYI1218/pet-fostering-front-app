export type CommentSelection =
  | {
      type: 'new';
      id: string;
      parentId: string;
      content: string;
    }
  | {
      type: 'edit';
      id: string;
      parentId: string;
      content: string;
    };
