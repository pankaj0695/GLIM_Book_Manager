import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-12 sm:gap-8">
      <Link
        href="/"
        aria-label="Glim home"
        className="animate-rise rounded-brut inline-flex"
      >
        <Logo size="md" interactive />
      </Link>
      {children}
    </main>
  );
}
