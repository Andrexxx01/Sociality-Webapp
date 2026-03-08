import Header from "@/components/layout/header";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-black text-brand-neutral-25">
      <Header />
      <div className="px-4 pt-20">
        <p>Public homepage content</p>
      </div>
    </main>
  );
}
