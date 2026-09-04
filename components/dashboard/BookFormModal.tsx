"use client";

import { useState } from "react";
import { StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { BookPayload } from "@/lib/books-client";
import type { Book, BookStatus } from "@/types";

type BookFormModalProps = {
  book: Book | null;
  onClose: () => void;
  onSubmit: (payload: BookPayload) => Promise<void>;
};

function initialValues(book: Book | null) {
  return {
    title: book?.title ?? "",
    author: book?.author ?? "",
    tags: book?.tags.join(", ") ?? "",
    status: book?.status ?? ("want-to-read" as BookStatus),
    rating: book?.rating ?? 0,
  };
}

export function BookFormModal({ book, onClose, onSubmit }: BookFormModalProps) {
  const [values, setValues] = useState(() => initialValues(book));
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit({
        title: values.title.trim(),
        author: values.author.trim(),
        status: values.status,
        rating: values.rating,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not save this book"
      );
    } finally {
      setSaving(false);
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : values.rating;

  return (
    <Modal
      open
      title={book ? "Edit book" : "Add a book"}
      description={
        book ? "Update the details of this book." : "Three fields and it is on your shelf."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Title"
          value={values.title}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
          placeholder="The Pragmatic Programmer"
          maxLength={160}
          required
        />

        <Input
          label="Author"
          value={values.author}
          onChange={(event) => setValues({ ...values, author: event.target.value })}
          placeholder="Andrew Hunt"
          maxLength={120}
          required
        />

        <Input
          label="Tags"
          value={values.tags}
          onChange={(event) => setValues({ ...values, tags: event.target.value })}
          placeholder="craft, engineering"
          hint="Comma separated. Up to 8 tags."
        />

        <Select
          label="Reading status"
          value={values.status}
          onChange={(event) =>
            setValues({ ...values, status: event.target.value as BookStatus })
          }
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_META[status].label}
            </option>
          ))}
        </Select>

        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider">
            Rating
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="radiogroup"
              aria-label="Rating"
              className="brut flex overflow-hidden bg-paper"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star, index) => {
                const filled = star <= activeRating;
                const isSelected = values.rating === star;

                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        rating: prev.rating === star ? 0 : star,
                      }))
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    className={cn(
                      "flex items-center justify-center p-2.5 transition-colors duration-150 focus:outline-none",
                      index > 0 && "border-l-3 border-ink",
                      filled
                        ? "bg-primary text-ink"
                        : "bg-paper text-ink/40 hover:bg-surface hover:text-ink"
                    )}
                  >
                    <StarIcon filled={filled} className="size-5" />
                  </button>
                );
              })}
            </div>

            {values.rating > 0 ? (
              <button
                type="button"
                onClick={() => setValues((prev) => ({ ...prev, rating: 0 }))}
                className="brut press bg-surface px-2.5 py-1.5 text-xs font-bold text-ink/70 hover:text-ink"
              >
                Clear rating
              </button>
            ) : (
              <span className="text-xs font-medium text-ink/50">Unrated</span>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="brut bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {book ? "Save changes" : "Add to shelf"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
