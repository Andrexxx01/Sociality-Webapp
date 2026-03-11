"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/services/me/me.query";
import { validatePostImage } from "@/lib/postFileValidation";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-[16px] font-bold text-brand-neutral-25">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-3 text-[14px] text-pink-500">Text Helper</p>
      ) : null}
    </div>
  );
}

function InputField({
  value,
  placeholder,
  error,
  disabled = false,
  onChange,
}: {
  value: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.value)}
      className={[
        "h-12 w-full rounded-3xl border bg-[rgba(4,10,22,0.92)] px-4 text-[16px] font-medium text-brand-neutral-25 outline-none transition-all duration-200 placeholder:text-brand-neutral-500 md:h-12",
        error
          ? "border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.35)]"
          : "border-brand-neutral-800 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]",
        disabled ? "cursor-not-allowed opacity-70" : "",
      ].join(" ")}
    />
  );
}

function TextareaField({
  value,
  placeholder,
  error,
  onChange,
}: {
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={5}
      onChange={(event) => onChange(event.target.value)}
      className={[
        "min-h-25 w-full resize-none rounded-3xl border bg-[rgba(4,10,22,0.92)] px-4 py-4 text-[16px] leading-8 text-brand-neutral-25 outline-none transition-all duration-200 placeholder:text-brand-neutral-500 md:min-h-25",
        error
          ? "border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.35)]"
          : "border-brand-neutral-800 focus:border-brand-primary-200 focus:shadow-[0_0_0_1px_rgba(127,81,249,0.65),0_0_16px_rgba(105,54,242,0.18)]",
      ].join(" ")}
    />
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const authUser = useAppSelector((state) => state.auth.user);
  const profileQuery = useMyProfileQuery();
  const updateMutation = useUpdateMyProfileMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [bioError, setBioError] = useState("");
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  useEffect(() => {
    const profile = profileQuery.data?.profile;
    if (!profile) return;

    setName(profile.name ?? "");
    setUsername(profile.username ?? "");
    setEmail(profile.email ?? "");
    setPhone(profile.phone ?? "");
    setBio(profile.bio ?? "");
  }, [profileQuery.data]);

  const previewUrl = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }
    return profileQuery.data?.profile.avatarUrl || "/images/default-avatar.svg";
  }, [avatarFile, profileQuery.data?.profile.avatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarFile && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [avatarFile, previewUrl]);

  if (!authUser) return null;

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Text Helper");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!username.trim()) {
      setUsernameError("Text Helper");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!phone.trim()) {
      setPhoneError("Text Helper");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!bio.trim()) {
      setBioError("Text Helper");
      isValid = false;
    } else {
      setBioError("");
    }
    return isValid;
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleSelectAvatar = (file: File | null) => {
    if (!file) return;

    const validationError = validatePostImage(file);
    if (validationError) {
      setAvatarError(validationError);
      return;
    }
    setAvatarError("");
    setAvatarFile(file);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await updateMutation.mutateAsync({
        name: name.trim(),
        username: username.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        avatar: avatarFile,
      });

      toast.success("Profile Success Update");
      router.replace("/me");
    } catch (error: any) {
      const message = error?.message || "Failed to update profile";

      if (
        String(message).toLowerCase().includes("username") ||
        String(message).toLowerCase().includes("duplicate")
      ) {
        setUsernameError("Text Helper");
      }
      toast.error(message);
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
            <span className="text-[20px] font-bold">Edit Profile</span>
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
      <section className="px-4 pb-24 pt-24 md:px-10 md:pb-28 md:pt-28">
        <div className="mx-auto w-full max-w-205">
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-brand-neutral-25 transition-colors hover:bg-brand-neutral-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-[22px] font-bold text-brand-neutral-25 md:text-[24px]">
              Edit Profile
            </h1>
          </div>
          {profileQuery.isLoading ? (
            <div className="flex min-h-80 items-center justify-center">
              <p className="text-[16px] text-brand-neutral-500">
                Loading profile...
              </p>
            </div>
          ) : (
            <div className="mt-6 md:mt-8 md:grid md:grid-cols-[164px_minmax(0,1fr)] md:gap-x-14">
              <div className="flex flex-col items-center md:items-start">
                <div className="h-30 w-30 overflow-hidden rounded-full bg-brand-neutral-900 md:h-34 md:w-34">
                  <img
                    src={previewUrl}
                    alt={name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleChangePhoto}
                  className="mt-6 flex h-12 min-w-41 cursor-pointer items-center justify-center rounded-full border border-brand-neutral-800 bg-transparent px-6 text-[16px] font-bold text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_22px_rgba(127,81,249,0.18)]"
                >
                  Change Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    handleSelectAvatar(file);
                  }}
                />
                {avatarError ? (
                  <p className="mt-3 text-center text-[14px] text-pink-500 md:text-left">
                    {avatarError}
                  </p>
                ) : null}
              </div>
              <div className="mt-8 space-y-8 md:mt-0">
                <Field label="Name" error={nameError}>
                  <InputField
                    value={name}
                    error={nameError}
                    onChange={(value) => {
                      setName(value);
                      if (value.trim()) setNameError("");
                    }}
                  />
                </Field>
                <Field label="Username" error={usernameError}>
                  <InputField
                    value={username}
                    error={usernameError}
                    onChange={(value) => {
                      setUsername(value);
                      if (value.trim()) setUsernameError("");
                    }}
                  />
                </Field>
                <Field label="Email" error={""}>
                  <InputField value={email} disabled />
                </Field>
                <Field label="Number Phone" error={phoneError}>
                  <InputField
                    value={phone}
                    error={phoneError}
                    onChange={(value) => {
                      setPhone(value);
                      if (value.trim()) setPhoneError("");
                    }}
                  />
                </Field>
                <Field label="Bio" error={bioError}>
                  <TextareaField
                    value={bio}
                    placeholder="Create your bio"
                    error={bioError}
                    onChange={(value) => {
                      setBio(value);
                      if (value.trim()) setBioError("");
                    }}
                  />
                </Field>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={updateMutation.isPending}
                  className="h-14 w-full cursor-pointer rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-[18px] font-bold text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.18)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_26px_rgba(127,81,249,0.42)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
