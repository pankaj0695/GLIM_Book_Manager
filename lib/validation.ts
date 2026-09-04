import { BOOK_STATUSES, BookStatus } from "@/models/Book";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type BookInput = {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  rating?: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isBookStatus(value: unknown): value is BookStatus {
  return BOOK_STATUSES.includes(value as BookStatus);
}

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 5
  );
}

export function normalizeTags(value: unknown): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const cleaned = raw
    .map((tag) => asString(tag).toLowerCase())
    .filter(Boolean)
    .slice(0, 8);

  return Array.from(new Set(cleaned));
}

export function validateSignup(body: unknown): ValidationResult<{
  name: string;
  email: string;
  password: string;
}> {
  const input = (body ?? {}) as Record<string, unknown>;
  const name = asString(input.name);
  const email = asString(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (name.length < 2) return { ok: false, error: "Name must be at least 2 characters" };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email address" };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters" };

  return { ok: true, data: { name, email, password } };
}

export function validateLogin(body: unknown): ValidationResult<{
  email: string;
  password: string;
}> {
  const input = (body ?? {}) as Record<string, unknown>;
  const email = asString(input.email).toLowerCase();
  const password = typeof input.password === "string" ? input.password : "";

  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: "Enter a valid email address" };
  if (!password) return { ok: false, error: "Password is required" };

  return { ok: true, data: { email, password } };
}

export function validateBook(body: unknown): ValidationResult<BookInput> {
  const input = (body ?? {}) as Record<string, unknown>;
  const title = asString(input.title);
  const author = asString(input.author);
  const status = input.status ?? "want-to-read";

  if (!title) return { ok: false, error: "Title is required" };
  if (title.length > 160) return { ok: false, error: "Title must be under 160 characters" };
  if (!author) return { ok: false, error: "Author is required" };
  if (author.length > 120) return { ok: false, error: "Author must be under 120 characters" };
  if (!isBookStatus(status)) return { ok: false, error: "Invalid reading status" };

  let rating = 0;
  if ("rating" in input && input.rating !== undefined && input.rating !== null) {
    if (!isValidRating(input.rating)) {
      return { ok: false, error: "Rating must be an integer between 0 and 5" };
    }
    rating = input.rating;
  }

  return {
    ok: true,
    data: { title, author, status, rating, tags: normalizeTags(input.tags) },
  };
}

export function validateBookPatch(body: unknown): ValidationResult<Partial<BookInput>> {
  const input = (body ?? {}) as Record<string, unknown>;
  const patch: Partial<BookInput> = {};

  if ("title" in input) {
    const title = asString(input.title);
    if (!title) return { ok: false, error: "Title is required" };
    if (title.length > 160) return { ok: false, error: "Title must be under 160 characters" };
    patch.title = title;
  }

  if ("author" in input) {
    const author = asString(input.author);
    if (!author) return { ok: false, error: "Author is required" };
    if (author.length > 120) return { ok: false, error: "Author must be under 120 characters" };
    patch.author = author;
  }

  if ("status" in input) {
    if (!isBookStatus(input.status)) return { ok: false, error: "Invalid reading status" };
    patch.status = input.status;
  }

  if ("tags" in input) {
    patch.tags = normalizeTags(input.tags);
  }

  if ("rating" in input) {
    if (!isValidRating(input.rating)) {
      return { ok: false, error: "Rating must be an integer between 0 and 5" };
    }
    patch.rating = input.rating;
  }

  if (Object.keys(patch).length === 0) {
    return { ok: false, error: "Nothing to update" };
  }

  return { ok: true, data: patch };
}
