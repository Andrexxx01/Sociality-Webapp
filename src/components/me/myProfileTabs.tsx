"use client";

import Image from "next/image";

export type ProfileTabKey = "gallery" | "saved" | "liked";

type MyProfileTabsProps = {
  activeTab: ProfileTabKey;
  secondaryTabLabel: "Saved" | "Liked";
  onChange: (tab: ProfileTabKey) => void;
};

function TabButton({
  active,
  label,
  iconSrc,
  onClick,
}: {
  active: boolean;
  label: string;
  iconSrc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-1 cursor-pointer items-center justify-center gap-3 pb-5 pt-5 transition-opacity hover:opacity-95"
    >
      <Image src={iconSrc} alt="" width={20} height={20} className="h-5 w-5" />
      <span
        className={[
          "text-[16px] font-semibold transition-colors duration-200 md:text-[17px]",
          active ? "text-brand-neutral-25" : "text-brand-neutral-500",
        ].join(" ")}
      >
        {label}
      </span>
      <span
        className={[
          "absolute inset-x-0 bottom-0 h-0.5 transition-all duration-200",
          active ? "bg-brand-neutral-25" : "bg-transparent",
        ].join(" ")}
      />
    </button>
  );
}

export default function MyProfileTabs({
  activeTab,
  secondaryTabLabel,
  onChange,
}: MyProfileTabsProps) {
  const secondaryTabKey = secondaryTabLabel.toLowerCase() as "saved" | "liked";

  return (
    <div className="mt-7 border-b border-brand-neutral-900">
      <div className="mx-auto flex w-full max-w-245">
        <TabButton
          active={activeTab === "gallery"}
          label="Gallery"
          iconSrc="/images/Grid.svg"
          onClick={() => onChange("gallery")}
        />
        <TabButton
          active={activeTab === secondaryTabKey}
          label={secondaryTabLabel}
          iconSrc={
            secondaryTabLabel === "Saved"
              ? "/images/Save.svg"
              : "/images/liked icon.svg"
          }
          onClick={() => onChange(secondaryTabKey)}
        />
      </div>
    </div>
  );
}
