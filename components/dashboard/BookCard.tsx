"use client";

import { STATUS_ICONS } from "@/components/icons";
import { cn } from "@/lib/cn";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { Book, BookStatus } from "@/types";

type BookCardProps = {
  book: Book;
  busy: boolean;
  index: number;
  onStatusChange: (status: BookStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function BookCard({
  book,
  busy,
  index,
  onStatusChange,
  onEdit,
  onDelete,
}: BookCardProps) {
  const meta = STATUS_META[book.status];
  const StatusIcon = STATUS_ICONS[book.status];

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
      className={cn(
        "brut shadow-brut lift animate-rise flex h-full w-full flex-col overflow-hidden bg-paper",
        busy && "pointer-events-none opacity-60"
      )}
    >
      <div className={cn("h-2.5 transition-colors", meta.accent)} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-extrabold leading-snug tracking-tight">
              {book.title}
            </h3>
            <p className="truncate text-sm text-ink/70">{book.author}</p>
          </div>
          <span
            className={cn(
              "brut inline-flex shrink-0 items-center gap-1.5 px-2 py-1 text-xs font-extrabold whitespace-nowrap",
              meta.badge
            )}
          >
            <StatusIcon />
            {meta.label}
          </span>
        </div>

        {book.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {book.tags.map((tag) => (
              <li
                key={tag}
                className="brut bg-surface px-2 py-0.5 font-mono text-xs font-bold"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto space-y-2.5 pt-1">
          <div
            role="group"
            aria-label={`Reading status for ${book.title}`}
            className="brut flex overflow-hidden"
          >
            {STATUS_ORDER.map((status, position) => {
              const Icon = STATUS_ICONS[status];

              return (
                <button
                  key={status}
                  type="button"
                  disabled={busy}
                  title={`Mark as ${STATUS_META[status].label}`}
                  aria-pressed={book.status === status}
                  onClick={() => onStatusChange(status)}
                  className={cn(
                    "flex flex-1 items-center justify-center px-2 py-2.5 text-base transition-colors duration-200 disabled:cursor-not-allowed sm:py-2",
                    position > 0 && "border-l-3 border-ink",
                    book.status === status
                      ? STATUS_META[status].badge
                      : "bg-paper text-ink/45 hover:bg-surface hover:text-ink"
                  )}
                >
                  <Icon />
                  <span className="sr-only">{STATUS_META[status].label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              disabled={busy}
              className="brut shadow-brut press flex-1 bg-surface px-3 py-2 text-xs font-extrabold"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="brut shadow-brut press flex-1 bg-danger/10 px-3 py-2 text-xs font-extrabold text-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
