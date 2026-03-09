import { apiDelete, apiGet, apiPost } from "@/lib/api-client";

export type LikeActionData = {
  liked: boolean;
  likeCount: number;
};

export type LikeUserDto = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
};

export type PaginationDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PostLikesData = {
  users: LikeUserDto[];
  pagination: PaginationDto;
};

export type MyLikedPostDto = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likedAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type MyLikesData = {
  posts: MyLikedPostDto[];
  pagination: PaginationDto;
};

export async function likePost(postId: string | number) {
  return apiPost<LikeActionData>(`/api/posts/${postId}/like`, undefined, {
    auth: true,
  });
}

export async function unlikePost(postId: string | number) {
  return apiDelete<LikeActionData>(`/api/posts/${postId}/like`, { auth: true });
}

export async function getPostLikes(
  postId: string | number,
  page = 1,
  limit = 50,
) {
  return apiGet<PostLikesData>(
    `/api/posts/${postId}/likes?page=${page}&limit=${limit}`,
    { auth: true },
  );
}

export async function getMyLikes(page = 1, limit = 50) {
  return apiGet<MyLikesData>(`/api/me/likes?page=${page}&limit=${limit}`, {
    auth: true,
  });
}
