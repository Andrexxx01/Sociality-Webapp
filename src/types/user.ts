export type SearchUserItem = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe?: boolean;
};

export type SearchUsersResponseData = {
  users: SearchUserItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type LikeUserItem = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  isMe?: boolean;
  isFollowedByMe?: boolean;
};