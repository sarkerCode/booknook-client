export function MyBooksSkeleton() {
  return (
    <div className="min-h-screen bg-paper pb-20">
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-beige/50 animate-pulse rounded" />
            <div className="h-8 w-60 bg-beige/60 animate-pulse rounded-lg" />
            <div className="h-4 w-80 bg-beige/40 animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-beige/50 animate-pulse rounded-xl" />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="h-10 w-full max-w-md bg-card border border-beige rounded-xl animate-pulse mb-6" />
        <div className="rounded-2xl border border-beige bg-card p-6 space-y-4">
          <div className="h-8 w-full bg-beige/30 animate-pulse rounded-lg" />
          <div className="h-12 w-full bg-beige/20 animate-pulse rounded-lg" />
          <div className="h-12 w-full bg-beige/20 animate-pulse rounded-lg" />
          <div className="h-12 w-full bg-beige/20 animate-pulse rounded-lg" />
        </div>
      </main>
    </div>
  );
}

export default function MyBooksLoading() {
  return <MyBooksSkeleton />;
}
