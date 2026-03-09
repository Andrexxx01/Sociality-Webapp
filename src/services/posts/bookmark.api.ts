import { apiPost, apiDelete } from "@/lib/api-client";

export async function savePost(postId: string) {
  const response = await apiPost(
    `/api/posts/${postId}/save`,
    {},
    { auth: true },
  );
  return response.data;
}

export async function unsavePost(postId: string) {
  const response = await apiDelete(`/api/posts/${postId}/save`, { auth: true });
  return response.data;
}
