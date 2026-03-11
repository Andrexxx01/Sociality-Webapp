"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import type { TimelinePost } from "@/types/post";

dayjs.extend(relativeTime);

type PostDetailHeaderProps = {
  post: TimelinePost;
};

export default function PostDetailHeader({ post }: PostDetailHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <Link
        href={`/profile/${post.author.username}`}
        className="block cursor-pointer"
      >
        <div className="h-11 w-11 overflow-hidden rounded-full bg-brand-neutral-900">
          <img
            src={post.author.avatarUrl || "/images/default-avatar.svg"}
            alt={post.author.name}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/images/default-avatar.svg";
            }}
          />
        </div>
      </Link>
      <div className="min-w-0">
        <Link
          href={`/profile/${post.author.username}`}
          className="cursor-pointer"
        >
          <p className="truncate text-[16px] font-bold text-brand-neutral-25">
            {post.author.name}
          </p>
        </Link>
        <p className="mt-1 text-[14px] text-brand-neutral-500">
          @{post.author.username} • {dayjs(post.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}
