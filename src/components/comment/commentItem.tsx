"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { TimelineComment } from "@/types/comment";
import DeleteCommentButton from "./deleteCommentButton";

dayjs.extend(relativeTime);

type CommentItemProps = {
  comment: TimelineComment;
  isMine: boolean;
  onDelete?: () => void;
};

export default function CommentItem({
  comment,
  isMine,
  onDelete,
}: CommentItemProps) {
  return (
    <div className="border-b border-brand-neutral-900 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-brand-neutral-900">
            <img
              src={comment.author.avatarUrl || "/images/default-avatar.svg"}
              alt={comment.author.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "/images/default-avatar.svg";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[15px] font-bold text-brand-neutral-25">
                {comment.author.name}
              </p>
              <span className="text-[13px] text-brand-neutral-500">
                @{comment.author.username}
              </span>
              <span className="text-[13px] text-brand-neutral-500">
                • {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="mt-2 text-[15px] leading-7 text-brand-neutral-25">
              {comment.content}
            </p>
          </div>
        </div>
        {isMine && onDelete ? <DeleteCommentButton onClick={onDelete} /> : null}
      </div>
    </div>
  );
}
