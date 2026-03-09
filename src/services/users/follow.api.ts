import { apiDelete, apiGet, apiPost } from "@/lib/api-client";

export type FollowUserDto = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

export type PaginationDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FollowActionData = {
  following: boolean;
};

export type FollowListData = {
  users: FollowUserDto[];
  pagination: PaginationDto;
};

export async function followUser(username: string) {
  return apiPost<FollowActionData>(`/api/follow/${username}`, undefined, {
    auth: true,
  });
}

export async function unfollowUser(username: string) {
  return apiDelete<FollowActionData>(`/api/follow/${username}`, { auth: true });
}

export async function getMyFollowing(page = 1, limit = 50) {
  return apiGet<FollowListData>(
    `/api/me/following?page=${page}&limit=${limit}`,
    { auth: true },
  );
}

export async function getUserFollowing(username: string, page = 1, limit = 50) {
  return apiGet<FollowListData>(
    `/api/users/${username}/following?page=${page}&limit=${limit}`,
  );
}
