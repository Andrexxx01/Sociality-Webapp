import { apiGet } from "@/lib/api-client";

export type SavedPostItem = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

type SavedPostsResponse = {
  posts: SavedPostItem[];
};

export async function getSavedPosts(): Promise<SavedPostItem[]> {
  const res = await apiGet<SavedPostsResponse>("/api/me/saved", {
    auth: true,
  });
  return res.data.posts;
}
