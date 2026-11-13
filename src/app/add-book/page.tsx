"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Library,
} from "lucide-react";
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
import { useSession } from "@/lib/auth-client";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleBookSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        totalCopies: Math.max(1, parseInt(form.totalCopies, 10) || 1),
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

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Book added to the library collection successfully!");
        router.push("/books");
      } else {
        toast.error(result.message || "Failed to add book.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const curatorName = session?.user?.name || "Community Curator";
  const curatorEmail = session?.user?.email || "curator@booknook.lib";

  return (
    <div className="min-h-screen bg-paper text-body pb-20">
      {/* Editorial Header Section */}
      <header className="border-b border-beige bg-card py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-terracotta">
              <Sparkles className="size-3.5" />
              <span>Community Contributions • Expand The Library</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading">
              Add a Book
            </h1>
            <p className="text-sm sm:text-base text-slate leading-relaxed">
              Place a treasured volume from your own personal collection into our
              shared shelves for fellow readers to borrow and cherish.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/books">
              <Button
                variant="outline"
                className="h-11 border-beige bg-card text-heading hover:bg-paper hover:text-ink font-semibold rounded-xl px-5 cursor-pointer flex items-center gap-2 shadow-xs transition-colors"
              >
                <Library className="size-4 text-slate" />
                <span>Browse All Books</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Form Card */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-beige bg-card p-6 sm:p-10 shadow-[0_8px_30px_rgba(36,52,71,0.06)] space-y-6">
          <div className="pb-4 border-b border-beige/60">
            <h2 className="font-display text-2xl font-bold text-heading">
              Book Information
            </h2>
            <p className="text-xs text-slate mt-1">
              Fill in the bibliographical details below to register this volume in
              the BookNook library archive.
            </p>
          </div>

          <form onSubmit={handleBookSubmit} className="space-y-6">
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <FieldLabel htmlFor="bookTitle" className="text-xs font-semibold text-heading">
                  Book Title <span className="text-terracotta">*</span>
                </FieldLabel>
                <Input
                  id="bookTitle"
                  placeholder="e.g. The Shadow of the Wind"
                  required
                  value={form.bookTitle}
                  onChange={(e) => update("bookTitle", e.target.value)}
                  className="h-11 rounded-xl border-beige bg-paper/50 text-heading text-sm placeholder:text-slate/60 focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="authorName" className="text-xs font-semibold text-heading">
                  Author Name <span className="text-terracotta">*</span>
                </FieldLabel>
                <Input
                  id="authorName"
                  placeholder="e.g. Carlos Ruiz Zafón"
                  required
                  value={form.authorName}
                  onChange={(e) => update("authorName", e.target.value)}
                  className="h-11 rounded-xl border-beige bg-paper/50 text-heading text-sm placeholder:text-slate/60 focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            {/* Category & Total Copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-heading">
                  Category <span className="text-terracotta">*</span>
                </FieldLabel>
                <Select
                  defaultValue="Fiction"
                  items={categories}
                  onValueChange={(value) =>
                    update("category", value as string)
                  }
                >
                  <SelectTrigger className="w-full h-11 rounded-xl border-beige bg-paper/50 text-heading text-sm px-3.5 focus:border-terracotta focus:ring-terracotta/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-beige rounded-xl shadow-lg">
                    <SelectGroup>
                      {categories.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="text-sm text-heading hover:bg-paper cursor-pointer rounded-lg"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="totalCopies" className="text-xs font-semibold text-heading">
                  Total Copies <span className="text-terracotta">*</span>
                </FieldLabel>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  min="1"
                  placeholder="e.g. 3"
                  required
                  value={form.totalCopies}
                  onChange={(e) =>
                    update(
                      "totalCopies",
                      Math.max(1, parseInt(e.target.value, 10) || 1).toString()
                    )
                  }
                  className="h-11 rounded-xl border-beige bg-paper/50 text-heading text-sm placeholder:text-slate/60 focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>
            </div>

            {/* Book Image URL */}
            <div className="space-y-1.5">
              <FieldLabel htmlFor="bookImage" className="text-xs font-semibold text-heading">
                Book Cover Image URL <span className="text-terracotta">*</span>
              </FieldLabel>
              <Input
                id="bookImage"
                type="url"
                placeholder="https://images.unsplash.com/photo-1544947950-fa07a98d237f..."
                value={form.bookImage}
                onChange={(event) => update("bookImage", event.target.value)}
                required
                className="h-11 rounded-xl border-beige bg-paper/50 text-heading text-sm placeholder:text-slate/60 focus:border-terracotta focus:ring-terracotta/20"
              />
              <p className="text-[11px] text-slate mt-1">
                Enter a direct image link (Unsplash, PostImg, or any public HTTPS URL).
              </p>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <FieldLabel htmlFor="shortDescription" className="text-xs font-semibold text-heading">
                Synopsis & Description
              </FieldLabel>
              <Textarea
                id="shortDescription"
                placeholder="Provide a compelling synopsis, summary, or thoughts about why readers will love this volume..."
                rows={4}
                className="rounded-xl border-beige bg-paper/50 text-heading text-sm placeholder:text-slate/60 resize-y focus:border-terracotta focus:ring-terracotta/20"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
              />
            </div>

            {/* Contributor Profile Card */}
            <div className="rounded-xl border border-beige/80 bg-paper/60 p-4 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white font-display text-sm font-bold shadow-xs">
                  {curatorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta block">
                    Curator / Added By
                  </span>
                  <span className="font-semibold text-heading text-sm">
                    {curatorName}
                  </span>
                  <span className="text-slate block text-[11px]">
                    {curatorEmail}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 border border-sage/30 px-2.5 py-1 text-xs font-semibold text-heading">
                <ShieldCheck className="size-3 text-sage" />
                <span>Verified Member</span>
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-terracotta text-white hover:bg-terracotta-hover h-12 rounded-xl text-base font-semibold shadow-[0_8px_24px_rgba(200,117,85,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="size-5" />
              <span>
                {isSubmitting ? "Adding Book to Catalog..." : "Add Book to Library"}
              </span>
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
