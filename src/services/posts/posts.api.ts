import { apiGet } from "@/lib/api-client";

export type PostAuthor = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type PostItem = {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  author: PostAuthor;
};

export type PostsResponse = {
  posts: PostItem[];
  nextCursor?: string;
};

export async function getExplorePosts(cursor?: string) {
  const params = new URLSearchParams();
  params.set("limit", "50");
  if (cursor) {
    params.set("cursor", cursor);
  }
  const response = await apiGet<PostsResponse>(
    `/api/posts?${params.toString()}`,
  );
  return response.data;
}
