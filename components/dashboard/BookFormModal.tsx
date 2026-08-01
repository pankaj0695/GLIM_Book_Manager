"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
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
  };
}

export function BookFormModal({ book, onClose, onSubmit }: BookFormModalProps) {
  const [values, setValues] = useState(() => initialValues(book));
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
