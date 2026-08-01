import type { BookStatus } from "@/models/Book";

export type { BookStatus };

export type Book = {
  id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type SortKey = "recent" | "title" | "author";
