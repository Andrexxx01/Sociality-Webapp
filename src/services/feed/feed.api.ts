import { apiGet } from "@/lib/api-client";
import type { TimelinePost } from "@/types/post";

type FeedApiPostDto = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

type FeedResponseDto = {
  items: FeedApiPostDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FeedPage = {
  items: TimelinePost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function mapFeedPost(dto: FeedApiPostDto): TimelinePost {
  return {
    id: String(dto.id),
    imageUrl: dto.imageUrl,
    caption: dto.caption,
    createdAt: dto.createdAt,
    author: {
      id: String(dto.author.id),
      username: dto.author.username,
      name: dto.author.name,
      avatarUrl: dto.author.avatarUrl,
    },
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    shareCount: 0,
    likedByMe: dto.likedByMe,
    savedByMe: false,
  };
}

export async function getFeed(page = 1, limit = 10): Promise<FeedPage> {
  const response = await apiGet<FeedResponseDto>(
    `/api/feed?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );

  return {
    items: response.data.items.map(mapFeedPost),
    pagination: response.data.pagination,
  };
}
