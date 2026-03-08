"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDebounce } from "@/hooks/useDebounce";
import { clearAuthSession } from "@/lib/auth-token";
import { searchUsers } from "@/services/users/users.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { SearchUserItem } from "@/types/user";

const DEFAULT_AVATAR = "/images/default-avatar.svg";

function AvatarImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(
    src && src.trim().length > 0 ? src : DEFAULT_AVATAR,
  );

  useEffect(() => {
    setImgSrc(src && src.trim().length > 0 ? src : DEFAULT_AVATAR);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
    />
  );
}

function SearchResultItem({
  user,
  onClick,
}: {
  user: SearchUserItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-200 hover:bg-brand-neutral-900/70"
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-brand-neutral-900">
        <AvatarImage
          src={user.avatarUrl}
          alt={user.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-bold text-brand-neutral-25">
          {user.name}
        </p>
        <p className="truncate text-sm font-medium text-brand-neutral-500">
          @{user.username}
        </p>
      </div>
    </button>
  );
}

function SearchEmpty() {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center px-4 text-center">
      <p className="text-xl font-bold text-brand-neutral-25">
        No results found
      </p>
      <p className="mt-3 text-sm font-medium text-brand-neutral-500">
        Change your keyword
      </p>
    </div>
  );
}

function SearchResults({
  users,
  isEmpty,
  onUserClick,
  mobile = false,
}: {
  users: SearchUserItem[];
  isEmpty: boolean;
  onUserClick: (username: string) => void;
  mobile?: boolean;
}) {
  if (isEmpty) {
    return <SearchEmpty />;
  }

  return (
    <div
      className={
        mobile
          ? "space-y-2 px-2 pb-4 pt-3"
          : "max-h-85 space-y-1 overflow-y-auto scrollbar-hidden px-2 py-3"
      }
    >
      {users.map((user) => (
        <SearchResultItem
          key={user.id}
          user={user}
          onClick={() => onUserClick(user.username)}
        />
      ))}
    </div>
  );
}

function AuthActionButton({
  href,
  children,
  primary = false,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  mobile?: boolean;
}) {
  return (
    <Button
      asChild
      className={[
        mobile ? "h-11 flex-1" : "h-11 px-8",
        "cursor-pointer rounded-full text-sm font-bold transition-all duration-200 active:scale-[0.98]",
        primary
          ? "border-0 bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-brand-neutral-25 shadow-none hover:brightness-110 hover:shadow-[0_0_24px_rgba(127,81,249,0.45)]"
          : "border border-brand-neutral-700 bg-transparent text-brand-neutral-25 hover:border-brand-primary-200 hover:bg-brand-neutral-900",
      ].join(" ")}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [avatarHistoryActive, setAvatarHistoryActive] = useState(false);
  const [mobilePublicMenuOpen, setMobilePublicMenuOpen] = useState(false);
  const debouncedKeyword = useDebounce(searchKeyword, 250);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const shouldSearch = debouncedKeyword.trim().length >= 1;

  const { data, isFetching } = useQuery({
    queryKey: QUERY_KEYS.users.search(debouncedKeyword),
    queryFn: () => searchUsers(debouncedKeyword),
    enabled: shouldSearch,
  });

  const users = data?.users ?? [];
  const isEmptySearch = shouldSearch && !isFetching && users.length === 0;
  const displayName = user?.name || user?.username || "John Doe";
  const isHomeLikePage = pathname === "/feed" || pathname === "/";

  const clearAvatarHistory = () => {
    setAvatarHistoryActive(false);
  };

  const handleLogoClick = () => {
    clearAvatarHistory();
    setMobilePublicMenuOpen(false);
    if (isHomeLikePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/feed");
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    clearAuthSession();
    router.replace("/login");
  };

  const handleUserClick = (username: string) => {
    setMobileSearchOpen(false);
    setDesktopSearchOpen(false);
    setSearchKeyword("");
    setMobilePublicMenuOpen(false);
    clearAvatarHistory();
    router.push(`/profile/${username}`);
  };

  const hasClearButton = searchKeyword.trim().length > 0;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(target)) {
        if (avatarMenuOpen) {
          setAvatarMenuOpen(false);
          setAvatarHistoryActive(true);
        }
      }
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(target)
      ) {
        setDesktopSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [avatarMenuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-18 border-b border-brand-neutral-900 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-432 items-center justify-between px-4 md:px-10 lg:px-16 xl:px-20">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src="/images/Logo-Sociality.svg"
              alt="Sociality"
              width={34}
              height={34}
              priority
              className="h-8.5 w-8.5"
            />
            <span className="text-[19px] font-bold leading-none text-brand-neutral-25 md:text-[20px]">
              Sociality
            </span>
          </button>
          <div
            ref={desktopSearchRef}
            className="relative hidden md:block md:w-130 lg:w-155 xl:w-175"
          >
            <div className="flex h-12 items-center rounded-full border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 transition-all duration-200 focus-within:border-brand-primary-200 focus-within:shadow-[0_0_0_1px_rgba(127,81,249,0.7),0_0_18px_rgba(105,54,242,0.2)]">
              <Image
                src="/images/Search.svg"
                alt=""
                width={18}
                height={18}
                className="h-4.5 w-4.5 shrink-0 opacity-70"
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(event) => {
                  setSearchKeyword(event.target.value);
                  clearAvatarHistory();
                  setMobilePublicMenuOpen(false);
                }}
                onFocus={() => {
                  setDesktopSearchOpen(true);
                  clearAvatarHistory();
                  setMobilePublicMenuOpen(false);
                }}
                placeholder="Search"
                className="h-full w-full bg-transparent px-3 text-base font-medium text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
              />
              {hasClearButton ? (
                <button
                  type="button"
                  onClick={() => setSearchKeyword("")}
                  className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center opacity-80 transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/images/Close.svg"
                    alt="Clear search"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </button>
              ) : null}
            </div>
            {desktopSearchOpen && shouldSearch ? (
              <div className="absolute left-0 top-13 w-full overflow-hidden rounded-4xl border border-brand-neutral-800 bg-[rgba(4,10,22,0.98)] shadow-[0_16px_50px_rgba(0,0,0,0.48)]">
                {isFetching ? (
                  <div className="px-4 py-6 text-sm font-medium text-brand-neutral-500">
                    Searching...
                  </div>
                ) : (
                  <SearchResults
                    users={users}
                    isEmpty={isEmptySearch}
                    onUserClick={handleUserClick}
                  />
                )}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(true);
                setMobilePublicMenuOpen(false);
                clearAvatarHistory();
              }}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-brand-neutral-900 md:hidden"
            >
              <Image
                src="/images/Search.svg"
                alt="Search"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </button>
            {isAuthenticated ? (
              <div ref={avatarMenuRef} className="relative">
                <div
                  className={[
                    "flex items-center gap-3 rounded-full px-1 py-1 transition-all duration-200",
                    avatarHistoryActive
                      ? "ring-2 ring-brand-primary-200 ring-offset-[3px] ring-offset-black"
                      : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen((prev) => !prev);
                    }}
                    className="flex cursor-pointer items-center justify-center rounded-full"
                  >
                    <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-brand-primary-200">
                      <AvatarImage
                        src={user?.avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearAvatarHistory();
                      router.push("/me");
                    }}
                    className="hidden cursor-pointer md:block"
                  >
                    <span className="max-w-55 truncate text-base font-bold text-brand-neutral-25 transition-opacity hover:opacity-90">
                      {displayName}
                    </span>
                  </button>
                </div>
                {avatarMenuOpen ? (
                  <div className="absolute right-0 top-16.5 w-75 overflow-hidden rounded-4xl border border-brand-neutral-800 bg-[linear-gradient(180deg,#111827_0%,#101828_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                    <div className="px-6 py-6">
                      <p className="text-display-sm font-bold text-brand-neutral-25">
                        {displayName}
                      </p>
                      <p className="mt-2 text-display-xs font-semibold text-brand-neutral-500">
                        @{user?.username ?? "username"}
                      </p>
                    </div>
                    <div className="border-t border-brand-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarMenuOpen(false);
                          clearAvatarHistory();
                          router.push("/me");
                        }}
                        className="flex w-full cursor-pointer items-center gap-4 px-6 py-7 text-left transition-colors duration-200 hover:bg-brand-neutral-900/60"
                      >
                        <Image
                          src="/images/user-grey.svg"
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                        <span className="text-display-sm font-medium text-brand-neutral-25">
                          Profile
                        </span>
                      </button>
                    </div>
                    <div className="border-t border-brand-neutral-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-4 px-6 py-7 text-left transition-colors duration-200 hover:bg-brand-neutral-900/60"
                      >
                        <Image
                          src="/images/log-out-red.svg"
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                        <span className="text-display-sm font-medium text-red-500">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="hidden items-center gap-3 md:flex">
                  <AuthActionButton href="/login">Login</AuthActionButton>
                  <AuthActionButton href="/register" primary>
                    Register
                  </AuthActionButton>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobilePublicMenuOpen((prev) => !prev);
                    clearAvatarHistory();
                  }}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-brand-neutral-900 md:hidden"
                >
                  <Image
                    src={
                      mobilePublicMenuOpen
                        ? "/images/Close Button.svg"
                        : "/images/Menu.svg"
                    }
                    alt={mobilePublicMenuOpen ? "Close menu" : "Open menu"}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {!isAuthenticated && mobilePublicMenuOpen ? (
        <div className="fixed inset-x-0 top-18 z-30 border-b border-brand-neutral-900 bg-black/95 px-3 pb-3 pt-1 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <AuthActionButton href="/login" mobile>
              Login
            </AuthActionButton>
            <AuthActionButton href="/register" primary mobile>
              Register
            </AuthActionButton>
          </div>
        </div>
      ) : null}
      {mobileSearchOpen ? (
        <div className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-black md:hidden">
          <div className="shrink-0 px-3 pt-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 flex-1 items-center rounded-full border border-brand-neutral-800 bg-[rgba(4,10,22,0.92)] px-4 transition-all duration-200 focus-within:border-brand-primary-200 focus-within:shadow-[0_0_0_1px_rgba(127,81,249,0.7),0_0_18px_rgba(105,54,242,0.2)]">
                <Image
                  src="/images/Search.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="h-4.5 w-4.5 shrink-0 opacity-70"
                />
                <input
                  autoFocus
                  type="text"
                  value={searchKeyword}
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                    clearAvatarHistory();
                  }}
                  placeholder="Search"
                  className="h-full w-full bg-transparent px-3 text-base font-medium text-brand-neutral-25 outline-none placeholder:text-brand-neutral-500"
                />
                {hasClearButton ? (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword("")}
                    className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center opacity-80 transition-opacity hover:opacity-100"
                  >
                    <Image
                      src="/images/Close.svg"
                      alt="Clear search"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchKeyword("");
                }}
                className="flex h-10 w-10 cursor-pointer items-center justify-center"
              >
                <Image
                  src="/images/Close Button.svg"
                  alt="Close search"
                  width={18}
                  height={18}
                  className="h-4.5 w-4.5"
                />
              </button>
            </div>
            <div className="mt-3 h-px bg-brand-neutral-900" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hidden pt-3">
            {!shouldSearch ? null : isFetching ? (
              <div className="px-4 py-6 text-sm font-medium text-brand-neutral-500">
                Searching...
              </div>
            ) : (
              <SearchResults
                users={users}
                isEmpty={isEmptySearch}
                onUserClick={handleUserClick}
                mobile
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
