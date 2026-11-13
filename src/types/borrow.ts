export interface BorrowRecord {
  _id: string;
  bookId?: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
  createdAt?: string | Date;
}

export interface BorrowPayload {
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  userEmail: string;
  userName?: string;
  borrowDate: string;
  returnDate: string;
}
