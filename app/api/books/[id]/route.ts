import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { serializeBook } from "@/lib/serialize";
import { getSession } from "@/lib/session";
import { validateBookPatch } from "@/lib/validation";
import { Book } from "@/models/Book";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/books/[id]">
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const parsed = validateBookPatch(await request.json().catch(() => null));

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await connectDB();

    const book = await Book.findOneAndUpdate(
      { _id: id, user: session.userId },
      parsed.data,
      { new: true, runValidators: true }
    );

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book: serializeBook(book) });
  } catch {
    return NextResponse.json(
      { error: "Could not update this book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/books/[id]">
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  try {
    await connectDB();

    const book = await Book.findOneAndDelete({ _id: id, user: session.userId });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete this book" },
      { status: 500 }
    );
  }
}
