import Header from "@/components/layout/header";

export default function FeedPage() {
  return (
    <main className="min-h-dvh bg-black text-brand-neutral-25">
      <Header />
      <div className="mx-auto max-w-7xl px-3 pt-17.5 md:px-6 md:pt-18.5">
        <div className="mx-auto max-w-115">
          <p className="text-sm text-brand-neutral-500">Feed content here...</p>
        </div>
      </div>
    </main>
  );
}
