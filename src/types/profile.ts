import type { TimelinePost } from "@/types/post";

export type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

export type MeProfile = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type MeProfileResponseData = {
  profile: MeProfile;
  stats: ProfileStats;
};

export type UpdateMePayload = {
  name: string;
  username: string;
  phone: string;
  bio: string;
  avatar?: File | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type MePostsResponseData = {
  items: TimelinePost[];
  pagination: PaginationMeta;
};

export type PublicProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
};

export type UserPostsResponseData = {
  posts: TimelinePost[];
  pagination: PaginationMeta;
};

export type GridPostItem = {
  id: number | string;
  imageUrl: string;
  caption?: string;
};
