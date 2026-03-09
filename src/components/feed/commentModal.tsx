"use client";

import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { TimelinePost } from "@/types/post";
import type { TimelineComment } from "@/types/comment";
import {
  createComment,
  deleteComment,
  getPostComments,
} from "@/services/comments/comments.api";
import {
  followUser,
  unfollowUser,
  getMyFollowing,
} from "@/services/users/follow.api";

dayjs.extend(relativeTime);

const EMOJIS = [
  "😀",
  "😅",
  "🥰",
  "😇",
  "🙂",
  "😋",
  "🤪",
  "🤐",
  "😏",
  "🤗",
  "😪",
  "🙄",
  "🤫",
  "😴",
  "🥵",
  "😫",
  "😭",
  "😱",
];

type CommentModalProps = {
  open: boolean;
  onClose: () => void;
  post: TimelinePost;
  isAuthenticated: boolean;
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  onImageDoubleLike: () => void;
  comments: TimelineComment[];
  setComments: React.Dispatch<React.SetStateAction<TimelineComment[]>>;
  commentCount: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  currentUser: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  } | null;
  saved: boolean;
  onToggleSave: () => void;
};

function Avatar({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src && src.trim() ? src : "/images/default-avatar.svg"}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.src = "/images/default-avatar.svg";
      }}
    />
  );
}

function CommentItem({
  comment,
  isOwner,
  onDelete,
}: {
  comment: TimelineComment;
  isOwner: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="border-b border-brand-neutral-900 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-brand-neutral-900">
            <Avatar
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-brand-neutral-25">
              {comment.author.name}
            </p>
            <p className="mt-1 text-sm font-medium text-brand-neutral-500">
              {dayjs(comment.createdAt).fromNow()}
            </p>
            <p className="mt-3 text-[16px] leading-7 text-brand-neutral-25">
              {comment.content}
            </p>
          </div>
        </div>
        {isOwner ? (
          <button
            type="button"
            onClick={onDelete}
            className="mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-neutral-400 transition-colors duration-200 hover:bg-brand-neutral-900 hover:text-brand-accent-red"
            aria-label="Delete comment"
          >
            <Trash2 className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function EmptyComments() {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center text-center">
      <p className="text-[18px] font-bold text-brand-neutral-25">
        No Comments yet
      </p>
      <p className="mt-3 text-[16px] font-medium text-brand-neutral-500">
        Start the conversation
      </p>
    </div>
  );
}

function FollowButton({
  isFollowing,
  onClick,
  isPending,
}: {
  isFollowing: boolean;
  onClick: () => void;
  isPending: boolean;
}) {
  if (isFollowing) {
    return (
      <Button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="h-10 cursor-pointer rounded-full border border-brand-neutral-700 bg-transparent px-5 text-sm font-bold text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:bg-brand-neutral-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" strokeWidth={2.4} />
          Following
        </span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="h-10 cursor-pointer rounded-full border-0 bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-6 text-sm font-bold text-brand-neutral-25 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_18px_rgba(127,81,249,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      Follow
    </Button>
  );
}

export default function CommentModal({
  open,
  onClose,
  post,
  isAuthenticated,
  liked,
  likeCount,
  onToggleLike,
  onImageDoubleLike,
  comments,
  setComments,
  commentCount,
  setCommentCount,
  currentUser,
  saved,
  onToggleSave,
}: CommentModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [commentInput, setCommentInput] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [authorFollowed, setAuthorFollowed] = useState(false);
  const [authorMenuOpen, setAuthorMenuOpen] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const canSubmit = commentInput.trim().length > 0;
  const isOwnPost = currentUser?.username === post.author.username;

  const commentsQuery = useQuery({
    queryKey: ["post-comments", post.id],
    queryFn: () => getPostComments(post.id, 1, 50),
    enabled: open,
  });

  const myFollowingQuery = useQuery({
    queryKey: ["my-following", currentUser?.username],
    queryFn: () => getMyFollowing(1, 50),
    enabled: open && isAuthenticated && !isOwnPost,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (payload: { optimisticId: string; text: string }) => {
      return createComment(post.id, payload.text);
    },
    onSuccess: (response, variables) => {
      const created = response.data;

      setComments((prev) =>
        prev.map((item) =>
          item.id === variables.optimisticId
            ? {
                id: String(created.id),
                postId: String(post.id),
                content: created.text,
                createdAt: created.createdAt,
                author: {
                  id: String(created.author.id),
                  username: created.author.username,
                  name: created.author.name,
                  avatarUrl: created.author.avatarUrl,
                },
              }
            : item,
        ),
      );

      toast.success("Comment submitted successfully");
    },
    onError: (_error, variables) => {
      setComments((prev) =>
        prev.filter((item) => item.id !== variables.optimisticId),
      );
      setCommentCount((prev) => Math.max(0, prev - 1));
      toast.error("Failed to submit comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      return deleteComment(commentId);
    },
  });

  const followMutation = useMutation({
    mutationFn: async (shouldFollow: boolean) => {
      if (shouldFollow) {
        return followUser(post.author.username);
      }
      return unfollowUser(post.author.username);
    },
    onError: () => {
      toast.error("Follow action failed");
    },
  });

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!showHeartBurst) return;
    const timeout = window.setTimeout(() => setShowHeartBurst(false), 700);
    return () => window.clearTimeout(timeout);
  }, [showHeartBurst]);

  useEffect(() => {
    const apiComments = commentsQuery.data?.data.comments;
    if (!apiComments) return;

    const mappedComments: TimelineComment[] = apiComments.map((item) => ({
      id: String(item.id),
      postId: String(post.id),
      content: item.text,
      createdAt: item.createdAt,
      author: {
        id: String(item.author.id),
        username: item.author.username,
        name: item.author.name,
        avatarUrl: item.author.avatarUrl,
      },
    }));

    setComments(mappedComments);
    setCommentCount(mappedComments.length);
  }, [commentsQuery.data, post.id, setComments, setCommentCount]);

  useEffect(() => {
    if (!myFollowingQuery.data || isOwnPost) return;

    const followingUsers = myFollowingQuery.data.data.users;
    const followed = followingUsers.some(
      (user) => user.username === post.author.username,
    );

    setAuthorFollowed(followed);
  }, [myFollowingQuery.data, isOwnPost, post.author.username]);

  const sortedComments = useMemo(() => comments, [comments]);

  const redirectToLogin = () => {
    router.push("/login");
  };

  const handleSubmitComment = () => {
    const trimmed = commentInput.trim();

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    if (!trimmed) return;

    const optimisticId = `comment-${Date.now()}`;

    const newComment: TimelineComment = {
      id: optimisticId,
      postId: post.id,
      content: trimmed,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser?.id ?? "me",
        name: currentUser?.name ?? "You",
        username: currentUser?.username ?? "you",
        avatarUrl: currentUser?.avatarUrl ?? "/images/default-avatar.svg",
      },
    };

    setComments((prev) => [...prev, newComment]);
    setCommentCount((prev) => prev + 1);
    setCommentInput("");
    setEmojiOpen(false);

    createCommentMutation.mutate({
      optimisticId,
      text: trimmed,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    const previousComments = comments;
    const nextComments = previousComments.filter(
      (item) => item.id !== commentId,
    );

    setComments(nextComments);
    setCommentCount((prev) => Math.max(0, prev - 1));

    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
      },
      onError: () => {
        setComments(previousComments);
        setCommentCount((prev) => prev + 1);
        toast.error("Failed to delete comment");
      },
    });
  };

  const handleEmojiPick = (emoji: string) => {
    setCommentInput((prev) => `${prev}${emoji}`);
    inputRef.current?.focus();
  };

  const handleAuthorFollowToggle = () => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    if (isOwnPost) return;

    const nextState = !authorFollowed;

    setAuthorFollowed(nextState);
    setAuthorMenuOpen(false);

    followMutation.mutate(nextState, {
      onSuccess: () => {
        toast.success(
          nextState
            ? "User followed successfully"
            : "User unfollowed successfully",
        );
      },
      onError: () => {
        setAuthorFollowed(!nextState);
      },
    });
  };

  const handleDesktopImageDoubleClick = () => {
    setShowHeartBurst(false);
    requestAnimationFrame(() => setShowHeartBurst(true));
    onImageDoubleLike();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80">
      <button
        type="button"
        aria-label="Close comments modal"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-[2px]"
      />
      <div className="absolute inset-x-0 bottom-0 top-auto xl:inset-0 xl:grid xl:place-items-center">
        <div className="relative w-full xl:w-[min(1260px,calc(100vw-64px))]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 -top-11.5 z-82 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-brand-neutral-900/70 xl:right-0 xl:-top-12"
          >
            <Image
              src="/images/Close Button.svg"
              alt="Close"
              width={18}
              height={18}
              className="h-4.5 w-4.5"
            />
          </button>

          {/* Mobile */}
          <div className="rounded-t-[28px] border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] xl:hidden">
            <div className="max-h-[78vh] overflow-y-auto scrollbar-hidden">
              <div className="border-b border-brand-neutral-900 px-4 py-4">
                <h2 className="text-[22px] font-bold text-brand-neutral-25">
                  Comments
                </h2>
              </div>
              <div className="px-4">
                {sortedComments.length > 0 ? (
                  sortedComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      isOwner={
                        String(comment.author.id) === String(currentUser?.id)
                      }
                      onDelete={() => handleDeleteComment(comment.id)}
                    />
                  ))
                ) : (
                  <EmptyComments />
                )}
              </div>
            </div>
            <div className="border-t border-brand-neutral-900 px-4 py-4">
              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEmojiOpen((prev) => !prev)}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-brand-neutral-800 bg-brand-neutral-950/70 transition-colors duration-200 hover:bg-brand-neutral-900"
                >
                  <Image
                    src="/images/Emoji.svg"
                    alt="Emoji"
                    width={22}
                    height={22}
                    className="h-5.5 w-5.5"
                  />
                </button>
                {emojiOpen ? (
                  <div className="absolute bottom-15 left-0 z-83 w-52.5 rounded-3xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                    <div className="grid grid-cols-6 gap-3">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiPick(emoji)}
                          className="cursor-pointer text-[24px] transition-transform duration-150 hover:scale-110"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex h-12 flex-1 items-center rounded-2xl border border-brand-neutral-800 bg-brand-neutral-950/70 pl-4 pr-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={commentInput}
                    onChange={(event) => setCommentInput(event.target.value)}
                    placeholder="Add Comment"
                    className="h-full w-full bg-transparent text-[16px] text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleSubmitComment();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={!canSubmit || createCommentMutation.isPending}
                    className={[
                      "ml-3 shrink-0 cursor-pointer text-[18px] font-bold transition-colors duration-200",
                      canSubmit
                        ? "text-brand-primary-200"
                        : "text-brand-neutral-500",
                    ].join(" ")}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden h-190 overflow-hidden rounded-[28px] border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] shadow-[0_18px_60px_rgba(0,0,0,0.45)] xl:grid xl:grid-cols-[1.55fr_1fr]">
            <div
              className="relative h-full overflow-hidden bg-black"
              onDoubleClick={handleDesktopImageDoubleClick}
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                width={1400}
                height={1400}
                className="h-full w-full object-cover"
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
                  width={120}
                  height={120}
                  className={[
                    "h-30 w-30 drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition-all duration-300",
                    showHeartBurst ? "scale-100" : "scale-50",
                  ].join(" ")}
                />
              </div>
            </div>
            <div className="relative flex h-full min-h-0 flex-col">
              <div className="border-b border-brand-neutral-900 px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-brand-neutral-900">
                      <Avatar
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[18px] font-bold text-brand-neutral-25">
                        {post.author.name}
                      </p>
                      <p className="mt-1 text-sm font-medium text-brand-neutral-500">
                        {dayjs(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  {!isOwnPost ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setAuthorMenuOpen((prev) => !prev)}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-brand-neutral-900"
                      >
                        <Image
                          src="/images/More.svg"
                          alt="More"
                          width={18}
                          height={18}
                          className="h-4.5 w-4.5"
                        />
                      </button>
                      {authorMenuOpen ? (
                        <div className="absolute right-0 top-12 z-83 rounded-3xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                          <FollowButton
                            isFollowing={authorFollowed}
                            onClick={handleAuthorFollowToggle}
                            isPending={followMutation.isPending}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <p className="mt-5 text-[16px] leading-9 text-brand-neutral-25">
                  {post.caption}
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hidden px-5">
                <div className="border-b border-brand-neutral-900 py-5">
                  <h3 className="text-[18px] font-bold text-brand-neutral-25">
                    Comments
                  </h3>
                </div>
                {sortedComments.length > 0 ? (
                  sortedComments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      isOwner={
                        String(comment.author.id) === String(currentUser?.id)
                      }
                      onDelete={() => handleDeleteComment(comment.id)}
                    />
                  ))
                ) : (
                  <EmptyComments />
                )}
              </div>
              <div className="shrink-0 border-t border-brand-neutral-900 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onToggleLike}
                        className="flex cursor-pointer items-center justify-center text-brand-neutral-25 transition-opacity hover:opacity-80"
                      >
                        <Image
                          src={
                            liked
                              ? "/images/liked icon.svg"
                              : "/images/Like Icon.svg"
                          }
                          alt={liked ? "Liked" : "Like"}
                          width={26}
                          height={26}
                          className="block h-6.5 w-6.5 shrink-0"
                        />
                      </button>
                      <span className="text-[18px] font-medium leading-none text-brand-neutral-25">
                        {likeCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/Comment Icon.svg"
                        alt="Comment"
                        width={26}
                        height={26}
                        className="block h-6.5 w-6.5 shrink-0"
                      />
                      <span className="text-[18px] font-medium leading-none text-brand-neutral-25">
                        {commentCount}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleSave}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                  >
                    <Image
                      src={saved ? "/images/Saved.svg" : "/images/Save.svg"}
                      alt={saved ? "Saved" : "Save"}
                      width={26}
                      height={26}
                      className="h-6.5 w-6.5"
                    />
                  </button>
                </div>
                <div className="relative flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEmojiOpen((prev) => !prev)}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-brand-neutral-800 bg-brand-neutral-950/70 transition-colors duration-200 hover:bg-brand-neutral-900"
                  >
                    <Image
                      src="/images/Emoji.svg"
                      alt="Emoji"
                      width={22}
                      height={22}
                      className="h-5.5 w-5.5"
                    />
                  </button>
                  {emojiOpen ? (
                    <div className="absolute bottom-15 left-0 z-83 w-59.5 rounded-3xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
                      <div className="grid grid-cols-6 gap-3">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiPick(emoji)}
                            className="cursor-pointer text-[24px] transition-transform duration-150 hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex h-12 flex-1 items-center rounded-2xl border border-brand-neutral-800 bg-brand-neutral-950/70 pl-4 pr-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={commentInput}
                      onChange={(event) => setCommentInput(event.target.value)}
                      placeholder="Add Comment"
                      className="h-full w-full bg-transparent text-[16px] text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleSubmitComment();
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSubmitComment}
                      disabled={!canSubmit || createCommentMutation.isPending}
                      className={[
                        "ml-3 shrink-0 cursor-pointer text-[18px] font-bold transition-colors duration-200",
                        canSubmit
                          ? "text-brand-primary-200"
                          : "text-brand-neutral-500",
                      ].join(" ")}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
