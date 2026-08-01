import type { BookStatus } from "@/types";

type StatusMeta = {
  label: string;
  badge: string;
  accent: string;
};

export const STATUS_META: Record<BookStatus, StatusMeta> = {
  "want-to-read": {
    label: "Want to Read",
    badge: "bg-primary text-ink",
    accent: "bg-primary",
  },
  reading: {
    label: "Reading",
    badge: "bg-secondary text-white",
    accent: "bg-secondary",
  },
  completed: {
    label: "Completed",
    badge: "bg-success text-white",
    accent: "bg-success",
  },
};

export const STATUS_ORDER: BookStatus[] = [
  "want-to-read",
  "reading",
  "completed",
];
