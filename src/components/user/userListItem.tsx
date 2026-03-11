"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/services/users/follow.api";
import type { SearchUserItem } from "@/types/user";

type UserListItemProps = {
  user: SearchUserItem;
  isAuthenticated: boolean;
  onFollowChange?: (username: string, nextValue: boolean) => void;
};

export default function UserListItem({
  user,
  isAuthenticated,
  onFollowChange,
}: UserListItemProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (nextFollowing: boolean) => {
      if (nextFollowing) {
        return followUser(user.username);
      }
      return unfollowUser(user.username);
    },

    onMutate: (nextFollowing) => {
      onFollowChange?.(user.username, nextFollowing);
      return { previous: user.isFollowedByMe ?? false };
    },

    onError: (_error, _variables, context) => {
      onFollowChange?.(user.username, context?.previous ?? false);
    },
  });

  const handleFollowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    mutation.mutate(!(user.isFollowedByMe ?? false));
  };

  return (
    <Link
      href={`/profile/${user.username}`}
      className="flex cursor-pointer items-center gap-3 rounded-[24px] border border-brand-neutral-900 bg-brand-neutral-950/30 px-4 py-3 transition-all duration-200 hover:border-brand-neutral-800 hover:bg-brand-neutral-950/70"
    >
      <div className="h-13 w-13 shrink-0 overflow-hidden rounded-full bg-brand-neutral-900">
        <img
          src={user.avatarUrl || "/images/default-avatar.svg"}
          alt={user.name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.src = "/images/default-avatar.svg";
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-bold text-brand-neutral-25">
          {user.name}
        </p>
        <p className="truncate text-[14px] font-medium text-brand-neutral-500">
          @{user.username}
        </p>
      </div>
      <button
        type="button"
        onClick={handleFollowClick}
        disabled={mutation.isPending}
        className={[
          "h-10 min-w-24 cursor-pointer rounded-full px-4 text-[14px] font-bold transition-all duration-200 active:scale-[0.98]",
          user.isFollowedByMe
            ? "border border-brand-neutral-800 bg-transparent text-brand-neutral-25 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_16px_rgba(127,81,249,0.18)]"
            : "bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] hover:brightness-110 hover:shadow-[0_0_18px_rgba(127,81,249,0.42)]",
        ].join(" ")}
      >
        {mutation.isPending
          ? "..."
          : user.isFollowedByMe
            ? "Following"
            : "Follow"}
      </button>
    </Link>
  );
}
