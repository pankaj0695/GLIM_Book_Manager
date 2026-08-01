"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

type Mode = "login" | "signup";

const COPY = {
  login: {
    eyebrow: "Welcome back to Glim",
    title: "Open your shelf",
    submit: "Log in",
    switchText: "New here?",
    switchCta: "Create an account",
    switchHref: "/signup",
    endpoint: "/api/auth/login",
  },
  signup: {
    eyebrow: "Start your shelf on Glim",
    title: "Create an account",
    submit: "Sign up",
    switchText: "Already have a shelf?",
    switchCta: "Log in",
    switchHref: "/login",
    endpoint: "/api/auth/signup",
  },
} as const;

export function AuthForm({ mode, next }: { mode: Mode; next?: string }) {
  const router = useRouter();
  const copy = COPY[mode];

  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(copy.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup" ? values : { email: values.email, password: values.password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.replace(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="brut shadow-brut-lg animate-rise w-full max-w-md overflow-hidden bg-paper"
      style={{ animationDelay: "120ms" }}
    >
      <div className="border-b-3 border-ink bg-primary px-5 py-4 sm:px-6 sm:py-5">
        <p className="font-mono text-xs font-bold uppercase tracking-widest">
          {copy.eyebrow}
        </p>
        <h1 className="text-xl font-extrabold tracking-tight">{copy.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6" noValidate>
        {mode === "signup" && (
          <Input
            label="Name"
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={values.name}
            onChange={update("name")}
            required
          />
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={update("email")}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="••••••••"
          hint={mode === "signup" ? "At least 8 characters." : undefined}
          value={values.password}
          onChange={update("password")}
          required
        />

        {error && (
          <p
            role="alert"
            className="brut bg-danger/10 px-3.5 py-2.5 text-xs font-bold text-danger"
          >
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {copy.submit}
        </Button>

        <p className="text-center text-xs text-ink/70">
          {copy.switchText}{" "}
          <Link
            href={copy.switchHref}
            className="font-extrabold text-secondary underline decoration-2 underline-offset-2"
          >
            {copy.switchCta}
          </Link>
        </p>
      </form>
    </div>
  );
}
