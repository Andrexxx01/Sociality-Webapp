"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FloatingNav from "@/components/layout/floatingNav";
import Header from "@/components/layout/header";
import MyProfileTabs, {
  type ProfileTabKey,
} from "@/components/me/myProfileTabs";
import PostGrid from "@/components/post/postGrid";
import ProfileHeader from "@/components/user/profileHeader";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useMyPostsQuery, useMyProfileQuery } from "@/services/me/me.query";
import { useSavedPostsQuery } from "@/services/posts/saved.query";

export default function MyProfilePage() {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("gallery");
  const profileQuery = useMyProfileQuery();
  const myPostsQuery = useMyPostsQuery(1, 50);
  const savedPostsQuery = useSavedPostsQuery(Boolean(authUser));

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  const pageTitle =
    profileQuery.data?.profile.name ||
    authUser?.name ||
    authUser?.username ||
    "Profile";

  const galleryItems = useMemo(
    () =>
      myPostsQuery.data?.items.map((post) => ({
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
      })) ?? [],
    [myPostsQuery.data],
  );

  const savedItems = useMemo(
    () =>
      savedPostsQuery.data?.map((post) => ({
        id: post.id,
        imageUrl: post.imageUrl,
        caption: post.caption,
      })) ?? [],
    [savedPostsQuery.data],
  );

  if (!authUser) return null;

  const isLoading =
    profileQuery.isLoading ||
    myPostsQuery.isLoading ||
    savedPostsQuery.isLoading;

  const isError =
    profileQuery.isError || myPostsQuery.isError || savedPostsQuery.isError;

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
              src={
                profileQuery.data?.profile.avatarUrl ||
                authUser.avatarUrl ||
                "/images/default-avatar.svg"
              }
              alt={pageTitle}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <section className="px-3 pb-32 pt-24 md:px-10 md:pb-38 md:pt-30">
        <div className="mx-auto w-full max-w-245">
          {profileQuery.data?.profile ? (
            <>
              <ProfileHeader
                name={profileQuery.data.profile.name}
                username={profileQuery.data.profile.username}
                bio={profileQuery.data.profile.bio}
                avatarUrl={profileQuery.data.profile.avatarUrl}
                stats={profileQuery.data.stats}
                followersHref="/me/followers"
                followingHref="/me/following"
                actionSlot={
                  <Button
                    type="button"
                    onClick={() => router.push("/me/edit")}
                    className="h-12 w-full cursor-pointer rounded-full border border-brand-neutral-800 bg-transparent px-8 text-[16px] font-bold text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_22px_rgba(127,81,249,0.2)] md:min-w-46"
                  >
                    Edit Profile
                  </Button>
                }
              />
              <MyProfileTabs
                activeTab={activeTab}
                secondaryTabLabel="Saved"
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
                  emptyTitle="Your story starts here"
                  emptyDescription="Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."
                  ctaLabel="Upload My First Post"
                  onCtaClick={() => router.push("/create-post")}
                />
              ) : (
                <PostGrid
                  items={savedItems}
                  emptyTitle="No saved posts yet"
                  emptyDescription="Posts you bookmark will appear here so you can revisit them anytime."
                />
              )}
            </>
          ) : (
            <div className="flex min-h-90 items-center justify-center">
              <p className="text-[16px] text-brand-neutral-500">
                Loading profile...
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
