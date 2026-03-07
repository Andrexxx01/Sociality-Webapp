export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-display-md font-semibold">Page not found</h1>
        <p className="mt-2 text-brand-neutral-500">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
