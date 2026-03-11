"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, getExplorePosts, getPostDetail, createPost } from "./posts.api";

export function useExplorePostsQuery() {
  return useInfiniteQuery({
    queryKey: ["explore-posts"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getExplorePosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function usePostDetailQuery(postId: string, enabled = true) {
  return useQuery({
    queryKey: ["post-detail", postId],
    queryFn: () => getPostDetail(postId),
    enabled: enabled && Boolean(postId),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
        queryClient.invalidateQueries({ queryKey: ["explore-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["me", "posts"] }),
        queryClient.invalidateQueries({ queryKey: ["me", "profile"] }),
        queryClient.invalidateQueries({ queryKey: ["saved-posts"] }),
      ]);
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return deletePost(postId);
    },

    onSuccess: async (_response, postId) => {
      queryClient.removeQueries({ queryKey: ["post-detail", postId] });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
        queryClient.invalidateQueries({ queryKey: ["explore-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["me", "posts"] }),
        queryClient.invalidateQueries({ queryKey: ["saved-posts"] }),
        queryClient.invalidateQueries({ queryKey: ["users", "posts"] }),
        queryClient.invalidateQueries({ queryKey: ["users", "likes"] }),
      ]);
    },
  });
}
