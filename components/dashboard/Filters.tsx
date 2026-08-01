"use client";

import { SearchIcon, StackIcon, STATUS_ICONS } from "@/components/icons";
import { cn } from "@/lib/cn";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { BookStatus, SortKey } from "@/types";

export type StatusFilter = BookStatus | "all";

type FiltersProps = {
  query: string;
  status: StatusFilter;
  tag: string;
  sort: SortKey;
  tags: string[];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
};

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Newest",
  title: "Title A–Z",
  author: "Author A–Z",
};

const selectClass =
  "brut w-full cursor-pointer bg-surface px-3 py-2.5 text-sm font-bold transition-shadow focus:shadow-brut focus:outline-none";

export function Filters({
  query,
  status,
  tag,
  sort,
  tags,
  onQueryChange,
  onStatusChange,
  onTagChange,
  onSortChange,
}: FiltersProps) {
  const statusOptions: StatusFilter[] = ["all", ...STATUS_ORDER];

  return (
    <section className="brut shadow-brut animate-rise space-y-3 bg-paper p-3.5 sm:p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <label htmlFor="shelf-search" className="sr-only">
            Search your shelf
          </label>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/50" />
          <input
            id="shelf-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by title, author or tag"
            className="brut w-full bg-surface py-2.5 pl-10 pr-3 text-sm font-medium transition-shadow placeholder:text-ink/40 focus:shadow-brut focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:contents">
          <div>
            <label htmlFor="shelf-tag" className="sr-only">
              Filter by tag
            </label>
            <select
              id="shelf-tag"
              value={tag}
              onChange={(event) => onTagChange(event.target.value)}
              className={selectClass}
            >
              <option value="all">All tags</option>
              {tags.map((item) => (
                <option key={item} value={item}>
                  #{item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="shelf-sort" className="sr-only">
              Sort books
            </label>
            <select
              id="shelf-sort"
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortKey)}
              className={selectClass}
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by reading status"
        className="-mx-1 flex flex-wrap gap-2 px-1"
      >
        {statusOptions.map((option) => {
          const active = status === option;
          const label = option === "all" ? "All" : STATUS_META[option].label;
          const Icon = option === "all" ? StackIcon : STATUS_ICONS[option];

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onStatusChange(option)}
              className={cn(
                "brut press inline-flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold sm:py-1.5",
                active
                  ? cn(
                      "shadow-brut",
                      option === "all" ? "bg-ink text-surface" : STATUS_META[option].badge
                    )
                  : "bg-surface"
              )}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
