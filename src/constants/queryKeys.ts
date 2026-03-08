export const QUERY_KEYS = {
  users: {
    search: (query: string) => ["users", "search", query] as const,
  },
} as const;
