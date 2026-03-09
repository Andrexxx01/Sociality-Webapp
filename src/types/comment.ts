export type TimelineComment = {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
};
