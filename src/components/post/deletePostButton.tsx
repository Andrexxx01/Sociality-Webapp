"use client";

import { Trash2 } from "lucide-react";

type DeletePostButtonProps = {
  onClick: () => void;
};

export default function DeletePostButton({ onClick }: DeletePostButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-neutral-800 text-brand-neutral-25 transition-all duration-200 hover:border-brand-accent-red hover:bg-brand-neutral-950 hover:text-brand-accent-red"
      aria-label="Delete post"
    >
      <Trash2 className="h-4.5 w-4.5" />
    </button>
  );
}
