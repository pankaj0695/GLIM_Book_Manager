import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Shelf } from "@/components/dashboard/Shelf";
import { connectDB } from "@/lib/db";
import { serializeBook } from "@/lib/serialize";
import { getSession } from "@/lib/session";
import { Book } from "@/models/Book";

export const metadata: Metadata = {
  title: "Your shelf",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  await connectDB();

  const books = await Book.find({ user: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <>
      <Navbar
        user={{ id: session.userId, name: session.name, email: session.email }}
      />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Shelf initialBooks={books.map(serializeBook)} />
      </main>
    </>
  );
}
