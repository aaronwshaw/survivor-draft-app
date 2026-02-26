import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TribeRow = { id: string; name: string; color: string };
type TribeLookup = {
  findMany: (args: {
    orderBy: { name: "asc" };
    select: { id: true; name: true; color: true };
  }) => Promise<TribeRow[]>;
};
type AdvantageRow = { advantageID: string; name: string; description: string };
type AdvantageLookup = {
  findMany: (args: {
    orderBy: { name: "asc" };
    select: { advantageID: true; name: true; description: true };
  }) => Promise<AdvantageRow[]>;
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

  const [tribes, advantages, players] = await Promise.all([
    (prisma as unknown as { tribe: TribeLookup }).tribe.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
    (prisma as unknown as { advantage: AdvantageLookup }).advantage.findMany({
      orderBy: { name: "asc" },
      select: { advantageID: true, name: true, description: true },
    }),
    prisma.player.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        age: true,
        tribe: true,
        eliminated: true,
        vote: true,
        seasons: true,
        advantageLinks: {
          select: {
            advantageID: true,
            status: true,
            advantage: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const playersWithAdvantages = players.map((player) => ({
    ...player,
    vote: typeof player.vote === "boolean" ? player.vote : true,
    advantages: (player.advantageLinks || []).map((entry) => ({
      advantageID: entry.advantageID,
      status: entry.status,
      name: entry.advantage?.name || "",
    })),
  }));

  return NextResponse.json({ tribes, advantages, players: playersWithAdvantages });
}
