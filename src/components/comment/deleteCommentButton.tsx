"use client";

import { Trash2 } from "lucide-react";

type DeleteCommentButtonProps = {
  onClick: () => void;
};

export default function DeleteCommentButton({
  onClick,
}: DeleteCommentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-brand-neutral-400 transition-all duration-200 hover:bg-brand-neutral-900 hover:text-brand-accent-red"
      aria-label="Delete comment"
    >
      <Trash2 className="h-4.5 w-4.5" />
    </button>
  );
}
