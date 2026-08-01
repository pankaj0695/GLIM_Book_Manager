import type { Book } from "@/types";

type BookLike = {
  _id: { toString(): string };
  title: string;
  author: string;
  tags?: string[];
  status: Book["status"];
  createdAt: Date;
  updatedAt: Date;
};

export function serializeBook(book: BookLike): Book {
  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    tags: book.tags ?? [],
    status: book.status,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  };
}
