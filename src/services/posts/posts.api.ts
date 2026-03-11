import { apiDelete, apiGet, apiPost } from "@/lib/api-client";
import type { TimelinePost } from "@/types/post";
import type {
  CreatePostPayload,
  CreatePostResponse,
} from "@/types/createPost";

export type PostAuthor = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

export type PostItem = {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  author: PostAuthor;
};

export type PostsResponse = {
  posts: PostItem[];
  nextCursor?: string;
};

export type PostDetailDto = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export type DeletePostData = {
  deleted?: boolean;
};

function mapPostDtoToTimelinePost(dto: PostDetailDto): TimelinePost {
  return {
    id: String(dto.id),
    imageUrl: dto.imageUrl,
    caption: dto.caption,
    createdAt: dto.createdAt,
    author: {
      id: String(dto.author.id),
      username: dto.author.username,
      name: dto.author.name,
      avatarUrl: dto.author.avatarUrl,
    },
    likeCount: dto.likeCount,
    commentCount: dto.commentCount,
    shareCount: 0,
    likedByMe: dto.likedByMe,
    savedByMe: false,
  };
}

export async function getExplorePosts(cursor?: string) {
  const params = new URLSearchParams();
  params.set("limit", "50");
  if (cursor) {
    params.set("cursor", cursor);
  }

  const response = await apiGet<PostsResponse>(
    `/api/posts?${params.toString()}`,
  );
  return response.data;
}

export async function getPostDetail(
  postId: string | number,
): Promise<TimelinePost> {
  const response = await apiGet<PostDetailDto>(`/api/posts/${postId}`, {
    auth: true,
  });
  return mapPostDtoToTimelinePost(response.data);
}

export async function createPost(payload: CreatePostPayload) {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("caption", payload.caption);
  const response = await apiPost<CreatePostResponse>("/api/posts", formData, {
    auth: true,
  });
  return response.data;
}

export async function deletePost(postId: string | number) {
  return apiDelete<DeletePostData>(`/api/posts/${postId}`, {
    auth: true,
  });
}
