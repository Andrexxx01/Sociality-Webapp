"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateMyProfileMutation } from "@/services/me/me.query";
import type { MeProfile } from "@/types/profile";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  phone: z.string().trim().optional(),
  bio: z.string().trim().max(160, "Bio max 160 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: MeProfile;
};

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const mutation = useUpdateMyProfileMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    });
    setAvatarFile(null);
  }, [open, profile, form]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const previewUrl = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return profile.avatarUrl || "/images/default-avatar.svg";
  }, [avatarFile, profile.avatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [avatarFile, previewUrl]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      name: values.name,
      username: values.username,
      phone: values.phone ?? "",
      bio: values.bio ?? "",
      avatar: avatarFile,
    });
    onOpenChange(false);
  });
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-155 rounded-[28px] border border-brand-neutral-800 bg-[#05070B] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-brand-neutral-25 md:text-[24px]">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-brand-neutral-800 text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:shadow-[0_0_18px_rgba(127,81,249,0.18)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-brand-neutral-900 md:h-28 md:w-28">
              <img
                src={previewUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
              <label className="absolute inset-0 flex cursor-pointer items-end justify-end bg-black/0 p-1 transition-colors duration-200 hover:bg-black/15">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary-300 text-brand-neutral-25 shadow-[0_0_18px_rgba(127,81,249,0.32)]">
                  <Camera className="h-4 w-4" />
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setAvatarFile(file);
                  }}
                />
              </label>
            </div>
            <p className="mt-3 text-sm text-brand-neutral-500">
              Click avatar to change photo
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-neutral-200">
              Name
            </label>
            <input
              {...form.register("name")}
              className="h-12 w-full rounded-2xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 text-brand-neutral-25 outline-none transition-all duration-200 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]"
            />
            {form.formState.errors.name ? (
              <p className="text-sm text-brand-accent-red">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-neutral-200">
              Username
            </label>
            <input
              {...form.register("username")}
              className="h-12 w-full rounded-2xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 text-brand-neutral-25 outline-none transition-all duration-200 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]"
            />
            {form.formState.errors.username ? (
              <p className="text-sm text-brand-accent-red">
                {form.formState.errors.username.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-neutral-200">
              Phone
            </label>
            <input
              {...form.register("phone")}
              className="h-12 w-full rounded-2xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 text-brand-neutral-25 outline-none transition-all duration-200 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-neutral-200">
              Bio
            </label>
            <textarea
              {...form.register("bio")}
              rows={4}
              className="w-full resize-none rounded-2xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 py-3 text-brand-neutral-25 outline-none transition-all duration-200 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]"
            />
            {form.formState.errors.bio ? (
              <p className="text-sm text-brand-accent-red">
                {form.formState.errors.bio.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-12 cursor-pointer rounded-full border border-brand-neutral-800 bg-transparent px-7 text-brand-neutral-25 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_18px_rgba(127,81,249,0.18)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-12 cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 px-8 text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(127,81,249,0.42)]"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
