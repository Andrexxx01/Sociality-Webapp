import type { TimelinePost } from "@/types/post";

export const MOCK_TIMELINE_POSTS: TimelinePost[] = [
  {
    id: "post-1",
    imageUrl: "/images/mock-post-1.svg",
    caption:
      "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together! ....",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "user-1",
      name: "Johndoe",
      username: "johndoe",
      avatarUrl: "/images/default-avatar.svg",
    },
    likeCount: 20,
    commentCount: 20,
    shareCount: 20,
    likedByMe: false,
    savedByMe: false,
  },
  {
    id: "post-2",
    imageUrl: "/images/mock-post-2.jpg",
    caption:
      "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together! ....",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "user-1",
      name: "Johndoe",
      username: "johndoe",
      avatarUrl: "/images/default-avatar.svg",
    },
    likeCount: 20,
    commentCount: 20,
    shareCount: 20,
    likedByMe: false,
    savedByMe: false,
  },
  {
    id: "post-3",
    imageUrl: "/images/mock-post-3.jpg",
    caption:
      "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together! ....",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "user-1",
      name: "Johndoe",
      username: "johndoe",
      avatarUrl: "/images/default-avatar.svg",
    },
    likeCount: 20,
    commentCount: 20,
    shareCount: 20,
    likedByMe: false,
    savedByMe: false,
  },
  {
    id: "post-4",
    imageUrl: "/images/mock-post-4.jpg",
    caption:
      "Creating unforgettable moments with my favorite person! 📸✨ Let's cherish every second together! ....",
    createdAt: new Date(Date.now() - 60 * 1000).toISOString(),
    author: {
      id: "user-1",
      name: "Johndoe",
      username: "johndoe",
      avatarUrl: "/images/default-avatar.svg",
    },
    likeCount: 20,
    commentCount: 20,
    shareCount: 20,
    likedByMe: false,
    savedByMe: false,
  },
];
