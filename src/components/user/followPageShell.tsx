"use client";

import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/header";
import FloatingNav from "@/components/layout/floatingNav";

type FollowPageShellProps = {
  title: string;
  isAuthenticated: boolean;
  onBack: () => void;
  children: React.ReactNode;
};

export default function FollowPageShell({
  title,
  isAuthenticated,
  onBack,
  children,
}: FollowPageShellProps) {
  return (
    <main className="min-h-screen bg-black text-brand-neutral-25">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="fixed inset-x-0 top-0 z-40 h-18 border-b border-brand-neutral-900 bg-black/95 backdrop-blur-md md:hidden">
        <div className="flex h-full items-center px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-2 text-brand-neutral-25 transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-[20px] font-bold">{title}</span>
          </button>
        </div>
      </div>
      <section className="px-4 pb-32 pt-24 md:px-10 md:pb-38 md:pt-30">
        <div className="mx-auto w-full max-w-230">
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-brand-neutral-25 transition-colors hover:bg-brand-neutral-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-[30px] font-bold leading-none text-brand-neutral-25">
              {title}
            </h1>
          </div>
          <div className="mt-6 md:mt-8">{children}</div>
        </div>
      </section>
      <FloatingNav isAuthenticated={isAuthenticated} activeKey="profile" />
    </main>
  );
}
