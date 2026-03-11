"use client";

import { useParams } from "next/navigation";
import PostDetailModal from "@/components/post/postDetailModal";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();

  return <PostDetailModal postId={params.id} />;
}
