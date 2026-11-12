"use client";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

const initialForm = {
  bookTitle: "",
  authorName: "",
  category: "Fiction",
  totalCopies: "1",
  bookImage: "",
  shortDescription: "",
};

const categories = [
  { value: "Fiction", label: "Fiction" },
  { value: "Science", label: "Science" },
  { value: "History", label: "History" },
  { value: "Kids", label: "Kids" },
];

export default function AddBookPage() {
  const [form, setForm] = useState(initialForm);
  const { data: session } = useSession();
  const router = useRouter();

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleBookSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        userName: session?.user?.name || "Anonymous",
        userEmail: session?.user?.email,
        addedBy: session?.user?.name
          ? {
              name: session.user.name,
              email: session.user.email,
            }
          : session?.user?.email || "Anonymous",
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        toast.success("Book added successfully!");
        router.push("/books");
      } else {
        toast.error("Failed to add book.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
            Add a Book
          </h1>
          <p className="text-body mt-2 text-sm">
            Put a book from your shelf into the library.
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 py-3 pb-12 max-w-2xl mx-auto w-full">
        <form onSubmit={handleBookSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <FieldLabel>Book Title</FieldLabel>
              <Input
                placeholder="Book Title"
                required
                value={form.bookTitle}
                onChange={(e) => update("bookTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Author Name</FieldLabel>
              <Input
                placeholder="Author Name"
                required
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <FieldLabel>Category</FieldLabel>
              <Select
                defaultValue="Fiction"
                items={categories}
                onValueChange={(value) =>
                  update("category", value as string)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FieldLabel>Total Copies</FieldLabel>
              <Input
                type="number"
                defaultValue="1"
                required
                value={form.totalCopies}
                onChange={(e) => update("totalCopies", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="bookImage">Book Image</FieldLabel>
            <div className="relative h-8 w-full min-w-0 rounded-lg border border-input bg-input/50 px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <input
                
                id="bookImage"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.bookImage}
                onChange={(event) => update("bookImage", event.target.value)}
                required
              />
             
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Short Description</FieldLabel>
            <Textarea
              placeholder="Short description of the book"
              className="resize-none"
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent-hover"
          >
            Add Book
          </Button>
        </form>
      </main>
    </div>
  );
}
