"use client";

import { Eye } from "lucide-react";

type CreatePostCaptionFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function CreatePostCaptionField({
  value,
  error,
  onChange,
}: CreatePostCaptionFieldProps) {
  return (
    <div>
      <div
        className={[
          "rounded-4xl border bg-[rgba(4,10,22,0.92)] transition-all duration-200",
          error
            ? "border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.4)]"
            : "border-brand-neutral-800",
        ].join(" ")}
      >
        <div className="relative">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            placeholder="Create your caption"
            className="min-h-24.5 w-full resize-none bg-transparent px-4 py-4 pr-12 text-[16px] leading-8 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500 md:min-h-24"
          />
          {error ? (
            <Eye className="pointer-events-none absolute right-4 top-4 h-5 w-5 text-brand-neutral-200" />
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-3 text-[14px] text-pink-500">{error}</p> : null}
    </div>
  );
}
