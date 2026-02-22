import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TribeRow = { id: string; name: string; color: string };
type TribeLookup = {
  findMany: (args: {
    orderBy: { name: "asc" };
    select: { id: true; name: true; color: true };
  }) => Promise<TribeRow[]>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = String(searchParams.get("userId") || "");
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isOwner: true },
  });
  if (!user?.isOwner) {
    return NextResponse.json({ error: "Only owners can manage survivor data." }, { status: 403 });
  }

  const [tribes, players] = await Promise.all([
    (prisma as unknown as { tribe: TribeLookup }).tribe.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
    prisma.player.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, photoUrl: true, age: true, tribe: true, eliminated: true, seasons: true },
    }),
  ]);

  return NextResponse.json({ tribes, players });
}
