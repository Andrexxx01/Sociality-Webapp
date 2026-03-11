"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setCredentials } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getMyPosts, getMyProfile, updateMyProfile } from "./me.api";
import type {
  MeProfileResponseData,
  UpdateMePayload,
  MeProfile,
} from "@/types/profile";

export function useMyProfileQuery() {
  return useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyProfile,
  });
}

export function useMyPostsQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["me", "posts", page, limit],
    queryFn: () => getMyPosts(page, limit),
  });
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  return useMutation({
    mutationFn: updateMyProfile,

    onMutate: async (payload: UpdateMePayload) => {
      await queryClient.cancelQueries({ queryKey: ["me", "profile"] });
      const previous = queryClient.getQueryData<MeProfileResponseData>([
        "me",
        "profile",
      ]);
      let previewUrl: string | null = null;
      if (previous) {
        if (payload.avatar) {
          previewUrl = URL.createObjectURL(payload.avatar);
        }
        const optimisticProfile: MeProfile = {
          ...previous.profile,
          name: payload.name,
          username: payload.username,
          phone: payload.phone || null,
          bio: payload.bio || null,
          avatarUrl: previewUrl ?? previous.profile.avatarUrl,
        };
        queryClient.setQueryData<MeProfileResponseData>(["me", "profile"], {
          ...previous,
          profile: optimisticProfile,
        });
      }
      return { previous, previewUrl };
    },

    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["me", "profile"], context.previous);
      }
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }
      toast.error(error.message || "Failed to update profile");
    },

    onSuccess: (data, _payload, context) => {
      if (context?.previewUrl) {
        URL.revokeObjectURL(context.previewUrl);
      }
      queryClient.setQueryData(["me", "profile"], data);
      if (authState.token) {
        dispatch(
          setCredentials({
            token: authState.token,
            user: {
              id: String(data.profile.id),
              name: data.profile.name,
              username: data.profile.username,
              email: data.profile.email,
              phone: data.profile.phone,
              avatarUrl: data.profile.avatarUrl,
            },
          }),
        );
      }
      toast.success("Profile updated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["me", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["me", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["users", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["users", "search"] });
    },
  });
}
