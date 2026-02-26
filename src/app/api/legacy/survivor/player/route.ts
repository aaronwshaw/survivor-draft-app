import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  userId?: string;
  playerId?: string;
  tribeId?: string | null;
  eliminated?: number | null;
  advantages?: string[] | null;
};

type TribeLookup = {
  findUnique: (args: { where: { id: string }; select: { id: true } }) => Promise<{ id: string } | null>;
};
type AdvantageLookup = {
  findMany: (args: {
    where: { advantageID: { in: string[] } };
    select: { advantageID: true };
  }) => Promise<Array<{ advantageID: string }>>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const userId = String(body?.userId || "");
  const playerId = String(body?.playerId || "");
  const tribeId = body?.tribeId === null || body?.tribeId === "" ? null : String(body?.tribeId || "");
  const eliminatedRaw = body?.eliminated;
  const eliminated =
    eliminatedRaw == null || Number(eliminatedRaw) <= 0 ? null : Math.max(1, Math.floor(Number(eliminatedRaw)));
  const advantagesRaw = Array.isArray(body?.advantages) ? body.advantages : null;
  const advantages = advantagesRaw
    ? advantagesRaw.map((id) => String(id || "").trim()).filter(Boolean)
    : null;

  if (!userId || !playerId) {
    return NextResponse.json({ error: "userId and playerId are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isOwner: true } });
  if (!user?.isOwner) {
    return NextResponse.json({ error: "Only owners can manage players." }, { status: 403 });
  }

  if (tribeId) {
    const tribeModel = (prisma as unknown as { tribe: TribeLookup }).tribe;
    const tribe = await tribeModel.findUnique({ where: { id: tribeId }, select: { id: true } });
    if (!tribe) {
      return NextResponse.json({ error: "Tribe not found." }, { status: 400 });
    }
  }

  if (advantages) {
    const uniqueIds = [...new Set(advantages)];
    if (uniqueIds.length > 0) {
      const advantageModel = (prisma as unknown as { advantage: AdvantageLookup }).advantage;
      const found = await advantageModel.findMany({
        where: { advantageID: { in: uniqueIds } },
        select: { advantageID: true },
      });
      if (found.length !== uniqueIds.length) {
        return NextResponse.json({ error: "One or more advantages are invalid." }, { status: 400 });
      }
    }
  }

  const existing = await prisma.player.findUnique({
    where: { id: playerId },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Player not found." }, { status: 404 });
  }

  const player = await prisma.$transaction(async (tx) => {
    const updated = await tx.player.update({
      where: { id: playerId },
      data: {
        tribe: tribeId,
        eliminated,
      },
      select: { id: true, tribe: true, eliminated: true },
    });

    if (advantages != null) {
      await tx.advantagePlayer.deleteMany({ where: { playerId } });
      if (advantages.length > 0) {
        await tx.advantagePlayer.createMany({
          data: [...new Set(advantages)].map((advantageID) => ({ playerId, advantageID })),
          skipDuplicates: true,
        });
      }
    }

    const links = await tx.advantagePlayer.findMany({
      where: { playerId },
      select: { advantageID: true },
    });
    return { ...updated, advantages: links.map((entry) => entry.advantageID) };
  });

  return NextResponse.json({ player });
}
