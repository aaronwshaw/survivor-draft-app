import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  userId?: string;
  playerId?: string;
  tribeId?: string | null;
  eliminated?: number | null;
};

type TribeLookup = {
  findUnique: (args: { where: { id: string }; select: { id: true } }) => Promise<{ id: string } | null>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const userId = String(body?.userId || "");
  const playerId = String(body?.playerId || "");
  const tribeId = body?.tribeId === null || body?.tribeId === "" ? null : String(body?.tribeId || "");
  const eliminatedRaw = body?.eliminated;
  const eliminated =
    eliminatedRaw == null || Number(eliminatedRaw) <= 0 ? null : Math.max(1, Math.floor(Number(eliminatedRaw)));

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

  const player = await prisma.player.update({
    where: { id: playerId },
    data: { tribe: tribeId, eliminated },
    select: { id: true, tribe: true, eliminated: true },
  });

  return NextResponse.json({ player });
}
