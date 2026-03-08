import Image from "next/image";
import LoginForm from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black px-3 py-8 md:px-6 md:py-10">
      <Image
        src="/images/v-gradient-bg-mobile.svg"
        alt=""
        fill
        priority
        className="pointer-events-none absolute inset-0 z-0 object-contain  object-bottom md:hidden"
      />
      <Image
        src="/images/v-gradient-bg-desktop.svg"
        alt=""
        fill
        priority
        className="pointer-events-none absolute inset-0 z-0 hidden object-cover object-bottom md:block"
      />
      <div className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.1)_52%,rgba(0,0,0,0)_100%)]" />
      <LoginForm />
    </main>
  );
}
