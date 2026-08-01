"use client";

import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "brut w-full bg-paper px-3.5 py-2.5 text-sm font-medium placeholder:text-ink/40 focus:shadow-brut focus:outline-none";

type LabelledProps = {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  label,
  hint,
  error,
  className,
  ...props
}: LabelledProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(controlClass, error && "bg-danger/10", className)}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-bold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  hint,
  className,
  children,
  ...props
}: LabelledProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-extrabold uppercase tracking-wider">
        {label}
      </label>
      <select
        {...props}
        id={id}
        className={cn(controlClass, "cursor-pointer appearance-none", className)}
      >
        {children}
      </select>
      {hint && <p className="text-xs text-ink/60">{hint}</p>}
    </div>
  );
}
