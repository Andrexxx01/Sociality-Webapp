import { apiGet, apiPatch } from "@/lib/api-client";
import type {
  MePostsResponseData,
  MeProfileResponseData,
  UpdateMePayload,
} from "@/types/profile";

export async function getMyProfile(): Promise<MeProfileResponseData> {
  const response = await apiGet<MeProfileResponseData>("/api/me", {
    auth: true,
  });
  return response.data;
}

export async function updateMyProfile(
  payload: UpdateMePayload,
): Promise<MeProfileResponseData> {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("username", payload.username);
  formData.append("phone", payload.phone);
  formData.append("bio", payload.bio);
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }
  const response = await apiPatch<MeProfileResponseData>("/api/me", formData, {
    auth: true,
  });
  return response.data;
}

export async function getMyPosts(
  page = 1,
  limit = 50,
): Promise<MePostsResponseData> {
  const response = await apiGet<MePostsResponseData>(
    `/api/me/posts?page=${page}&limit=${limit}`,
    {
      auth: true,
    },
  );
  return response.data;
}
