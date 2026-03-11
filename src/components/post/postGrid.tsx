"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { GridPostItem } from "@/types/profile";

type PostGridProps = {
  items: GridPostItem[];
  emptyTitle: string;
  emptyDescription: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

export default function PostGrid({
  items,
  emptyTitle,
  emptyDescription,
  ctaLabel,
  onCtaClick,
}: PostGridProps) {
  if (!items.length) {
    return (
      <div className="flex min-h-90 flex-col items-center justify-center px-6 pb-28 pt-18 text-center md:min-h-105 md:pb-36">
        <h3 className="text-[18px] font-bold text-brand-neutral-25 md:text-[20px]">
          {emptyTitle}
        </h3>
        <p className="mt-3 max-w-145 text-[15px] leading-8 text-brand-neutral-500 md:text-[16px]">
          {emptyDescription}
        </p>

        {ctaLabel && onCtaClick ? (
          <Button
            type="button"
            onClick={onCtaClick}
            className="mt-8 h-13 min-w-62.5 cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-8 text-[16px] font-bold text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] transition-all duration-200 hover:scale-[1.01] hover:brightness-110 hover:shadow-[0_0_26px_rgba(127,81,249,0.42)] active:scale-[0.98]"
          >
            {ctaLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-90 pb-28 pt-6 md:max-w-245 md:pb-36 md:pt-8">
      <div className="grid grid-cols-3 gap-0.5 md:gap-0.75">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/posts/${item.id}`}
            className="group block aspect-square cursor-pointer overflow-hidden rounded-xxs bg-brand-neutral-900"
          >
            <img
              src={item.imageUrl}
              alt={item.caption || "Post image"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.045]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
