"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef, useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { TimelinePost } from "@/types/post";
import LikesModal from "@/components/feed/likesModal";
import { MOCK_LIKES_USERS } from "@/mock/mockLikes";

dayjs.extend(relativeTime);

type PostCardProps = {
  post: TimelinePost;
  isAuthenticated: boolean;
};

function ActionButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
    >
      {children}
    </Link>
  );
}

export default function PostCard({ post, isAuthenticated }: PostCardProps) {
  const router = useRouter();
  const profileHref = `/profile/${post.author.username}`;
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const lastTapRef = useRef(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.likedByMe));
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);

  useEffect(() => {
    function checkOverflow() {
      const el = captionRef.current;
      if (!el) return;
      setShowMoreVisible(el.scrollHeight > el.clientHeight + 2);
    }
    const frame = requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", checkOverflow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [post.caption]);

  useEffect(() => {
    if (!showHeartBurst) return;
    const timeout = window.setTimeout(() => {
      setShowHeartBurst(false);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [showHeartBurst]);

  const redirectToLogin = () => {
    router.push("/login");
  };

  const triggerHeartBurst = () => {
    setShowHeartBurst(false);
    requestAnimationFrame(() => {
      setShowHeartBurst(true);
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      toast.success("Post unliked successfully");
      return;
    }
    setLiked(true);
    setLikeCount((prev) => prev + 1);
    triggerHeartBurst();
    toast.success("Post liked successfully");
  };

  const handleImageLike = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    if (liked) return;
    setLiked(true);
    setLikeCount((prev) => prev + 1);
    triggerHeartBurst();
    toast.success("Post liked successfully");
  };

  const handleImageClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      handleImageLike();
    }
    lastTapRef.current = now;
  };

  return (
    <>
      <article className="py-5 md:py-7">
        <div className="flex items-start gap-4">
          <ActionButton href={profileHref}>
            <div className="h-14 w-14 overflow-hidden rounded-full bg-brand-neutral-900">
              <img
                src={post.author.avatarUrl || "/images/default-avatar.svg"}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            </div>
          </ActionButton>
          <div>
            <ActionButton href={profileHref}>
              <p className="text-[18px] font-bold text-brand-neutral-25 md:text-[20px]">
                {post.author.name}
              </p>
            </ActionButton>
            <p className="mt-1 text-[15px] font-medium text-brand-neutral-500 md:text-[17px]">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <div
          className="relative mt-4 overflow-hidden rounded-[18px] md:rounded-4xl"
          onClick={handleImageClick}
          onDoubleClick={handleImageLike}
        >
          <Image
            src={post.imageUrl}
            alt={post.caption}
            width={1200}
            height={1200}
            className="h-auto w-full cursor-pointer object-cover"
          />
          <div
            className={[
              "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              showHeartBurst ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            <Image
              src="/images/liked icon.svg"
              alt="Liked"
              width={110}
              height={110}
              className={[
                "h-23 w-23 drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-300 md:h-27.5 md:w-27.5",
                showHeartBurst ? "scale-100" : "scale-50",
              ].join(" ")}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className="flex cursor-pointer items-center justify-center text-brand-neutral-25 transition-opacity hover:opacity-80"
              >
                <Image
                  src={
                    liked ? "/images/liked icon.svg" : "/images/Like Icon.svg"
                  }
                  alt={liked ? "Liked" : "Like"}
                  width={26}
                  height={26}
                  className="block h-6.5 w-6.5 shrink-0"
                />
              </button>
              <button
                type="button"
                onClick={() => setLikesModalOpen(true)}
                className="-ml-0.5 cursor-pointer text-[18px] font-medium leading-none text-brand-neutral-25 transition-opacity hover:opacity-80"
              >
                {likeCount}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  redirectToLogin();
                  return;
                }
                toast.message("Comment composer will be added next.");
              }}
              className="flex cursor-pointer items-center gap-2 text-brand-neutral-25 transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/Comment Icon.svg"
                alt="Comment"
                width={26}
                height={26}
                className="block h-6.5 w-6.5 shrink-0"
              />
              <span className="text-[18px] font-medium leading-none">
                {post.commentCount}
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                redirectToLogin();
                return;
              }
              toast.message("Bookmark interaction will be added next.");
            }}
            className="cursor-pointer text-brand-neutral-25 transition-opacity hover:opacity-80"
          >
            <Bookmark className="h-7 w-7" strokeWidth={1.9} />
          </button>
        </div>
        <div className="mt-4">
          <ActionButton href={profileHref}>
            <p className="text-[18px] font-bold text-brand-neutral-25 md:text-[20px]">
              {post.author.name}
            </p>
          </ActionButton>
          <p
            ref={captionRef}
            className={[
              "mt-3 text-[16px] leading-8 text-brand-neutral-25 md:text-[18px] md:leading-9",
              isExpanded ? "" : "line-clamp-2",
            ].join(" ")}
          >
            {post.caption}
          </p>
          {showMoreVisible ? (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-3 cursor-pointer text-[16px] font-bold text-brand-primary-200 transition-opacity hover:opacity-85"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          ) : null}
        </div>
      </article>
      <LikesModal
        open={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        users={MOCK_LIKES_USERS}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
