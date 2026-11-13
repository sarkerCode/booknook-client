export interface IBook {
  id: string | number;
  title: string;
  author: string;
  category: string;
  image?: string;
  totalCopies?: string | number;
  shortDescription?: string;
}

export interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies?: string | number;
  bookImage?: string;
  shortDescription?: string;
  userName?: string;
  userEmail?: string;
  addedBy?: { name?: string; email?: string } | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type ApiBook = Book;
export type BookArrival = Book;

export interface BookCardItem {
  id: string | number;
  title: string;
  author: string;
  category: string;
  image?: string;
  totalCopies?: string | number;
  shortDescription?: string;
}

export interface BookCardProps {
  book: BookCardItem;
}
