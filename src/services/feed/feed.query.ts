"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "./feed.api";

export function useFeedInfiniteQuery(limit = 10) {
  return useInfiniteQuery({
    queryKey: ["feed"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getFeed(pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
