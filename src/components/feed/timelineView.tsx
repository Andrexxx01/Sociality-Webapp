"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Header from "@/components/layout/header";
import FloatingNav from "@/components/layout/floatingNav";
import TimelineTabs, {
  type TimelineTabKey,
} from "@/components/feed/timelineTabs";
import PostCard from "@/components/feed/postCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { MOCK_TIMELINE_POSTS } from "@/mock/mockPosts";
import { House } from "lucide-react";

const PAGE_SIZE = 4;

function FeedEmptyState() {
  return (
    <div className="flex min-h-[58vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[rgba(4,10,22,0.92)]">
        <House className="h-12 w-12 text-brand-neutral-400" strokeWidth={1.8} />
      </div>
      <p className="mt-8 text-[20px] font-medium leading-9 text-brand-neutral-400 md:text-[22px]">
        No posts yet. Follow someone or create your first post ✨
      </p>
    </div>
  );
}

export default function TimelineView() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);
  const [activeTab, setActiveTab] = useState<TimelineTabKey>("feed");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const feedPosts = useMemo(() => {
    return isAuthenticated ? MOCK_TIMELINE_POSTS : [];
  }, [isAuthenticated]);

  const explorePosts = useMemo(() => MOCK_TIMELINE_POSTS, []);
  const activePosts = activeTab === "feed" ? feedPosts : explorePosts;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (!activePosts.length) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, activePosts.length),
          );
        }
      },
      {
        rootMargin: "240px",
      },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activePosts.length]);

  const visiblePosts = activePosts.slice(0, visibleCount);

  return (
    <main className="min-h-dvh bg-black text-brand-neutral-25">
      <Header />
      <section className="mx-auto w-full max-w-432 px-4 pb-36 pt-23 md:px-8 md:pt-24">
        <TimelineTabs activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "feed" && !isAuthenticated ? (
          <FeedEmptyState />
        ) : (
          <div className="mx-auto max-w-245 divide-y divide-brand-neutral-900">
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAuthenticated={isAuthenticated}
              />
            ))}
            {visiblePosts.length < activePosts.length ? (
              <div ref={sentinelRef} className="h-8 w-full" />
            ) : null}
          </div>
        )}
      </section>
      <FloatingNav
        isAuthenticated={isAuthenticated}
        activeKey="home"
        onHomeClick={() => setActiveTab("feed")}
      />
    </main>
  );
}
