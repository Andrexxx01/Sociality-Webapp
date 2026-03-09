"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { LikeUserItem } from "@/types/user";
import { followUser, unfollowUser } from "@/services/users/follow.api";
import { getPostLikes } from "@/services/posts/like.api";

type LikesModalProps = {
  open: boolean;
  onClose: () => void;
  postId: string;
  isAuthenticated: boolean;
};

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <img
      src={src && src.trim() ? src : "/images/default-avatar.svg"}
      alt={alt}
      className="h-full w-full object-cover"
      onError={(event) => {
        event.currentTarget.src = "/images/default-avatar.svg";
      }}
    />
  );
}

function FollowActionButton({
  isFollowing,
  onToggle,
  isPending,
}: {
  isFollowing: boolean;
  onToggle: () => void;
  isPending: boolean;
}) {
  if (isFollowing) {
    return (
      <Button
        type="button"
        onClick={onToggle}
        disabled={isPending}
        className="h-10 cursor-pointer rounded-full border border-brand-neutral-700 bg-transparent px-5 text-sm font-bold text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:bg-brand-neutral-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" strokeWidth={2.4} />
          Following
        </span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      className="h-10 cursor-pointer rounded-full border-0 bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-6 text-sm font-bold text-brand-neutral-25 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_18px_rgba(127,81,249,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      Follow
    </Button>
  );
}

export default function LikesModal({
  open,
  onClose,
  postId,
  isAuthenticated,
}: LikesModalProps) {
  const router = useRouter();
  const [localUsers, setLocalUsers] = useState<LikeUserItem[]>([]);

  const likesQuery = useQuery({
    queryKey: ["post-likes", postId],
    queryFn: () => getPostLikes(postId, 1, 50),
    enabled: open,
  });

  useEffect(() => {
    if (!likesQuery.data) return;

    const mappedUsers: LikeUserItem[] = likesQuery.data.data.users.map(
      (item) => ({
        id: String(item.id),
        username: item.username,
        name: item.name,
        avatarUrl: item.avatarUrl,
        isFollowedByMe: item.isFollowedByMe,
        isMe: item.isMe,
        followsMe: item.followsMe,
      }),
    );

    setLocalUsers(mappedUsers);
  }, [likesQuery.data]);

  useEffect(() => {
    if (!open) return;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  const followMutation = useMutation({
    mutationFn: async ({
      username,
      shouldFollow,
    }: {
      username: string;
      shouldFollow: boolean;
    }) => {
      if (shouldFollow) {
        return followUser(username);
      }
      return unfollowUser(username);
    },
  });

  const visibleUsers = useMemo(() => localUsers, [localUsers]);

  const handleToggleFollow = (userId: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const targetUser = localUsers.find((item) => item.id === userId);
    if (!targetUser || targetUser.isMe) return;

    const nextState = !Boolean(targetUser.isFollowedByMe);

    setLocalUsers((prev) =>
      prev.map((item) =>
        item.id === userId
          ? {
              ...item,
              isFollowedByMe: nextState,
            }
          : item,
      ),
    );

    followMutation.mutate(
      {
        username: targetUser.username,
        shouldFollow: nextState,
      },
      {
        onSuccess: () => {
          toast.success(
            nextState
              ? "User followed successfully"
              : "User unfollowed successfully",
          );
        },
        onError: () => {
          setLocalUsers((prev) =>
            prev.map((item) =>
              item.id === userId
                ? {
                    ...item,
                    isFollowedByMe: !nextState,
                  }
                : item,
            ),
          );
          toast.error("Follow action failed");
        },
      },
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70">
      <button
        type="button"
        aria-label="Close likes modal"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-[2px]"
      />
      <div className="absolute inset-x-0 bottom-0 top-auto md:inset-0 md:grid md:place-items-center">
        <div className="relative w-full md:w-155">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 -top-11.5 z-72 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-brand-neutral-900/70 md:right-0 md:-top-12"
          >
            <Image
              src="/images/Close Button.svg"
              alt="Close"
              width={18}
              height={18}
              className="h-4.5 w-4.5"
            />
          </button>

          <div className="rounded-t-[28px] border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] md:rounded-[28px]">
            <div className="border-b border-brand-neutral-900 px-5 py-4 md:px-6 md:py-5">
              <h2 className="text-[22px] font-bold text-brand-neutral-25 md:text-display-sm">
                Likes
              </h2>
            </div>

            <div className="max-h-[72vh] overflow-y-auto scrollbar-hidden px-3 py-3 md:max-h-140 md:px-4 md:py-4">
              {likesQuery.isLoading ? (
                <div className="px-3 py-6 text-center text-sm font-medium text-brand-neutral-500">
                  Loading likes...
                </div>
              ) : likesQuery.isError ? (
                <div className="px-3 py-6 text-center text-sm font-medium text-brand-accent-red">
                  Failed to load likes.
                </div>
              ) : visibleUsers.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm font-medium text-brand-neutral-500">
                  No likes yet.
                </div>
              ) : (
                visibleUsers.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-3xl px-3 py-3 transition-colors duration-200 hover:bg-brand-neutral-900/60"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full bg-brand-neutral-900">
                        <Avatar src={item.avatarUrl} alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-brand-neutral-25">
                          {item.name}
                        </p>
                        <p className="truncate text-sm font-medium text-brand-neutral-500">
                          @{item.username}
                        </p>
                      </div>
                    </div>

                    {!item.isMe ? (
                      <FollowActionButton
                        isFollowing={Boolean(item.isFollowedByMe)}
                        onToggle={() => handleToggleFollow(item.id)}
                        isPending={
                          followMutation.isPending &&
                          followMutation.variables?.username === item.username
                        }
                      />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
