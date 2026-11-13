import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { BookOpen, LogIn, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MyBooksClient, type Book } from "./MyBooksClient";
import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { MyBooksSkeleton } from "./loading";

export const metadata = {
  title: "My Added Books | BookNook Editorial Library",
  description:
    "View, update, or remove the books you have contributed to the BookNook library.",
};

async function MyBooksContent() {
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
            Sign In to View Your Shelf
          </h2>
          <p className="text-sm text-slate leading-relaxed">
            Please sign in to access, edit, and manage the books and stories you
            have contributed to the library.
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

  let books: Book[] = [];

  const token = await getTokenFromServer();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-books/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      books = (await response.json()) as Book[];
    }
  } catch (err) {
    console.error("Failed to fetch user books:", err);
  }

  return <MyBooksClient initialBooks={books} userEmail={email} />;
}

export default function MyBooksPage() {
  return (
    <Suspense fallback={<MyBooksSkeleton />}>
      <MyBooksContent />
    </Suspense>
  );
}
