import type { Book, BookStatus } from "@/types";

export type BookPayload = {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong");
  }

  return data as T;
}

export function createBook(payload: BookPayload) {
  return request<{ book: Book }>("/api/books", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => data.book);
}

export function updateBook(id: string, payload: Partial<BookPayload>) {
  return request<{ book: Book }>(`/api/books/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then((data) => data.book);
}

export function deleteBook(id: string) {
  return request<{ success: boolean }>(`/api/books/${id}`, { method: "DELETE" });
}
