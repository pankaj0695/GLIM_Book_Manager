import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function HomePage() {
  const session = await getSession();

  if (session) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center sm:gap-10">
        <div
          className="animate-rise brut shadow-brut-lg bg-paper p-4 sm:p-5"
          style={{ animationDelay: "60ms" }}
        >
          <Image
            src="/glim-mark.png"
            alt="Glim"
            width={160}
            height={160}
            className="animate-float size-20 object-contain sm:size-28"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex w-fit flex-col gap-2">
            <h1
              className="animate-rise text-[clamp(4rem,20vw,10rem)] font-black leading-[0.85] tracking-tighter"
              style={{ animationDelay: "160ms" }}
            >
              Glim
            </h1>
            <span
              className="animate-underline block h-2.5 w-full rounded-full bg-primary"
              aria-hidden="true"
            />
          </div>
          <p
            className="animate-rise ps-[0.3em] font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink/70 sm:text-sm"
            style={{ animationDelay: "260ms" }}
          >
            Personal book manager
          </p>
        </div>

        <div
          className="animate-rise flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          style={{ animationDelay: "360ms" }}
        >
          <Link
            href="/signup"
            className="brut shadow-brut press w-full bg-primary px-8 py-3.5 text-sm font-extrabold tracking-tight sm:w-auto"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="brut shadow-brut press w-full bg-paper px-8 py-3.5 text-sm font-extrabold tracking-tight sm:w-auto"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
