"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/layout/header";
import FloatingNav from "@/components/layout/floatingNav";
import CreatePostDropzone from "@/components/post/createPostDropzone";
import CreatePostCaptionField from "@/components/post/createPostCaptionField";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useAppSelector";
import { validatePostImage } from "@/lib/postFileValidation";
import { useCreatePostMutation } from "@/services/posts/posts.query";

export default function CreatePostPage() {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const createPostMutation = useCreatePostMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [imageError, setImageError] = useState<string>("");
  const [captionError, setCaptionError] = useState<string>("");

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!authUser) return null;

  const handleSelectFile = (file: File | null) => {
    setImageFile(file);
    const error = validatePostImage(file);
    setImageError(error ?? "");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageError("");
  };

  const handleSubmit = async () => {
    const nextImageError = validatePostImage(imageFile);
    const nextCaptionError =
      caption.trim().length === 0 ? "Caption is required" : "";
    setImageError(nextImageError ?? "");
    setCaptionError(nextCaptionError);
    if (nextImageError || nextCaptionError || !imageFile) {
      return;
    }
    try {
      await createPostMutation.mutateAsync({
        image: imageFile,
        caption: caption.trim(),
      });
      toast.success("Success Post");
      router.replace("/feed");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create post");
    }
  };

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
            <span className="text-[20px] font-bold">Add Post</span>
          </button>
          <div className="h-11 w-11 overflow-hidden rounded-full bg-brand-neutral-900">
            <img
              src={authUser.avatarUrl || "/images/default-avatar.svg"}
              alt={authUser.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <section className="px-4 pb-32 pt-24 md:px-10 md:pb-38 md:pt-10">
        <div className="mx-auto w-full max-w-140">
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-brand-neutral-25 transition-colors hover:bg-brand-neutral-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-[30px] font-bold leading-none text-brand-neutral-25">
              Add Post
            </h1>
          </div>
          <div className="mt-6 md:mt-8">
            <label className="mb-3 block text-[16px] font-bold text-brand-neutral-25">
              Photo
            </label>
            <CreatePostDropzone
              previewUrl={previewUrl}
              error={imageError}
              onFileSelect={handleSelectFile}
              onRemove={handleRemoveImage}
            />
          </div>
          <div className="mt-7">
            <label className="mb-3 block text-[16px] font-bold text-brand-neutral-25">
              Caption
            </label>
            <CreatePostCaptionField
              value={caption}
              error={captionError}
              onChange={(value) => {
                setCaption(value);
                if (value.trim().length > 0) {
                  setCaptionError("");
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={createPostMutation.isPending}
            className="mt-8 h-14 w-full cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-[18px] font-bold text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(127,81,249,0.42)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createPostMutation.isPending ? "Sharing..." : "Share"}
          </Button>
        </div>
      </section>
      <FloatingNav
        isAuthenticated={Boolean(authUser)}
        activeKey="create"
        onHomeClick={() => router.push("/feed")}
      />
    </main>
  );
}
