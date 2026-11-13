"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Pencil,
  Trash2,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  AlertTriangle,
  Bookmark,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

export type Book = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: string | number;
  bookImage: string;
  shortDescription: string;
  userName?: string;
  userEmail?: string;
  addedBy?: { name?: string; email?: string } | string;
};

interface MyBooksClientProps {
  initialBooks: Book[];
  userEmail: string;
}

const categories = [
  { value: "Fiction", label: "Fiction" },
  { value: "Science", label: "Science" },
  { value: "History", label: "History" },
  { value: "Kids", label: "Kids" },
];

export function MyBooksClient({ initialBooks, userEmail }: MyBooksClientProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({
    bookTitle: "",
    authorName: "",
    category: "Fiction",
    totalCopies: "1",
    bookImage: "",
    shortDescription: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Modal State
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered books based on search & category
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        (book.bookTitle || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (book.authorName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (book.category || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  // Open Edit Modal with pre-filled book details
  const handleStartEdit = (book: Book) => {
    setEditingBook(book);
    setEditForm({
      bookTitle: book.bookTitle || "",
      authorName: book.authorName || "",
      category: book.category || "Fiction",
      totalCopies: String(book.totalCopies ?? "1"),
      bookImage: book.bookImage || "",
      shortDescription: book.shortDescription || "",
    });
  };

  // Submit Edit to PATCH /my-books/:id
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setIsSavingEdit(true);
    try {
      const payload = {
        bookTitle: editForm.bookTitle.trim(),
        authorName: editForm.authorName.trim(),
        category: editForm.category,
        totalCopies: Math.max(0, Number(editForm.totalCopies) || 0),
        bookImage: editForm.bookImage.trim(),
        shortDescription: editForm.shortDescription.trim(),
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        // Update local state immediately
        setBooks((prev) =>
          prev.map((b) =>
            b._id === editingBook._id ? { ...b, ...payload } : b
          )
        );
        toast.success("Book updated successfully!");
        setEditingBook(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to update book.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book. Please check your connection.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Delete Modal
  const handleStartDelete = (book: Book) => {
    setDeletingBook(book);
  };

  // Submit Delete to DELETE /my-books/:id
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/my-books/${deletingBook._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        // Remove from local state immediately
        setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
        toast.success("Book deleted successfully!");
        setDeletingBook(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to delete book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-body pb-20">
      {/* Header Section */}
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>Editorial Library • Member Shelf</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-heading tracking-tight">
              My Added Books
            </h1>
            <p className="text-sm text-slate">
              Volumes and stories you have contributed to the BookNook library
              collection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl border border-beige bg-paper/60 p-1">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-card text-ink shadow-xs font-semibold"
                    : "text-slate hover:text-heading"
                }`}
                title="Table View"
              >
                <TableIcon className="size-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-card text-ink shadow-xs font-semibold"
                    : "text-slate hover:text-heading"
                }`}
                title="Card View"
              >
                <LayoutGrid className="size-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {/* Add Book CTA */}
            <Link href="/add-book">
              <Button className="h-10 bg-terracotta text-white hover:bg-terracotta-hover font-medium rounded-xl px-4 cursor-pointer flex items-center gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Add New Book</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate/70" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 rounded-xl border border-beige bg-card pl-10 pr-4 text-sm text-heading placeholder:text-slate/60 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-heading cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["all", "Fiction", "Science", "History", "Kids"].map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer capitalize ${
                    active
                      ? "bg-ink text-white font-semibold shadow-xs"
                      : "bg-card border border-beige text-slate hover:text-heading hover:bg-paper"
                  }`}
                >
                  {cat === "all" ? "All Shelves" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate mb-4 px-1">
          <span>
            Showing{" "}
            <strong className="text-heading font-semibold">
              {filteredBooks.length}
            </strong>{" "}
            {filteredBooks.length === 1 ? "book" : "books"}
          </span>
          <span>Logged in as: {userEmail}</span>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-beige bg-card p-12 text-center shadow-xs max-w-lg mx-auto my-12">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-sage/20 text-ink mb-4 shadow-inner">
              <BookOpen className="size-7 text-ink" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-heading">
              {books.length === 0 ? "No Books Added Yet" : "No Matching Books"}
            </h3>
            <p className="mt-2 text-sm text-slate leading-relaxed">
              {books.length === 0
                ? "You haven't added any books to the BookNook collection yet. Share your favorite stories with our community of readers!"
                : "No books match your current search and filter criteria. Try clearing your search."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {books.length === 0 ? (
                <Link href="/add-book">
                  <Button className="bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl px-5 cursor-pointer flex items-center gap-2">
                    <Plus className="size-4" />
                    <span>Add Your First Book</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="border-beige text-slate hover:text-heading h-10 rounded-xl cursor-pointer"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="rounded-2xl border border-beige bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-paper/70 border-b border-beige">
                  <TableRow className="border-beige hover:bg-transparent">
                    <TableHead className="w-[80px] font-semibold text-heading text-xs uppercase tracking-wider">
                      Cover
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider min-w-[200px]">
                      Book & Author
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider">
                      Copies
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider hidden md:table-cell max-w-[280px]">
                      Synopsis
                    </TableHead>
                    <TableHead className="font-semibold text-heading text-xs uppercase tracking-wider text-right pr-6 min-w-[140px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => (
                    <TableRow
                      key={book._id}
                      className="border-beige hover:bg-paper/40 transition-colors"
                    >
                      {/* Cover Thumbnail */}
                      <TableCell className="py-3 pl-4">
                        <div className="relative aspect-[3/4] w-12 overflow-hidden rounded-lg bg-paper border border-beige/80 shadow-xs">
                          {book.bookImage ? (
                            <Image
                              src={book.bookImage}
                              alt={book.bookTitle}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate">
                              <BookOpen className="size-5 opacity-50" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Title & Author */}
                      <TableCell className="py-3">
                        <Link
                          href={`/books/${book._id}`}
                          className="font-display font-semibold text-heading hover:text-terracotta text-base leading-snug transition-colors line-clamp-1 inline-flex items-center gap-1 group"
                        >
                          <span>{book.bookTitle}</span>
                          <ExternalLink className="size-3 text-slate opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-xs text-slate mt-0.5">
                          by {book.authorName}
                        </p>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 border border-sage/30 px-2.5 py-0.5 text-xs font-semibold text-ink">
                          {book.category}
                        </span>
                      </TableCell>

                      {/* Copies */}
                      <TableCell className="py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-heading rounded-md bg-paper border border-beige px-2.5 py-1">
                          <Layers className="size-3 text-amber" />
                          <span>{book.totalCopies || 1}</span>
                        </span>
                      </TableCell>

                      {/* Synopsis */}
                      <TableCell className="py-3 hidden md:table-cell max-w-[280px]">
                        <p className="text-xs text-slate line-clamp-2 leading-relaxed">
                          {book.shortDescription || "No synopsis provided."}
                        </p>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 text-right pr-4">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(book)}
                            className="h-8 border-beige text-heading hover:border-terracotta hover:text-terracotta hover:bg-paper rounded-lg px-2.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <Pencil className="size-3.5" />
                            <span className="text-xs">Edit</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartDelete(book)}
                            className="h-8 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 rounded-lg px-2.5 cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="group rounded-2xl border border-beige bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper/60 border-b border-beige">
                  {book.bookImage ? (
                    <Image
                      src={book.bookImage}
                      alt={book.bookTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate">
                      <BookOpen className="size-12 opacity-40" />
                    </div>
                  )}
                  {/* Category Chip */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md border border-beige px-2.5 py-0.5 text-xs font-semibold text-heading shadow-xs">
                      <Bookmark className="size-3 text-terracotta" />
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link
                      href={`/books/${book._id}`}
                      className="font-display font-semibold text-heading text-lg leading-snug line-clamp-2 hover:text-terracotta transition-colors"
                    >
                      {book.bookTitle}
                    </Link>
                    <p className="text-xs text-slate">by {book.authorName}</p>

                    <p className="text-xs text-slate line-clamp-3 leading-relaxed pt-2">
                      {book.shortDescription || "No synopsis available."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-beige/60 flex items-center justify-between text-xs text-slate">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="size-3.5 text-sage" />
                      <span>{book.totalCopies || 1} Copies Available</span>
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="bg-paper/40 p-4 border-t border-beige flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStartEdit(book)}
                    className="flex-1 h-9 border-beige text-heading hover:border-terracotta hover:text-terracotta hover:bg-card rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="size-3.5" />
                    <span>Edit Book</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleStartDelete(book)}
                    className="flex-1 h-9 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 rounded-xl text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Book Modal */}
      <Dialog
        open={!!editingBook}
        onOpenChange={(open) => {
          if (!open) setEditingBook(null);
        }}
      >
        <DialogContent className="sm:max-w-lg bg-card border-beige p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-terracotta mb-1">
              <Pencil className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Edit Book Record
              </span>
            </div>
            <DialogTitle className="font-display text-2xl font-semibold text-heading">
              Update Book Information
            </DialogTitle>
            <DialogDescription className="text-slate text-xs">
              Make changes to your book details below and save to update the
              catalog record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-heading">
                  Book Title
                </FieldLabel>
                <Input
                  required
                  placeholder="e.g. The Great Gatsby"
                  value={editForm.bookTitle}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bookTitle: e.target.value })
                  }
                  className="rounded-xl border-beige"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-heading">
                  Author Name
                </FieldLabel>
                <Input
                  required
                  placeholder="e.g. F. Scott Fitzgerald"
                  value={editForm.authorName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, authorName: e.target.value })
                  }
                  className="rounded-xl border-beige"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-heading">
                  Category
                </FieldLabel>
                <Select
                  value={editForm.category}
                  items={categories}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, category: val as string })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-beige bg-card">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-beige rounded-xl">
                    <SelectGroup>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-heading">
                  Total Copies
                </FieldLabel>
                <Input
                  type="number"
                  min="1"
                  required
                  placeholder="1"
                  value={editForm.totalCopies}
                  onChange={(e) =>
                    setEditForm({ ...editForm, totalCopies: e.target.value })
                  }
                  className="rounded-xl border-beige"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-heading">
                Book Image URL
              </FieldLabel>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editForm.bookImage}
                onChange={(e) =>
                  setEditForm({ ...editForm, bookImage: e.target.value })
                }
                className="rounded-xl border-beige text-xs"
              />
              {editForm.bookImage && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-beige/60 bg-paper/40 p-2">
                  <div className="relative aspect-[3/4] w-10 overflow-hidden rounded bg-paper">
                    <Image
                      src={editForm.bookImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs text-slate truncate">
                    Image preview loaded
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-heading">
                Short Description / Synopsis
              </FieldLabel>
              <Textarea
                rows={3}
                placeholder="Brief summary of the book..."
                value={editForm.shortDescription}
                onChange={(e) =>
                  setEditForm({ ...editForm, shortDescription: e.target.value })
                }
                className="rounded-xl border-beige resize-none text-sm"
              />
            </div>

            <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingBook(null)}
                className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSavingEdit}
                className="w-full sm:flex-1 bg-terracotta text-white hover:bg-terracotta-hover h-11 rounded-xl font-medium cursor-pointer shadow-xs"
              >
                {isSavingEdit ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal (Custom Modal, NOT browser confirm) */}
      <Dialog
        open={!!deletingBook}
        onOpenChange={(open) => {
          if (!open) setDeletingBook(null);
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border-beige p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <div className="mx-auto flex size-13 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <DialogTitle className="font-display text-2xl font-semibold text-center text-heading">
              Confirm Book Deletion
            </DialogTitle>
            <DialogDescription className="text-center text-slate text-sm leading-relaxed">
              Are you sure you want to delete this volume from your shelf? This
              action will permanently remove it from the BookNook catalog.
            </DialogDescription>
          </DialogHeader>

          {deletingBook && (
            <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 my-2 text-sm">
              <span className="text-[10px] font-bold tracking-wider text-destructive uppercase">
                Volume to be removed
              </span>
              <h4 className="font-display text-base font-semibold text-heading mt-0.5 line-clamp-1">
                {deletingBook.bookTitle}
              </h4>
              <p className="text-xs text-slate">by {deletingBook.authorName}</p>
            </div>
          )}

          <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex flex-col-reverse sm:flex-row gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingBook(null)}
              className="w-full sm:flex-1 border-beige text-slate hover:text-heading hover:bg-paper h-11 rounded-xl cursor-pointer font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="w-full sm:flex-1 bg-destructive text-white hover:bg-destructive/90 h-11 rounded-xl font-medium cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="size-4" />
              <span>{isDeleting ? "Deleting..." : "Yes, Delete Book"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
