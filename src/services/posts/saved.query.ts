import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "./saved.api";

export function useSavedPostsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["saved-posts"],
    queryFn: getSavedPosts,
    enabled,
  });
}
