"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import { StackIcon, STATUS_ICONS } from "@/components/icons";
import { cn } from "@/lib/cn";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import type { Book } from "@/types";

function useCountUp(value: number) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;

    if (from === value) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || Math.abs(value - from) > 40) {
      setDisplay(value);
      return;
    }

    const duration = 420;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return display;
}

function StatCard({
  label,
  icon: Icon,
  value,
  tone,
  delay,
}: {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value: number;
  tone: "ink" | "paper";
  delay: number;
}) {
  const display = useCountUp(value);

  return (
    <div
      className={cn(
        "brut shadow-brut lift animate-rise px-4 py-3",
        tone === "ink" ? "bg-ink text-surface" : "bg-paper"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <p
        className={cn(
          "flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest",
          tone === "ink" ? "opacity-70" : "text-ink/60"
        )}
      >
        <Icon />
        <span className="truncate">{label}</span>
      </p>
      <p className="text-xl font-extrabold tracking-tight tabular-nums">{display}</p>
    </div>
  );
}

export function StatsBar({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        label="Total"
        icon={StackIcon}
        value={books.length}
        tone="ink"
        delay={0}
      />
      {STATUS_ORDER.map((status, index) => (
        <StatCard
          key={status}
          label={STATUS_META[status].label}
          icon={STATUS_ICONS[status]}
          value={books.filter((book) => book.status === status).length}
          tone="paper"
          delay={(index + 1) * 60}
        />
      ))}
    </div>
  );
}
