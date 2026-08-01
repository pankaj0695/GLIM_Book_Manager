import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { validateLogin } from "@/lib/validation";
import { User } from "@/models/User";

export async function POST(request: Request) {
  const parsed = validateLogin(await request.json().catch(() => null));

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    await connectDB();

    const user = await User.findOne({ email }).select("+password");
    const matches = user ? await verifyPassword(password, user.password) : false;

    if (!user || !matches) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }

    await createSession({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not sign you in. Please try again." },
      { status: 500 }
    );
  }
}
