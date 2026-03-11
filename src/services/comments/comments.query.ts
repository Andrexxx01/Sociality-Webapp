"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getPostComments } from "./comments.api";
import type { TimelineComment } from "@/types/comment";

function mapCommentDtoToTimelineComment(
  dto: Awaited<ReturnType<typeof createComment>>["data"],
  postId: string,
): TimelineComment {
  return {
    id: String(dto.id),
    postId: String(postId),
    content: dto.text,
    createdAt: dto.createdAt,
    author: {
      id: String(dto.author.id),
      username: dto.author.username,
      name: dto.author.name,
      avatarUrl: dto.author.avatarUrl,
    },
  };
}

export function usePostCommentsQuery(postId: string, enabled = true) {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const response = await getPostComments(postId, 1, 50);

      return response.data.comments.map(
        (comment): TimelineComment => ({
          id: String(comment.id),
          postId: String(postId),
          content: comment.text,
          createdAt: comment.createdAt,
          author: {
            id: String(comment.author.id),
            username: comment.author.username,
            name: comment.author.name,
            avatarUrl: comment.author.avatarUrl,
          },
        }),
      );
    },
    enabled: enabled && Boolean(postId),
  });
}

export function useCreateCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      return createComment(postId, text);
    },

    onSuccess: (response) => {
      queryClient.setQueryData<TimelineComment[]>(
        ["post-comments", postId],
        (old = []) => {
          const mapped = mapCommentDtoToTimelineComment(response.data, postId);
          return [...old, mapped];
        },
      );

      queryClient.setQueryData<any>(["post-detail", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          commentCount: old.commentCount + 1,
        };
      });

      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["me", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "likes"] });
    },
  });
}

export function useDeleteCommentMutation(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      return deleteComment(String(commentId));
    },

    onSuccess: (_response, commentId) => {
      queryClient.setQueryData<TimelineComment[]>(
        ["post-comments", postId],
        (old = []) =>
          old.filter((comment) => String(comment.id) !== String(commentId)),
      );

      queryClient.setQueryData<any>(["post-detail", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          commentCount: Math.max(0, old.commentCount - 1),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["me", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "likes"] });
    },
  });
}
