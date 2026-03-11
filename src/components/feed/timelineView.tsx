"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Header from "@/components/layout/header";
import FloatingNav from "@/components/layout/floatingNav";
import TimelineTabs, {
  type TimelineTabKey,
} from "@/components/feed/timelineTabs";
import PostCard from "@/components/feed/postCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { House } from "lucide-react";
import { useExplorePostsQuery } from "@/services/posts/posts.query";
import { useSavedPostsQuery } from "@/services/posts/saved.query";
import { useFeedInfiniteQuery } from "@/services/feed/feed.query";
import type { TimelinePost } from "@/types/post";
import type { PostItem } from "@/services/posts/posts.api";

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

function FeedLoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-[18px] font-medium text-brand-neutral-500">
        Loading feed...
      </p>
    </div>
  );
}

function FeedErrorState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-center">
      <p className="text-[18px] font-medium text-brand-accent-red">
        Failed to load feed posts.
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
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: feedData,
    isLoading: isFeedLoading,
    isError: isFeedError,
    fetchNextPage: fetchNextFeedPage,
    hasNextPage: hasNextFeedPage,
    isFetchingNextPage: isFetchingNextFeedPage,
  } = useFeedInfiniteQuery(10);

  const {
    data: exploreData,
    isLoading: isExploreLoading,
    isError: isExploreError,
    fetchNextPage: fetchNextExplorePage,
    hasNextPage: hasNextExplorePage,
    isFetchingNextPage: isFetchingNextExplorePage,
  } = useExplorePostsQuery();

  const { data: savedData } = useSavedPostsQuery(isAuthenticated);

  const savedIds = useMemo(() => {
    return savedData?.map((p) => String(p.id)) ?? [];
  }, [savedData]);

  const feedPosts = useMemo<TimelinePost[]>(() => {
    if (!isAuthenticated) return [];

    const rawPosts = feedData?.pages.flatMap((page) => page.items ?? []) ?? [];

    return rawPosts.map((post) => ({
      ...post,
      savedByMe: savedIds.includes(String(post.id)),
    }));
  }, [feedData, isAuthenticated, savedIds]);

  const explorePosts = useMemo<TimelinePost[]>(() => {
    const rawPosts: PostItem[] =
      exploreData?.pages.flatMap((page) => page.posts ?? []) ?? [];

    return rawPosts.map((post) =>
      mapExplorePostToTimelinePost({
        ...post,
        savedByMe: savedIds.includes(String(post.id)),
      }),
    );
  }, [exploreData, savedIds]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const shouldObserveFeed =
      activeTab === "feed" &&
      isAuthenticated &&
      Boolean(hasNextFeedPage) &&
      !isFetchingNextFeedPage;

    const shouldObserveExplore =
      activeTab === "explore" &&
      Boolean(hasNextExplorePage) &&
      !isFetchingNextExplorePage;

    if (!shouldObserveFeed && !shouldObserveExplore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;

        if (
          activeTab === "feed" &&
          hasNextFeedPage &&
          !isFetchingNextFeedPage
        ) {
          fetchNextFeedPage();
        }

        if (
          activeTab === "explore" &&
          hasNextExplorePage &&
          !isFetchingNextExplorePage
        ) {
          fetchNextExplorePage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [
    activeTab,
    isAuthenticated,
    fetchNextFeedPage,
    hasNextFeedPage,
    isFetchingNextFeedPage,
    fetchNextExplorePage,
    hasNextExplorePage,
    isFetchingNextExplorePage,
  ]);

  return (
    <main className="min-h-dvh bg-black text-brand-neutral-25">
      <Header />

      <section className="mx-auto w-full max-w-432 px-4 pb-36 pt-23 md:px-8 md:pt-24">
        <TimelineTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "feed" ? (
          !isAuthenticated ? (
            <FeedEmptyState />
          ) : isFeedLoading ? (
            <FeedLoadingState />
          ) : isFeedError ? (
            <FeedErrorState />
          ) : feedPosts.length === 0 ? (
            <FeedEmptyState />
          ) : (
            <div className="mx-auto max-w-245 divide-y divide-brand-neutral-900">
              {feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAuthenticated={isAuthenticated}
                />
              ))}

              {hasNextFeedPage ? (
                <div ref={sentinelRef} className="h-8 w-full" />
              ) : null}

              {isFetchingNextFeedPage ? (
                <div className="py-6 text-center text-[16px] font-medium text-brand-neutral-500">
                  Loading more posts...
                </div>
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

            {hasNextExplorePage ? (
              <div ref={sentinelRef} className="h-8 w-full" />
            ) : null}

            {isFetchingNextExplorePage ? (
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
