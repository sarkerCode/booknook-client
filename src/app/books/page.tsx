import { BookCard } from "@/components/BookCard";

type ApiBook = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  bookImage?: string;
  totalCopies?: number;
  shortDescription?: string;
};

type ApiResponse = {
  value: ApiBook[];
  Count: number;
};

export default async function BooksPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
    cache: "no-store",
  });

  let books: Array<{
    id: string | number;
    title: string;
    author: string;
    category: string;
    image?: string;
  }> = [];

  if (res.ok) {
    const data = (await res.json()) as ApiResponse;
    books = (data.value ?? []).map((book) => ({
      id: book._id,
      title: book.bookTitle,
      author: book.authorName,
      category: book.category,
      image: book.bookImage,
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
            All Books
          </h1>
          <p className="text-body mt-2 text-sm max-w-md">
            Explore our collection and find your next favorite story.
          </p>
        </div>
      </header>

      <main className="px-6 pb-12 max-w-7xl mx-auto w-full">
        {books.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-body text-muted-foreground">
              No books found. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
