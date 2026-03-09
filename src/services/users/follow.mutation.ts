import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "./follow.api";

export function useToggleFollowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      following,
    }: {
      userId: string;
      following: boolean;
    }) => {
      if (following) {
        return unfollowUser(userId);
      }
      return followUser(userId);
    },

    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({ queryKey: ["likes"] });
      const previous = queryClient.getQueryData(["likes"]);
      queryClient.setQueryData(["likes"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          users: old.users.map((u: any) =>
            u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u,
          ),
        };
      });
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["likes"], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
}
