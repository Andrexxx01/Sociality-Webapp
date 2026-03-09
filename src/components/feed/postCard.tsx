"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { TimelinePost } from "@/types/post";
import type { TimelineComment } from "@/types/comment";
import LikesModal from "@/components/feed/likesModal";
import CommentModal from "@/components/feed/commentModal";
import { savePost, unsavePost } from "@/services/posts/bookmark.api";
import { likePost, unlikePost } from "@/services/posts/like.api";

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
  const queryClient = useQueryClient();

  const authUser = useAppSelector((state) => state.auth.user);

  const profileHref = `/profile/${post.author.username}`;

  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const lastTapRef = useRef(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreVisible, setShowMoreVisible] = useState(false);

  const [liked, setLiked] = useState(Boolean(post.likedByMe));
  const [saved, setSaved] = useState(Boolean(post.savedByMe));

  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);

  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const [comments, setComments] = useState<TimelineComment[]>([]);

  /* ---------------- SYNC POST STATE ---------------- */

  useEffect(() => {
    setLiked(Boolean(post.likedByMe));
    setSaved(Boolean(post.savedByMe));
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
  }, [post]);

  /* ---------------- CAPTION OVERFLOW ---------------- */

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

  /* ---------------- HEART BURST ---------------- */

  useEffect(() => {
    if (!showHeartBurst) return;

    const timeout = setTimeout(() => {
      setShowHeartBurst(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, [showHeartBurst]);

  const redirectToLogin = () => {
    router.push("/login");
  };

  const triggerHeartBurst = () => {
    setShowHeartBurst(false);
    requestAnimationFrame(() => setShowHeartBurst(true));
  };

  /* ---------------- LIKE MUTATION ---------------- */

  const likeMutation = useMutation({
    mutationFn: async (shouldLike: boolean) => {
      if (shouldLike) {
        return likePost(post.id);
      }
      return unlikePost(post.id);
    },

    onMutate: async (shouldLike) => {
      setLiked(shouldLike);
      setLikeCount((prev) => prev + (shouldLike ? 1 : -1));
    },

    onSuccess: (res) => {
      const data = res.data;

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    },

    onError: () => {
      toast.error("Like action failed");
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    likeMutation.mutate(!liked);

    toast.success(
      !liked ? "Post liked successfully" : "Post unliked successfully",
    );
  };

  const handleImageLike = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    if (liked) return;

    triggerHeartBurst();

    likeMutation.mutate(true);

    toast.success("Post liked successfully");
  };

  /* ---------------- BOOKMARK ---------------- */

  const bookmarkMutation = useMutation({
    mutationFn: async (shouldSave: boolean) => {
      if (shouldSave) {
        return savePost(post.id);
      }
      return unsavePost(post.id);
    },

    onMutate: (shouldSave) => {
      setSaved(shouldSave);
    },

    onError: () => {
      toast.error("Bookmark action failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    bookmarkMutation.mutate(!saved);

    toast.success(
      !saved ? "Post saved successfully" : "Post unsaved successfully",
    );
  };

  /* ---------------- DOUBLE TAP LIKE ---------------- */

  const handleImageClick = () => {
    const now = Date.now();

    if (now - lastTapRef.current < 280) {
      handleImageLike();
    }

    lastTapRef.current = now;
  };

  /* ---------------- COMMENT MODAL ---------------- */

  const handleCommentOpen = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    setCommentModalOpen(true);
  };

  return (
    <>
      <article className="py-5 md:py-7">
        {/* ---------------- AUTHOR ---------------- */}

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

        {/* ---------------- IMAGE ---------------- */}

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
            className="aspect-square w-full cursor-pointer object-cover"
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
                "h-23 w-23 transition-all duration-300 md:h-27 md:w-27",
                showHeartBurst ? "scale-100" : "scale-50",
              ].join(" ")}
            />
          </div>
        </div>

        {/* ---------------- ACTION BAR ---------------- */}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className="cursor-pointer"
              >
                <Image
                  src={
                    liked ? "/images/liked icon.svg" : "/images/Like Icon.svg"
                  }
                  alt="Like"
                  width={26}
                  height={26}
                />
              </button>

              <button
                type="button"
                onClick={() => setLikesModalOpen(true)}
                className="text-[18px] font-medium text-brand-neutral-25"
              >
                {likeCount}
              </button>
            </div>

            <button
              type="button"
              onClick={handleCommentOpen}
              className="flex items-center gap-2"
            >
              <Image
                src="/images/Comment Icon.svg"
                alt="Comment"
                width={26}
                height={26}
              />

              <span className="text-[18px]">{commentCount}</span>
            </button>
          </div>

          <button type="button" onClick={handleSaveToggle}>
            <Image
              src={saved ? "/images/Saved.svg" : "/images/Save.svg"}
              alt="Save"
              width={26}
              height={26}
            />
          </button>
        </div>

        {/* ---------------- CAPTION ---------------- */}

        <div className="mt-4">
          <ActionButton href={profileHref}>
            <p className="text-[18px] font-bold text-brand-neutral-25 md:text-[20px]">
              {post.author.name}
            </p>
          </ActionButton>

          <p
            ref={captionRef}
            className={[
              "mt-3 text-[16px] leading-8 text-brand-neutral-25",
              isExpanded ? "" : "line-clamp-2",
            ].join(" ")}
          >
            {post.caption}
          </p>

          {showMoreVisible && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-3 text-[16px] font-bold text-brand-primary-200"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </article>

      {/* ---------------- MODALS ---------------- */}

      <LikesModal
        open={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        postId={post.id}
        isAuthenticated={isAuthenticated}
      />

      <CommentModal
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        post={post}
        isAuthenticated={isAuthenticated}
        liked={liked}
        likeCount={likeCount}
        onToggleLike={handleLike}
        onImageDoubleLike={handleImageLike}
        comments={comments}
        setComments={setComments}
        commentCount={commentCount}
        setCommentCount={setCommentCount}
        currentUser={
          authUser
            ? {
                id: authUser.id,
                name: authUser.name,
                username: authUser.username,
                avatarUrl: authUser.avatarUrl ?? null,
              }
            : null
        }
        saved={saved}
        onToggleSave={handleSaveToggle}
      />
    </>
  );
}
