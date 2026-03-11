"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { register as registerAccount } from "@/services/auth/auth.api";
import { saveAuthSession } from "@/lib/auth-token";
import { getErrorMessage } from "@/lib/error-message";
import { setCredentials } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  registerSchema,
  type RegisterSchema,
} from "@/validators/auth.validator";
import type { AuthResponseData, RegisterPayload } from "@/types/auth";

function getInputWrapperClass(hasError: boolean) {
  return [
    "group flex h-12 w-full items-center rounded-2xl border bg-[rgba(4,10,22,0.92)] px-4 transition-all duration-200",
    hasError
      ? "border-brand-accent-red shadow-[0_0_0_1px_rgba(217,32,110,0.55)]"
      : "border-brand-neutral-800/90",
    "focus-within:border-brand-primary-200 focus-within:shadow-[0_0_0_1px_rgba(127,81,249,0.7),0_0_18px_rgba(105,54,242,0.2)]",
  ].join(" ");
}

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const registerMutation = useMutation<
    AuthResponseData,
    Error,
    RegisterPayload
  >({
    mutationFn: registerAccount,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      saveAuthSession(data);
      toast.success("Register successful");
      router.replace("/login");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const isPending = useMemo(
    () => isSubmitting || registerMutation.isPending,
    [isSubmitting, registerMutation.isPending],
  );

  const onSubmit = (values: RegisterSchema) => {
    registerMutation.mutate({
      name: values.name,
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
  };

  return (
    <div className="relative z-10 w-full max-w-86.25 rounded-[18px] border border-brand-neutral-800/80 bg-[linear-gradient(180deg,rgba(10,13,18,0.82)_0%,rgba(10,13,18,0.96)_100%)] px-4 py-7 shadow-[0_0_0_1px_rgba(24,29,39,0.65),0_18px_60px_rgba(0,0,0,0.5)] md:max-w-111.5 md:px-4 md:py-8">
      <div className="mb-7 flex flex-col items-center md:mb-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Logo-Sociality.svg"
            alt="Sociality"
            width={30}
            height={30}
            priority
            className="h-auto w-7.5"
          />
          <h1 className="text-display-xs font-bold text-brand-neutral-25">
            Sociality
          </h1>
        </div>
        <h1 className="mt-4 text-center text-xl font-bold text-brand-neutral-25 md:mt-6 md:text-display-xs">
          Register
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Name
          </label>
          <div className={getInputWrapperClass(Boolean(errors.name))}>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              {...register("name")}
              className="h-full w-full border-none bg-transparent text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
          </div>
          {errors.name ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Username
          </label>
          <div className={getInputWrapperClass(Boolean(errors.username))}>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              {...register("username")}
              className="h-full w-full border-none bg-transparent text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
          </div>
          {errors.username ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.username.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Email
          </label>
          <div className={getInputWrapperClass(Boolean(errors.email))}>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              className="h-full w-full border-none bg-transparent text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
          </div>
          {errors.email ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Number Phone
          </label>
          <div className={getInputWrapperClass(Boolean(errors.phone))}>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your number phone"
              autoComplete="tel"
              {...register("phone")}
              className="h-full w-full border-none bg-transparent text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
          </div>
          {errors.phone ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.phone.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Password
          </label>
          <div className={getInputWrapperClass(Boolean(errors.password))}>
            <input
              id="password"
              type={showPassword ? "password" : "text"}
              placeholder="Enter your password"
              autoComplete="new-password"
              {...register("password")}
              className="h-full w-full border-none bg-transparent pr-3 text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center opacity-85 transition-opacity hover:opacity-100"
            >
              <Image
                src={
                  showPassword
                    ? "/images/eye-off-light.svg"
                    : "/images/eye-light.svg"
                }
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5"
              />
            </button>
          </div>
          {errors.password ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-bold leading-5 text-white"
          >
            Confirm Password
          </label>
          <div
            className={getInputWrapperClass(Boolean(errors.confirmPassword))}
          >
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "password" : "text"}
              placeholder="Enter your confirm password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="h-full w-full border-none bg-transparent pr-3 text-[15px] leading-6 text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center opacity-85 transition-opacity hover:opacity-100"
            >
              <Image
                src={
                  showConfirmPassword
                    ? "/images/eye-off-light.svg"
                    : "/images/eye-light.svg"
                }
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5"
              />
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="mt-2 text-sm font-medium leading-4 text-brand-accent-red">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="mt-5 h-12 w-full cursor-pointer rounded-full border-0 bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-md font-bold text-brand-neutral-25 shadow-none transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(127,81,249,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Loading..." : "Submit"}
        </Button>

        <p className="pt-1 text-center text-sm font-semibold leading-5 text-brand-neutral-25 md:text-md">
          Already have an account?{" "}
          <Link
            href="/login"
            className="cursor-pointer text-sm font-bold text-brand-primary-200 transition-colors hover:text-brand-primary-300 md:text-md"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
