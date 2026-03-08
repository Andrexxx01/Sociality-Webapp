"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type FloatingNavProps = {
  isAuthenticated: boolean;
  activeKey?: "home" | "profile";
  onHomeClick: () => void;
};

export default function FloatingNav({
  isAuthenticated,
  activeKey = "home",
  onHomeClick,
}: FloatingNavProps) {
  const router = useRouter();
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      if (currentY <= 12) {
        setIsVisible(true);
        lastScrollY.current = currentY;
        return;
      }
      if (currentY < lastScrollY.current) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProtectedAction = (target: "/login" | "/me" | "/create-post") => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(target);
  };

  const isHomeActive = activeKey === "home";
  const isProfileActive = activeKey === "profile";

  return (
    <div
      className={[
        "fixed bottom-6 left-1/2 z-30 -translate-x-1/2 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0",
      ].join(" ")}
    >
      <div className="flex h-22 w-[calc(100vw-32px)] max-w-190 items-center justify-between rounded-full border border-brand-neutral-800 bg-[rgba(4,10,22,0.96)] px-7 shadow-[0_18px_40px_rgba(0,0,0,0.38)] md:h-24 md:px-10 lg:w-140">
        <button
          type="button"
          onClick={onHomeClick}
          className="group flex min-w-23 cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 group-hover:bg-brand-neutral-900/70">
            <Image
              src={
                isHomeActive
                  ? "/images/Home-purple.svg"
                  : "/images/Home-white.svg"
              }
              alt="Home"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </div>
          <span
            className={[
              "text-[16px] font-semibold transition-colors duration-200",
              isHomeActive ? "text-brand-primary-200" : "text-brand-neutral-25",
            ].join(" ")}
          >
            Home
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleProtectedAction("/create-post")}
          className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-linear-to-r from-brand-primary-200 to-brand-primary-300 text-brand-neutral-25 shadow-[0_0_0_1px_rgba(127,81,249,0.2)] transition-all duration-200 hover:scale-[1.04] hover:brightness-110 hover:shadow-[0_0_24px_rgba(127,81,249,0.45)] active:scale-[0.98]"
        >
          <span className="-mt-1 text-[42px] font-light leading-none">+</span>
        </button>
        <button
          type="button"
          onClick={() => handleProtectedAction("/me")}
          className="group flex min-w-23 cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 group-hover:bg-brand-neutral-900/70">
            <Image
              src={
                isProfileActive
                  ? "/images/Profile-purple.svg"
                  : "/images/Profile-white.svg"
              }
              alt="Profile"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </div>
          <span
            className={[
              "text-[16px] font-semibold transition-colors duration-200",
              isProfileActive
                ? "text-brand-primary-200"
                : "text-brand-neutral-25",
            ].join(" ")}
          >
            Profile
          </span>
        </button>
      </div>
    </div>
  );
}
