import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost, unsavePost } from "./bookmark.api";

export function useToggleBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      saved,
    }: {
      postId: string;
      saved: boolean;
    }) => {
      if (saved) {
        return unsavePost(postId);
      }
      return savePost(postId);
    },

    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({
        queryKey: ["explore-posts"],
      });
      const previous = queryClient.getQueryData(["explore-posts"]);
      queryClient.setQueryData(["explore-posts"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: any) =>
              p.id === postId
                ? {
                    ...p,
                    savedByMe: !p.savedByMe,
                  }
                : p,
            ),
          })),
        };
      });
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["explore-posts"], context.previous);
      }
    },
  });
}
