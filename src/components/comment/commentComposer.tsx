"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CommentComposerProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (text: string) => Promise<void> | void;
};

export default function CommentComposer({
  disabled = false,
  isSubmitting = false,
  onSubmit,
}: CommentComposerProps) {
  const [text, setText] = useState("");

  const canSubmit = text.trim().length > 0 && !disabled && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const value = text.trim();
    await onSubmit(value);
    setText("");
  };

  return (
    <div className="border-t border-brand-neutral-900 pt-4">
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write your comment..."
          rows={2}
          className="min-h-23 flex-1 resize-none rounded-[24px] border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 py-3 text-[15px] text-brand-neutral-25 outline-none transition-all duration-200 placeholder:text-brand-neutral-500 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-11 cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-6 text-brand-neutral-25 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(127,81,249,0.42)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
