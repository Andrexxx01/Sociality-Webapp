import { apiGet } from "@/lib/api-client";
import type { SearchUsersResponseData, FollowListResponseData } from "@/types/user";
import type { PublicProfile, UserPostsResponseData } from "@/types/profile";

export async function searchUsers(q: string): Promise<SearchUsersResponseData> {
  const response = await apiGet<SearchUsersResponseData>(
    `/api/users/search?q=${encodeURIComponent(q)}&page=1&limit=50`,
    {
      auth: true,
    },
  );
  return response.data;
}

export async function getPublicProfile(
  username: string,
): Promise<PublicProfile> {
  const response = await apiGet<PublicProfile>(`/api/users/${username}`, {
    auth: true,
  });
  return response.data;
}

export async function getUserPosts(
  username: string,
  page = 1,
  limit = 50,
): Promise<UserPostsResponseData> {
  const response = await apiGet<UserPostsResponseData>(
    `/api/users/${username}/posts?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );
  return response.data;
}

export async function getUserLikedPosts(
  username: string,
  page = 1,
  limit = 50,
): Promise<UserPostsResponseData> {
  const response = await apiGet<UserPostsResponseData>(
    `/api/users/${username}/likes?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );
  return response.data;
}

export async function getMyFollowers(
  page = 1,
  limit = 50,
): Promise<FollowListResponseData> {
  const response = await apiGet<FollowListResponseData>(
    `/api/me/followers?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );

  return response.data;
}

export async function getMyFollowing(
  page = 1,
  limit = 50,
): Promise<FollowListResponseData> {
  const response = await apiGet<FollowListResponseData>(
    `/api/me/following?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );

  return response.data;
}

export async function getUserFollowers(
  username: string,
  page = 1,
  limit = 50,
): Promise<FollowListResponseData> {
  const response = await apiGet<FollowListResponseData>(
    `/api/users/${username}/followers?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );

  return response.data;
}

export async function getUserFollowing(
  username: string,
  page = 1,
  limit = 50,
): Promise<FollowListResponseData> {
  const response = await apiGet<FollowListResponseData>(
    `/api/users/${username}/following?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );

  return response.data;
}
