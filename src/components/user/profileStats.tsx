import Link from "next/link";
import type { ProfileStats } from "@/types/profile";

type ProfileStatsProps = {
  stats: ProfileStats;
  followersHref?: string;
  followingHref?: string;
};

function StatCell({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="flex min-w-0 flex-col items-center justify-center px-3 text-center">
      <span className="text-[18px] font-bold text-brand-neutral-25 md:text-[20px]">
        {value}
      </span>
      <span className="mt-1 text-[14px] font-medium text-brand-neutral-500 md:text-[15px]">
        {label}
      </span>
    </div>
  );

  if (!href) {
    return <div className="flex-1">{content}</div>;
  }

  return (
    <Link
      href={href}
      className="flex-1 cursor-pointer transition-opacity hover:opacity-90"
    >
      {content}
    </Link>
  );
}

export default function ProfileStats({
  stats,
  followersHref,
  followingHref,
}: ProfileStatsProps) {
  return (
    <div className="mt-8 grid grid-cols-4 items-stretch rounded-none border-t border-brand-neutral-950 pt-6 md:mt-7 md:pt-5">
      <StatCell value={stats.posts} label="Post" />
      <div className="flex min-h-13 items-center border-l border-brand-neutral-900">
        <StatCell
          value={stats.followers}
          label="Followers"
          href={followersHref}
        />
      </div>
      <div className="flex min-h-13 items-center border-l border-brand-neutral-900">
        <StatCell
          value={stats.following}
          label="Following"
          href={followingHref}
        />
      </div>
      <div className="flex min-h-13 items-center border-l border-brand-neutral-900">
        <StatCell value={stats.likes} label="Likes" />
      </div>
    </div>
  );
}
