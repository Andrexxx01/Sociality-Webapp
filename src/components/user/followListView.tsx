"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import UserListItem from "./userListItem";
import type { FollowListResponseData, SearchUserItem } from "@/types/user";

type FollowListViewProps = {
  title: string;
  users: SearchUserItem[];
  queryKey: unknown[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  emptyTitle: string;
  emptyDescription: string;
  onBack?: () => void;
};

function FollowListLoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-[24px] border border-brand-neutral-900 bg-brand-neutral-950/40 px-4 py-3"
        >
          <div className="h-13 w-13 animate-pulse rounded-full bg-brand-neutral-900" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-34 animate-pulse rounded bg-brand-neutral-900" />
            <div className="mt-2 h-3.5 w-22 animate-pulse rounded bg-brand-neutral-900" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-brand-neutral-900" />
        </div>
      ))}
    </div>
  );
}

function FollowListErrorState() {
  return (
    <div className="flex min-h-80 items-center justify-center text-center">
      <p className="text-[18px] font-medium text-brand-accent-red">
        Failed to load users.
      </p>
    </div>
  );
}

function FollowListEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
      <p className="text-[22px] font-bold text-brand-neutral-25">{title}</p>
      <p className="mt-3 max-w-130 text-[15px] leading-7 text-brand-neutral-500">
        {description}
      </p>
    </div>
  );
}

export default function FollowListView({
  users,
  queryKey,
  isAuthenticated,
  isLoading,
  isError,
  emptyTitle,
  emptyDescription,
}: FollowListViewProps) {
  const queryClient = useQueryClient();

  const stableUsers = useMemo(() => users ?? [], [users]);

  const handleOptimisticFollow = (username: string, nextValue: boolean) => {
    queryClient.setQueryData<FollowListResponseData | undefined>(
      queryKey,
      (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.map((item) =>
            item.username === username
              ? { ...item, isFollowedByMe: nextValue }
              : item,
          ),
        };
      },
    );
  };

  if (isLoading) {
    return <FollowListLoadingState />;
  }

  if (isError) {
    return <FollowListErrorState />;
  }

  if (stableUsers.length === 0) {
    return (
      <FollowListEmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="space-y-3">
      {stableUsers.map((user) => (
        <UserListItem
          key={String(user.id)}
          user={user}
          isAuthenticated={isAuthenticated}
          onFollowChange={handleOptimisticFollow}
        />
      ))}
    </div>
  );
}
