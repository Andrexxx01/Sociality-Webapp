"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import CommentComposer from "@/components/comment/commentComposer";
import CommentList from "@/components/comment/commentList";
import ConfirmDialog from "@/components/common/confirmDialog";
import DeletePostButton from "@/components/post/deletePostButton";
import LikeButton from "@/components/post/likeButton";
import PostDetailHeader from "@/components/post/postDetailHeader";
import SaveButton from "@/components/post/saveButton";
import { useAppSelector } from "@/hooks/useAppSelector";
import { savePost, unsavePost } from "@/services/posts/bookmark.api";
import { likePost, unlikePost } from "@/services/posts/like.api";
import { useSavedPostsQuery } from "@/services/posts/saved.query";
import {
  useDeletePostMutation,
  usePostDetailQuery,
} from "@/services/posts/posts.query";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  usePostCommentsQuery,
} from "@/services/comments/comments.query";

type PostDetailModalProps = {
  postId: string;
};

export default function PostDetailModal({ postId }: PostDetailModalProps) {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const postQuery = usePostDetailQuery(postId, Boolean(postId));
  const commentsQuery = usePostCommentsQuery(postId, Boolean(postId));
  const savedPostsQuery = useSavedPostsQuery(Boolean(authUser));
  const createCommentMutation = useCreateCommentMutation(postId);
  const deleteCommentMutation = useDeleteCommentMutation(postId);
  const deletePostMutation = useDeletePostMutation();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const post = postQuery.data;
  const comments = commentsQuery.data ?? [];

  useEffect(() => {
    if (!post) return;
    setLiked(Boolean(post.likedByMe));
    setLikeCount(post.likeCount);
  }, [post]);

  useEffect(() => {
    if (!post || !savedPostsQuery.data) return;
    const found = savedPostsQuery.data.some(
      (item) => String(item.id) === String(post.id),
    );
    setSaved(found);
  }, [post, savedPostsQuery.data]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const isMine = useMemo(() => {
    if (!post || !authUser) return false;
    return (
      authUser.id === post.author.id ||
      authUser.username === post.author.username
    );
  }, [post, authUser]);

  const likeMutation = useMutation({
    mutationFn: async (shouldLike: boolean) => {
      if (shouldLike) return likePost(postId);
      return unlikePost(postId);
    },

    onMutate: (shouldLike) => {
      setLiked(shouldLike);
      setLikeCount((prev) => prev + (shouldLike ? 1 : -1));
    },

    onSuccess: (response) => {
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    },

    onError: () => {
      toast.error("Failed to update like");
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (shouldSave: boolean) => {
      if (shouldSave) return savePost(postId);
      return unsavePost(postId);
    },

    onMutate: (shouldSave) => {
      setSaved(shouldSave);
    },

    onError: () => {
      toast.error("Failed to update save");
      setSaved((prev) => !prev);
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleLike = () => {
    if (!authUser) {
      router.push("/login");
      return;
    }
    likeMutation.mutate(!liked);
  };

  const handleSave = () => {
    if (!authUser) {
      router.push("/login");
      return;
    }
    saveMutation.mutate(!saved);
  };

  const handleSubmitComment = async (text: string) => {
    if (!authUser) {
      router.push("/login");
      return;
    }

    try {
      await createCommentMutation.mutateAsync(text);
      toast.success("Comment submitted successfully");
    } catch {
      toast.error("Failed to submit comment");
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostMutation.mutateAsync(postId);
      setDeletePostOpen(false);
      toast.success("Post deleted successfully");
      router.replace("/me");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;

    try {
      await deleteCommentMutation.mutateAsync(deleteCommentId);
      setDeleteCommentId(null);
      toast.success("Comment deleted successfully");
    } catch {
      toast.error("Failed to delete comment");
    }
  };
  if (postQuery.isLoading) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80">
        <p className="text-[16px] text-brand-neutral-500">Loading post...</p>
      </div>
    );
  }

  if (postQuery.isError || !post) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 px-4">
        <div className="w-full max-w-105 rounded-[28px] border border-brand-neutral-800 bg-[#05070B] p-6 text-center">
          <p className="text-[20px] font-bold text-brand-neutral-25">
            Post not found
          </p>
          <p className="mt-3 text-[15px] leading-7 text-brand-neutral-500">
            The post you are looking for does not exist or has been removed.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 h-11 cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-6 text-brand-neutral-25 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_20px_rgba(127,81,249,0.42)]"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-110 flex items-center justify-center p-0 md:p-6">
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-black md:h-[88vh] md:max-h-215 md:max-w-295 md:flex-row md:rounded-[32px] md:border md:border-brand-neutral-800 md:bg-[#05070B] md:shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-30 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-neutral-800 bg-black/55 text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:shadow-[0_0_18px_rgba(127,81,249,0.18)] md:flex"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex h-16 items-center gap-3 border-b border-brand-neutral-900 px-4 md:hidden">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-brand-neutral-25 transition-colors hover:bg-brand-neutral-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="text-[18px] font-bold text-brand-neutral-25">Post</p>
          </div>
          <div className="relative flex min-h-70 flex-1 items-center justify-center bg-black md:min-h-0">
            <img
              src={post.imageUrl}
              alt={post.caption || "Post image"}
              className="h-full w-full object-contain md:object-cover"
            />
          </div>
          <div className="flex w-full flex-col border-t border-brand-neutral-900 md:w-105 md:border-l md:border-t-0 md:border-brand-neutral-900">
            <div className="border-b border-brand-neutral-900 p-4 pr-16 md:pr-20">
              <PostDetailHeader post={post} />
            </div>

            <div className="border-b border-brand-neutral-900 px-4 py-4">
              <p className="text-[15px] leading-7 text-brand-neutral-25">
                {post.caption}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <LikeButton
                    liked={liked}
                    count={likeCount}
                    onClick={handleLike}
                  />
                  <div className="flex items-center gap-2 rounded-full px-3 py-2 text-brand-neutral-25">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-[14px] font-medium">
                      {comments.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SaveButton saved={saved} onClick={handleSave} />
                  {isMine ? (
                    <DeletePostButton onClick={() => setDeletePostOpen(true)} />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
              {commentsQuery.isLoading ? (
                <div className="flex min-h-55 items-center justify-center">
                  <p className="text-[15px] text-brand-neutral-500">
                    Loading comments...
                  </p>
                </div>
              ) : (
                <CommentList
                  comments={comments}
                  currentUserId={authUser?.id ?? null}
                  onDeleteComment={(commentId) => setDeleteCommentId(commentId)}
                />
              )}
            </div>
            <div className="p-4">
              <CommentComposer
                disabled={!authUser}
                isSubmitting={createCommentMutation.isPending}
                onSubmit={handleSubmitComment}
              />
              {!authUser ? (
                <p className="mt-2 text-[13px] text-brand-neutral-500">
                  Login first to write a comment.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={deletePostOpen}
        title="Delete this post?"
        description="This action cannot be undone. The post will be permanently removed."
        confirmLabel="Delete Post"
        isLoading={deletePostMutation.isPending}
        onCancel={() => setDeletePostOpen(false)}
        onConfirm={handleDeletePost}
      />
      <ConfirmDialog
        open={Boolean(deleteCommentId)}
        title="Delete this comment?"
        description="This action cannot be undone. The comment will be permanently removed."
        confirmLabel="Delete Comment"
        isLoading={deleteCommentMutation.isPending}
        onCancel={() => setDeleteCommentId(null)}
        onConfirm={handleDeleteComment}
      />
    </>
  );
}
