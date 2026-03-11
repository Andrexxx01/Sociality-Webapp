"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/services/users/follow.api";
import { useAppSelector } from "@/hooks/useAppSelector";

type FollowButtonProps = {
  username: string;
  isFollowing: boolean;
  onFollowingChange?: (nextFollowing: boolean) => void;
};

export default function FollowButton({
  username,
  isFollowing,
  onFollowingChange,
}: FollowButtonProps) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const mutation = useMutation({
    mutationFn: async (nextFollowing: boolean) => {
      if (nextFollowing) {
        return followUser(username);
      }
      return unfollowUser(username);
    },

    onMutate: (nextFollowing) => {
      const previousFollowing = following;
      setFollowing(nextFollowing);
      onFollowingChange?.(nextFollowing);
      return { previousFollowing };
    },

    onError: (_error, _variables, context) => {
      const rollbackValue = context?.previousFollowing ?? false;
      setFollowing(rollbackValue);
      onFollowingChange?.(rollbackValue);
      toast.error("Follow action failed");
    },

    onSuccess: () => {
      toast.success(
        following ? "Followed successfully" : "Unfollowed successfully",
      );
    },
  });

  const handleClick = () => {
    if (!authUser) {
      router.push("/login");
      return;
    }
    mutation.mutate(!following);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={mutation.isPending}
      className={[
        "h-12 min-w-42.5 cursor-pointer rounded-full px-7 text-[16px] font-bold transition-all duration-200 active:scale-[0.98]",
        following
          ? "border border-brand-neutral-800 bg-transparent text-brand-neutral-25 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_22px_rgba(127,81,249,0.18)]"
          : "bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] hover:brightness-110 hover:shadow-[0_0_26px_rgba(127,81,249,0.42)]",
      ].join(" ")}
    >
      {mutation.isPending
        ? following
          ? "Following..."
          : "Unfollowing..."
        : following
          ? "Following"
          : "Follow"}
    </Button>
  );
}
