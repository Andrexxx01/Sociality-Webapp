"use client";

import { useParams, useRouter } from "next/navigation";
import FollowListView from "@/components/user/followListView";
import FollowPageShell from "@/components/user/followPageShell";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useUserFollowingQuery } from "@/services/users/users.query";

export default function UserFollowingPage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const authUser = useAppSelector((state) => state.auth.user);
  const username = params?.username ?? "";
  const query = useUserFollowingQuery(username, 1, 50, Boolean(username));

  return (
    <FollowPageShell
      title="Following"
      isAuthenticated={Boolean(authUser)}
      onBack={() => router.back()}
    >
      <FollowListView
        title="Following"
        users={query.data?.users ?? []}
        queryKey={["users", "following", username, 1, 50]}
        isAuthenticated={Boolean(authUser)}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyTitle="Not following anyone yet"
        emptyDescription="This user is not following anyone yet."
      />
    </FollowPageShell>
  );
}
