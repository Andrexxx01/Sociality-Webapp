"use client";

import { useParams, useRouter } from "next/navigation";
import FollowListView from "@/components/user/followListView";
import FollowPageShell from "@/components/user/followPageShell";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useUserFollowersQuery } from "@/services/users/users.query";

export default function UserFollowersPage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const authUser = useAppSelector((state) => state.auth.user);
  const username = params?.username ?? "";
  const query = useUserFollowersQuery(username, 1, 50, Boolean(username));

  return (
    <FollowPageShell
      title="Followers"
      isAuthenticated={Boolean(authUser)}
      onBack={() => router.back()}
    >
      <FollowListView
        title="Followers"
        users={query.data?.users ?? []}
        queryKey={["users", "followers", username, 1, 50]}
        isAuthenticated={Boolean(authUser)}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyTitle="No followers yet"
        emptyDescription="This user does not have any followers yet."
      />
    </FollowPageShell>
  );
}
