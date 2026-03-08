import { apiGet } from "@/lib/api-client";
import type { SearchUsersResponseData } from "@/types/user";

export async function searchUsers(q: string): Promise<SearchUsersResponseData> {
  const response = await apiGet<SearchUsersResponseData>(
    `/api/users/search?q=${encodeURIComponent(q)}&page=1&limit=10`,
  );

  return response.data;
}
