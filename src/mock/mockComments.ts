import type { TimelineComment } from "@/types/comment";

export const MOCK_COMMENTS: TimelineComment[] = [
  {
    id: "comment-1",
    postId: "post-1",
    content: "This is the kind of love everyone dreams about ✨",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "comment-user-1",
      name: "Clarissa",
      username: "clarissa",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "comment-2",
    postId: "post-1",
    content: "This is the kind of love everyone dreams about ✨",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "comment-user-1",
      name: "Clarissa",
      username: "clarissa",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "comment-3",
    postId: "post-1",
    content: "This is the kind of love everyone dreams about ✨",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "comment-user-1",
      name: "Clarissa",
      username: "clarissa",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
  {
    id: "comment-4",
    postId: "post-1",
    content: "This is the kind of love everyone dreams about ✨",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "comment-user-1",
      name: "Clarissa",
      username: "clarissa",
      avatarUrl: "/images/default-avatar.svg",
    },
  },
];
