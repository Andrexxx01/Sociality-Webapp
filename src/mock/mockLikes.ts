import type { LikeUserItem } from "@/types/user";

export const MOCK_LIKES_USERS: LikeUserItem[] = [
  {
    id: "like-user-1",
    username: "johndoe",
    name: "Johndoe",
    avatarUrl: "/images/default-avatar.svg",
    isMe: false,
    isFollowedByMe: false,
  },
  {
    id: "like-user-2",
    username: "janedoe",
    name: "Janedoe",
    avatarUrl: "/images/default-avatar.svg",
    isMe: false,
    isFollowedByMe: true,
  },
  {
    id: "like-user-3",
    username: "haziel",
    name: "Haziel",
    avatarUrl: "/images/default-avatar.svg",
    isMe: true,
    isFollowedByMe: false,
  },
  {
    id: "like-user-4",
    username: "michael",
    name: "Michael",
    avatarUrl: "/images/default-avatar.svg",
    isMe: false,
    isFollowedByMe: false,
  },
];
