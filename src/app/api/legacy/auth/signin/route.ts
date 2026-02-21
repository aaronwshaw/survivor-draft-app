import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
    const username = String(body?.username || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!username) return NextResponse.json({ error: "Username is required." }, { status: 400 });
    if (!password) return NextResponse.json({ error: "Password is required." }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: username },
      select: { id: true, email: true, displayName: true, passwordHash: true },
    });
    if (!user || !user.passwordHash || user.passwordHash !== hashPassword(password)) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName || user.email },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2022") {
      return NextResponse.json(
        { error: "Database schema is out of date. Run migrations (prisma migrate deploy)." },
        { status: 500 },
      );
    }
    console.error("Legacy signin failed:", error);
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500 });
  }
}
