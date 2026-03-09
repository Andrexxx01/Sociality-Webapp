import { useInfiniteQuery } from "@tanstack/react-query";
import { getExplorePosts } from "./posts.api";

export function useExplorePostsQuery() {
  return useInfiniteQuery({
    queryKey: ["explore-posts"],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => getExplorePosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
