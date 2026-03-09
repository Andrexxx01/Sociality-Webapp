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
import { useExplorePostsQuery } from "@/services/posts/posts.query";
import { useSavedPostsQuery } from "@/services/posts/saved.query";
import type { TimelinePost } from "@/types/post";
import type { PostItem } from "@/services/posts/posts.api";

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

function ExploreLoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-[18px] font-medium text-brand-neutral-500">
        Loading posts...
      </p>
    </div>
  );
}

function ExploreErrorState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-center">
      <p className="text-[18px] font-medium text-brand-accent-red">
        Failed to load explore posts.
      </p>
    </div>
  );
}

function ExploreEmptyState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-center">
      <p className="text-[18px] font-medium text-brand-neutral-500">
        No explore posts available.
      </p>
    </div>
  );
}

function mapExplorePostToTimelinePost(
  post: PostItem & { savedByMe?: boolean },
): TimelinePost {
  return {
    id: String(post.id),
    imageUrl: post.imageUrl,
    caption: post.caption,
    createdAt: post.createdAt,
    author: {
      id: String(post.author.id),
      name: post.author.name,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
    },
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    shareCount: 0,
    likedByMe: post.likedByMe ?? false,
    savedByMe: post.savedByMe ?? false,
  };
}

export default function TimelineView() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);

  const [activeTab, setActiveTab] = useState<TimelineTabKey>("feed");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: exploreData,
    isLoading: isExploreLoading,
    isError: isExploreError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExplorePostsQuery();

  const { data: savedData } = useSavedPostsQuery(isAuthenticated);

  const savedIds = useMemo(() => {
    return savedData?.map((p) => String(p.id)) ?? [];
  }, [savedData]);

  const feedPosts = useMemo(() => {
    return isAuthenticated ? MOCK_TIMELINE_POSTS : [];
  }, [isAuthenticated]);

  const explorePosts = useMemo<TimelinePost[]>(() => {
    const rawPosts: PostItem[] =
      exploreData?.pages.flatMap((page) => page.posts) ?? [];

    return rawPosts.map((post) =>
      mapExplorePostToTimelinePost({
        ...post,
        savedByMe: savedIds.includes(String(post.id)),
      }),
    );
  }, [exploreData, savedIds]);

  const activePosts = activeTab === "feed" ? feedPosts : explorePosts;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (activeTab !== "feed") return;
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
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activePosts.length, activeTab]);

  useEffect(() => {
    if (activeTab !== "explore") return;

    const node = sentinelRef.current;
    if (!node) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeTab, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const visibleFeedPosts = feedPosts.slice(0, visibleCount);

  return (
    <main className="min-h-dvh bg-black text-brand-neutral-25">
      <Header />

      <section className="mx-auto w-full max-w-432 px-4 pb-36 pt-23 md:px-8 md:pt-24">
        <TimelineTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "feed" ? (
          !isAuthenticated ? (
            <FeedEmptyState />
          ) : (
            <div className="mx-auto max-w-245 divide-y divide-brand-neutral-900">
              {visibleFeedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAuthenticated={isAuthenticated}
                />
              ))}

              {visibleFeedPosts.length < feedPosts.length ? (
                <div ref={sentinelRef} className="h-8 w-full" />
              ) : null}
            </div>
          )
        ) : isExploreLoading ? (
          <ExploreLoadingState />
        ) : isExploreError ? (
          <ExploreErrorState />
        ) : explorePosts.length === 0 ? (
          <ExploreEmptyState />
        ) : (
          <div className="mx-auto max-w-245 divide-y divide-brand-neutral-900">
            {explorePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isAuthenticated={isAuthenticated}
              />
            ))}

            {hasNextPage ? (
              <div ref={sentinelRef} className="h-8 w-full" />
            ) : null}

            {isFetchingNextPage ? (
              <div className="py-6 text-center text-[16px] font-medium text-brand-neutral-500">
                Loading more posts...
              </div>
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
