import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { username?: string; password?: string; displayName?: string }
      | null;
    const username = String(body?.username || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const displayName = String(body?.displayName || "").trim();

    if (!username) return NextResponse.json({ error: "Username is required." }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required." }, { status: 400 });
    if (!displayName) {
      return NextResponse.json({ error: "Display name is required for account creation." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: username } });
    if (existing) {
      return NextResponse.json({ error: "That username already exists. Please log in." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: username,
        displayName,
        passwordHash: hashPassword(password),
      },
      select: { id: true, email: true, displayName: true, isOwner: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2022") {
      return NextResponse.json(
        { error: "Database schema is out of date. Run migrations (prisma migrate deploy)." },
        { status: 500 },
      );
    }
    console.error("Legacy signup failed:", error);
    return NextResponse.json({ error: "Unable to create account right now." }, { status: 500 });
  }
}
