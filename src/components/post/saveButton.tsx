"use client";

import { Bookmark } from "lucide-react";

type SaveButtonProps = {
  saved: boolean;
  onClick: () => void;
};

export default function SaveButton({ saved, onClick }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-brand-neutral-25 transition-all duration-200 hover:bg-brand-neutral-900"
    >
      <Bookmark
        className={[
          "h-5 w-5 transition-all duration-200",
          saved ? "fill-brand-primary-200 text-brand-primary-200" : "",
        ].join(" ")}
      />
      <span className="text-[14px] font-medium">
        {saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
