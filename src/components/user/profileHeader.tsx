"use client";

import type { ReactNode } from "react";
import ProfileStats from "./profileStats";
import type { ProfileStats as ProfileStatsType } from "@/types/profile";

type ProfileHeaderProps = {
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  stats: ProfileStatsType;
  actionSlot?: ReactNode;
  followersHref?: string;
  followingHref?: string;
};

export default function ProfileHeader({
  name,
  username,
  bio,
  avatarUrl,
  stats,
  actionSlot,
  followersHref,
  followingHref,
}: ProfileHeaderProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-6 md:gap-5">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="h-18 w-18 shrink-0 overflow-hidden rounded-full bg-brand-neutral-900 md:h-20 md:w-20">
            <img
              src={avatarUrl || "/images/default-avatar.svg"}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="md:flex md:items-start md:justify-between md:gap-6">
              <div className="min-w-0">
                <h1 className="truncate text-[24px] font-bold leading-none text-brand-neutral-25 md:text-[28px]">
                  {name}
                </h1>
                <p className="mt-3 truncate text-[18px] font-medium leading-none text-brand-neutral-200 md:text-[20px]">
                  {username}
                </p>
              </div>
              {actionSlot ? (
                <div className="mt-5 md:mt-0 md:shrink-0">{actionSlot}</div>
              ) : null}
            </div>
            <p className="mt-7 max-w-195 text-[15px] leading-8 text-brand-neutral-25 md:mt-6 md:text-[16px]">
              {bio?.trim() ? bio : "No bio yet."}
            </p>
          </div>
        </div>
        <ProfileStats
          stats={stats}
          followersHref={followersHref}
          followingHref={followingHref}
        />
      </div>
    </section>
  );
}
