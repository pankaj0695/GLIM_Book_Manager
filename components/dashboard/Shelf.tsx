"use client";

import { useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { PlusIcon, SearchIcon, StackIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { BookCard } from "@/components/dashboard/BookCard";
import { BookFormModal } from "@/components/dashboard/BookFormModal";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { Filters, type StatusFilter } from "@/components/dashboard/Filters";
import { StatsBar } from "@/components/dashboard/StatsBar";
import {
  createBook,
  deleteBook,
  updateBook,
  type BookPayload,
} from "@/lib/books-client";
import type { Book, BookStatus, SortKey } from "@/types";

const SORTERS: Record<SortKey, (a: Book, b: Book) => number> = {
  recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title),
  author: (a, b) => a.author.localeCompare(b.author),
};

export function Shelf({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState(initialBooks);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const tags = useMemo(
    () => Array.from(new Set(books.flatMap((book) => book.tags))).sort(),
    [books]
  );

  const visibleBooks = useMemo(() => {
    const search = query.trim().toLowerCase();

    return books
      .filter((book) => status === "all" || book.status === status)
      .filter((book) => tag === "all" || book.tags.includes(tag))
      .filter((book) => {
        if (!search) return true;
        return (
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.tags.some((item) => item.includes(search))
        );
      })
      .sort(SORTERS[sort]);
  }, [books, query, status, tag, sort]);

  const filtersActive = query.trim() !== "" || status !== "all" || tag !== "all";

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setFormOpen(true);
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setTag("all");
  }

  async function handleSubmit(payload: BookPayload) {
    setError("");

    if (editing) {
      const updated = await updateBook(editing.id, payload);
      setBooks((current) =>
        current.map((book) => (book.id === updated.id ? updated : book))
      );
    } else {
      const created = await createBook(payload);
      setBooks((current) => [created, ...current]);
    }

    setFormOpen(false);
    setEditing(null);
  }

  async function handleStatusChange(book: Book, next: BookStatus) {
    if (book.status === next) return;

    setError("");
    setBusyId(book.id);

    try {
      const updated = await updateBook(book.id, { status: next });
      setBooks((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Could not update status"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;

    setError("");

    try {
      await deleteBook(pendingDelete.id);
      setBooks((current) => current.filter((book) => book.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Could not delete this book"
      );
      setPendingDelete(null);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="animate-rise flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Your shelf
          </h1>
          {books.length > 0 && (
            <p className="text-sm text-ink/70">
              {visibleBooks.length} of {books.length}{" "}
              {books.length === 1 ? "book" : "books"}
            </p>
          )}
        </div>
        <Button onClick={openAdd} className="shrink-0">
          <PlusIcon />
          Add book
        </Button>
      </div>

      <StatsBar books={books} />

      {books.length > 0 && (
        <Filters
          query={query}
          status={status}
          tag={tag}
          sort={sort}
          tags={tags}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          onTagChange={setTag}
          onSortChange={setSort}
        />
      )}

      {error && (
        <p
          role="alert"
          className="brut shadow-brut bg-danger/10 px-4 py-3 text-sm font-bold text-danger"
        >
          {error}
        </p>
      )}

      {books.length === 0 ? (
        <EmptyState
          icon={StackIcon}
          title="Your shelf is empty"
          message="Add the first book you want to read. Title, author, done."
          action={
            <Button onClick={openAdd}>
              <PlusIcon />
              Add your first book
            </Button>
          }
        />
      ) : visibleBooks.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No books match"
          message="Try a different search term, tag or status."
          action={
            filtersActive && (
              <Button variant="ghost" onClick={resetFilters}>
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleBooks.map((book, index) => (
            <li key={book.id} className="flex">
              <BookCard
                book={book}
                index={index}
                busy={busyId === book.id}
                onStatusChange={(next) => handleStatusChange(book, next)}
                onEdit={() => openEdit(book)}
                onDelete={() => setPendingDelete(book)}
              />
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <BookFormModal
          book={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove this book?"
          message={`"${pendingDelete.title}" will be removed from your shelf. This cannot be undone.`}
          confirmLabel="Delete book"
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="brut shadow-brut animate-rise flex flex-col items-center gap-3 bg-paper px-5 py-12 text-center sm:px-6 sm:py-16">
      <span className="brut shadow-brut animate-float bg-surface p-3.5">
        <Icon className="size-8" />
      </span>
      <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
      <p className="max-w-sm text-sm text-ink/70">{message}</p>
      {action}
    </div>
  );
}
