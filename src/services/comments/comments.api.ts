import { apiDelete, apiGet, apiPost } from "@/lib/api-client";

export type CommentAuthorDto = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

export type CommentDto = {
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthorDto;
  isMine?: boolean;
};

export type PaginationDto = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetPostCommentsData = {
  comments: CommentDto[];
  pagination: PaginationDto;
};

export type CreateCommentData = {
  id: number;
  text: string;
  createdAt: string;
  author: CommentAuthorDto;
  isMine: boolean;
};

export type DeleteCommentData = {
  deleted: boolean;
};

export async function getPostComments(
  postId: string | number,
  page = 1,
  limit = 50,
) {
  return apiGet<GetPostCommentsData>(
    `/api/posts/${postId}/comments?page=${page}&limit=${limit}`,
  );
}

export async function createComment(postId: string | number, text: string) {
  return apiPost<CreateCommentData>(
    `/api/posts/${postId}/comments`,
    { text },
    { auth: true },
  );
}

export async function deleteComment(commentId: string | number) {
  return apiDelete<DeleteCommentData>(`/api/comments/${commentId}`, {
    auth: true,
  });
}
