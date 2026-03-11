"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FollowListView from "@/components/user/followListView";
import FollowPageShell from "@/components/user/followPageShell";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useMyFollowingQuery } from "@/services/users/users.query";

export default function MyFollowingPage() {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  const query = useMyFollowingQuery(1, 50, Boolean(authUser));

  if (!authUser) return null;

  return (
    <FollowPageShell
      title="Following"
      isAuthenticated={Boolean(authUser)}
      onBack={() => router.back()}
    >
      <FollowListView
        title="Following"
        users={query.data?.users ?? []}
        queryKey={["me", "following", 1, 50]}
        isAuthenticated={Boolean(authUser)}
        isLoading={query.isLoading}
        isError={query.isError}
        emptyTitle="You are not following anyone yet"
        emptyDescription="Accounts you follow will appear here."
      />
    </FollowPageShell>
  );
}
