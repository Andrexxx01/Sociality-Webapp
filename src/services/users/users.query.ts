"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicProfile,
  getUserLikedPosts,
  getUserPosts,
  searchUsers,
  getMyFollowers,
  getMyFollowing,
  getUserFollowers,
  getUserFollowing,
} from "./users.api";

export function useSearchUsersQuery(query: string, enabled = true) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: enabled && query.trim().length > 0,
  });
}

export function usePublicProfileQuery(username: string, enabled = true) {
  return useQuery({
    queryKey: ["users", "profile", username],
    queryFn: () => getPublicProfile(username),
    enabled: enabled && username.trim().length > 0,
  });
}

export function useUserPostsQuery(
  username: string,
  page = 1,
  limit = 50,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", "posts", username, page, limit],
    queryFn: () => getUserPosts(username, page, limit),
    enabled: enabled && username.trim().length > 0,
  });
}

export function useUserLikedPostsQuery(
  username: string,
  page = 1,
  limit = 50,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", "likes", username, page, limit],
    queryFn: () => getUserLikedPosts(username, page, limit),
    enabled: enabled && username.trim().length > 0,
  });
}

export function useMyFollowersQuery(page = 1, limit = 50, enabled = true) {
  return useQuery({
    queryKey: ["me", "followers", page, limit],
    queryFn: () => getMyFollowers(page, limit),
    enabled,
  });
}

export function useMyFollowingQuery(page = 1, limit = 50, enabled = true) {
  return useQuery({
    queryKey: ["me", "following", page, limit],
    queryFn: () => getMyFollowing(page, limit),
    enabled,
  });
}

export function useUserFollowersQuery(
  username: string,
  page = 1,
  limit = 50,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", "followers", username, page, limit],
    queryFn: () => getUserFollowers(username, page, limit),
    enabled: enabled && Boolean(username),
  });
}

export function useUserFollowingQuery(
  username: string,
  page = 1,
  limit = 50,
  enabled = true,
) {
  return useQuery({
    queryKey: ["users", "following", username, page, limit],
    queryFn: () => getUserFollowing(username, page, limit),
    enabled: enabled && Boolean(username),
  });
}
