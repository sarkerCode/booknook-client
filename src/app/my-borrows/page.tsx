import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { BookOpen, LogIn, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MyBorrowsClient, type BorrowRecord } from "./MyBorrowsClient";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

export const metadata = {
  title: "My Borrowed Books | BookNook Editorial Library",
  description:
    "View and manage your active borrowed books, check due dates, and return books to the BookNook library.",
};

function MyBorrowsSkeleton() {
  return (
    <div className="min-h-screen bg-paper pb-20">
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="h-4 w-44 bg-beige/50 animate-pulse rounded" />
            <div className="h-8 w-64 bg-beige/60 animate-pulse rounded-lg" />
            <div className="h-4 w-96 bg-beige/40 animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-beige/50 animate-pulse rounded-xl" />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="h-10 w-full max-w-md bg-card border border-beige rounded-xl animate-pulse mb-6" />
        <div className="rounded-2xl border border-beige bg-card p-6 space-y-4">
          <div className="h-8 w-full bg-beige/30 animate-pulse rounded-lg" />
          <div className="h-14 w-full bg-beige/20 animate-pulse rounded-lg" />
          <div className="h-14 w-full bg-beige/20 animate-pulse rounded-lg" />
          <div className="h-14 w-full bg-beige/20 animate-pulse rounded-lg" />
        </div>
      </main>
    </div>
  );
}

async function MyBorrowsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="min-h-[80vh] bg-paper flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full rounded-2xl border border-beige bg-card p-8 text-center shadow-[0_10px_30px_rgba(36,52,71,0.06)] space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sage/20 text-ink">
            <BookOpen className="size-7 text-ink" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.25em] text-terracotta uppercase">
            BookNook • Editorial Library
          </span>
          <h2 className="font-display text-2xl font-semibold text-heading">
            Sign In to View Your Borrows
          </h2>
          <p className="text-sm text-slate leading-relaxed">
            Please sign in to view the books you have borrowed, check return deadlines,
            and return books back to the library collection.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-ink text-white hover:bg-deep h-11 rounded-xl font-medium cursor-pointer flex items-center justify-center gap-2">
                <LogIn className="size-4" />
                <span>Sign In to Continue</span>
              </Button>
            </Link>
            <Link href="/books" className="w-full">
              <Button
                variant="outline"
                className="w-full border-beige text-slate hover:text-heading h-11 rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <Library className="size-4" />
                <span>Browse Library</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let borrows: BorrowRecord[] = [];

  const token = await getTokenFromServer();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-borrows/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      borrows = (await response.json()) as BorrowRecord[];
    }
  } catch (err) {
    console.error("Failed to fetch user borrows:", err);
  }

  return <MyBorrowsClient initialBorrows={borrows} userEmail={email} />;
}

export default function MyBorrowsPage() {
  return (
    <Suspense fallback={<MyBorrowsSkeleton />}>
      <MyBorrowsContent />
    </Suspense>
  );
}
