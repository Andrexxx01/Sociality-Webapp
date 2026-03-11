"use client";

import { Heart } from "lucide-react";

type LikeButtonProps = {
  liked: boolean;
  count: number;
  onClick: () => void;
};

export default function LikeButton({ liked, count, onClick }: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-brand-neutral-25 transition-all duration-200 hover:bg-brand-neutral-900"
    >
      <Heart
        className={[
          "h-5 w-5 transition-all duration-200",
          liked ? "fill-brand-accent-red text-brand-accent-red" : "",
        ].join(" ")}
      />
      <span className="text-[14px] font-medium">{count}</span>
    </button>
  );
}
