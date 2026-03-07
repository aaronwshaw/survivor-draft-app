import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  userId?: string;
  leagueId?: string;
  text?: string;
};
type ChatMessageCreateLookup = {
  create: (args: {
    data: { leagueId: string; userId: string; text: string };
    select: { id: true; leagueId: true; userId: true; text: true; createdAt: true };
  }) => Promise<{ id: string; leagueId: string; userId: string; text: string; createdAt: Date }>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const text = String(body?.text || "").trim();

  if (!userId || !leagueId || !text) {
    return NextResponse.json({ error: "userId, leagueId, and text are required." }, { status: 400 });
  }
  if (text.length > 280) {
    return NextResponse.json({ error: "Message must be 280 characters or fewer." }, { status: 400 });
  }

  const membership = await prisma.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId } },
    select: { id: true },
  });
  if (!membership) {
    return NextResponse.json({ error: "You are not in this league." }, { status: 403 });
  }

  const chatClient = (prisma as unknown as { chatMessage?: ChatMessageCreateLookup }).chatMessage;
  if (!chatClient?.create) {
    return NextResponse.json({ error: "Chat is temporarily unavailable. Restart dev server and regenerate Prisma client." }, { status: 503 });
  }

  const message = await chatClient.create({
    data: { leagueId, userId, text },
    select: { id: true, leagueId: true, userId: true, text: true, createdAt: true },
  });

  return NextResponse.json({ message });
}
