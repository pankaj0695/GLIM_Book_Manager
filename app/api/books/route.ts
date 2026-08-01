import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { serializeBook } from "@/lib/serialize";
import { getSession } from "@/lib/session";
import { validateBook } from "@/lib/validation";
import { Book } from "@/models/Book";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await connectDB();

    const books = await Book.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ books: books.map(serializeBook) });
  } catch {
    return NextResponse.json(
      { error: "Could not load your books" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const parsed = validateBook(await request.json().catch(() => null));

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await connectDB();

    const book = await Book.create({ ...parsed.data, user: session.userId });

    return NextResponse.json({ book: serializeBook(book) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not save this book" },
      { status: 500 }
    );
  }
}
