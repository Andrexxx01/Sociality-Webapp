"use client";

import Image from "next/image";

export type TimelineTabKey = "feed" | "explore";

type TimelineTabsProps = {
  activeTab: TimelineTabKey;
  onChange: (tab: TimelineTabKey) => void;
};

function TabButton({
  isActive,
  iconSrc,
  label,
  onClick,
}: {
  isActive: boolean;
  iconSrc: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex cursor-pointer items-center gap-3 rounded-full px-7 py-4 text-[18px] font-bold transition-all duration-200 md:px-8",
        isActive
          ? "bg-[linear-gradient(90deg,rgba(72,15,255,0.32)_0%,rgba(127,81,249,0.22)_100%)] text-brand-neutral-25"
          : "text-brand-neutral-400 hover:text-brand-neutral-25",
      ].join(" ")}
    >
      <Image
        src={iconSrc}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 invert"
      />
      <span>{label}</span>
    </button>
  );
}

export default function TimelineTabs({
  activeTab,
  onChange,
}: TimelineTabsProps) {
  return (
    <div className="mx-auto flex h-18.5 w-full max-w-432 items-center justify-center px-4">
      <div className="flex items-center gap-5">
        <TabButton
          isActive={activeTab === "feed"}
          iconSrc="/images/house.svg"
          label="Feed"
          onClick={() => onChange("feed")}
        />
        <div className="h-10 w-px bg-brand-neutral-800" />
        <TabButton
          isActive={activeTab === "explore"}
          iconSrc="/images/compass.svg"
          label="Explore"
          onClick={() => onChange("explore")}
        />
      </div>
    </div>
  );
}
