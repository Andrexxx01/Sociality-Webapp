"use client";

import type { TimelineComment } from "@/types/comment";
import CommentItem from "./commentItem";

type CommentListProps = {
  comments: TimelineComment[];
  currentUserId?: string | null;
  onDeleteComment?: (commentId: string) => void;
};

export default function CommentList({
  comments,
  currentUserId,
  onDeleteComment,
}: CommentListProps) {
  if (!comments.length) {
    return (
      <div className="flex min-h-55 flex-col items-center justify-center text-center">
        <p className="text-[18px] font-bold text-brand-neutral-25">
          No comments yet
        </p>
        <p className="mt-3 text-[15px] text-brand-neutral-500">
          Start the conversation on this post.
        </p>
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => {
        const isMine = String(currentUserId) === String(comment.author.id);

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            isMine={isMine}
            onDelete={
              isMine && onDeleteComment
                ? () => onDeleteComment(String(comment.id))
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
