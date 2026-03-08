export type TimelinePostAuthor = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type TimelinePost = {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: TimelinePostAuthor;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  savedByMe?: boolean;
  likedByMe?: boolean;
};
