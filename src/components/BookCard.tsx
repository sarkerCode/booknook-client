"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BookCardProps {
  book: {
    id: string | number;
    title: string;
    author: string;
    category: string;
    image?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card
      className="border-border shadow-sm hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-input/50 rounded-lg">
        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="w-16 h-24 text-muted-foreground opacity-40" />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border text-[0.7rem] font-medium text-foreground tracking-tight">
          {book.category}
        </div>
      </div>
      <CardContent className="pb-4">
        <CardTitle className="font-display text-foreground text-lg leading-snug line-clamp-2">
          {book.title}
        </CardTitle>
        <p className="mt-1.5 text-sm text-body">
          by {book.author}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/books/${book.id}`}>
          <Button
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent-hover text-sm font-medium py-2.5 rounded-lg"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
