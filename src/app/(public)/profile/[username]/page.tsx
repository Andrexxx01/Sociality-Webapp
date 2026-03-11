"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FloatingNav from "@/components/layout/floatingNav";
import Header from "@/components/layout/header";
import MyProfileTabs, {
  type ProfileTabKey,
} from "@/components/me/myProfileTabs";
import PostGrid from "@/components/post/postGrid";
import FollowButton from "@/components/user/followButton";
import ProfileHeader from "@/components/user/profileHeader";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  usePublicProfileQuery,
  useUserLikedPostsQuery,
  useUserPostsQuery,
} from "@/services/users/users.query";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const authUser = useAppSelector((state) => state.auth.user);
  const username = params?.username ?? "";
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("gallery");
  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  const [optimisticFollowersCount, setOptimisticFollowersCount] = useState<
    number | null
  >(null);
  const profileQuery = usePublicProfileQuery(username, Boolean(username));
  const postsQuery = useUserPostsQuery(username, 1, 50, Boolean(username));
  const likedPostsQuery = useUserLikedPostsQuery(
    username,
    1,
    50,
    Boolean(username),
  );

  useEffect(() => {
    if (profileQuery.data?.isMe) {
      router.replace("/me");
    }
  }, [profileQuery.data?.isMe, router]);

  const profile = profileQuery.data;
  const isFollowing = optimisticFollowing ?? profile?.isFollowing ?? false;

  const followersCount =
    optimisticFollowersCount ?? profile?.counts.followers ?? 0;

  const stats = profile
    ? {
        posts: profile.counts.post,
        followers: followersCount,
        following: profile.counts.following,
        likes: profile.counts.likes,
      }
    : {
        posts: 0,
        followers: 0,
        following: 0,
        likes: 0,
      };

  const galleryItems = useMemo(
    () =>
      postsQuery.data?.posts.map((post) => ({
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
      })) ?? [],
    [postsQuery.data],
  );

  const likedItems = useMemo(
    () =>
      likedPostsQuery.data?.posts.map((post) => ({
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
      })) ?? [],
    [likedPostsQuery.data],
  );

  const pageTitle = profile?.name || username || "Profile";

  const isLoading =
    profileQuery.isLoading || postsQuery.isLoading || likedPostsQuery.isLoading;

  const isError =
    profileQuery.isError || postsQuery.isError || likedPostsQuery.isError;

  return (
    <main className="min-h-screen bg-black text-brand-neutral-25">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="fixed inset-x-0 top-0 z-40 h-18 border-b border-brand-neutral-900 bg-black/95 backdrop-blur-md md:hidden">
        <div className="flex h-full items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-2 text-brand-neutral-25 transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-[20px] font-bold">{pageTitle}</span>
          </button>
          <div className="h-11 w-11 overflow-hidden rounded-full bg-brand-neutral-900">
            <img
              src={authUser?.avatarUrl || "/images/default-avatar.svg"}
              alt={authUser?.name || "Viewer"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <section className="px-3 pb-32 pt-24 md:px-10 md:pb-38 md:pt-30">
        <div className="mx-auto w-full max-w-245">
          {profile ? (
            <>
              <ProfileHeader
                name={profile.name}
                username={profile.username}
                bio={profile.bio}
                avatarUrl={profile.avatarUrl}
                stats={stats}
                followersHref={`/profile/${profile.username}/followers`}
                followingHref={`/profile/${profile.username}/following`}
                actionSlot={
                  <FollowButton
                    username={profile.username}
                    isFollowing={isFollowing}
                    onFollowingChange={(nextFollowing) => {
                      setOptimisticFollowing(nextFollowing);
                      setOptimisticFollowersCount(
                        (profile.counts.followers ?? 0) +
                          (nextFollowing ? 1 : -1),
                      );
                    }}
                  />
                }
              />
              <MyProfileTabs
                activeTab={activeTab}
                secondaryTabLabel="Liked"
                onChange={setActiveTab}
              />
              {isLoading ? (
                <div className="flex min-h-90 items-center justify-center">
                  <p className="text-[16px] text-brand-neutral-500">
                    Loading profile...
                  </p>
                </div>
              ) : isError ? (
                <div className="flex min-h-90 flex-col items-center justify-center text-center">
                  <p className="text-[18px] font-bold">
                    Failed to load profile
                  </p>
                  <p className="mt-2 text-brand-neutral-500">
                    Please refresh the page and try again.
                  </p>
                </div>
              ) : activeTab === "gallery" ? (
                <PostGrid
                  items={galleryItems}
                  emptyTitle="No posts yet"
                  emptyDescription="This user has not shared any posts yet."
                />
              ) : (
                <PostGrid
                  items={likedItems}
                  emptyTitle="No liked posts yet"
                  emptyDescription="Posts liked by this user will appear here."
                />
              )}
            </>
          ) : isLoading ? (
            <div className="flex min-h-90 items-center justify-center">
              <p className="text-[16px] text-brand-neutral-500">
                Loading profile...
              </p>
            </div>
          ) : (
            <div className="flex min-h-90 flex-col items-center justify-center text-center">
              <p className="text-[18px] font-bold">Profile not found</p>
              <p className="mt-2 text-brand-neutral-500">
                The username you requested does not exist.
              </p>
            </div>
          )}
        </div>
      </section>
      <FloatingNav
        isAuthenticated={Boolean(authUser)}
        activeKey="profile"
        onHomeClick={() => router.push("/feed")}
      />
    </main>
  );
}
