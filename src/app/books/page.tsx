
import { Suspense } from "react";
import { BookCard } from "@/components/BookCard";

type ApiBook = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  bookImage?: string;
};

async function BooksContent() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
    cache: "no-store",
  });

  const data = await res.json();
  const books: ApiBook[] = data ?? [];

  return (
    <main className="px-6 pb-12 max-w-7xl mx-auto w-full">
      {books.length === 0 ? (
        <p className="text-center py-20">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={{
                id: book._id,
                title: book.bookTitle,
                author: book.authorName,
                category: book.category,
                image: book.bookImage,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-semibold">
            All Books
          </h1>
          <p className="mt-2 text-sm">
            Explore our collection and find your next favorite story.
          </p>
        </div>
      </header>

      <Suspense fallback={<p className="text-center py-20">Loading books...</p>}>
        <BooksContent />
      </Suspense>
    </div>
  );
}
