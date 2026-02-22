import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  userId?: string;
  tribeId?: string;
  name?: string;
  color?: string;
};

type TribeRow = { id: string; name: string; color: string };
type TribeMutations = {
  update: (args: {
    where: { id: string };
    data: { name: string; color: string };
    select: { id: true; name: true; color: true };
  }) => Promise<TribeRow>;
  create: (args: {
    data: { id: string; name: string; color: string };
    select: { id: true; name: true; color: true };
  }) => Promise<TribeRow>;
};

function normalizeId(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || `tribe-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const userId = String(body?.userId || "");
  const tribeId = String(body?.tribeId || "");
  const name = String(body?.name || "").trim();
  const color = String(body?.color || "").trim() || "#999999";

  if (!userId) return NextResponse.json({ error: "userId is required." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Tribe name is required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isOwner: true } });
  if (!user?.isOwner) {
    return NextResponse.json({ error: "Only owners can manage tribes." }, { status: 403 });
  }

  try {
    const tribeModel = (prisma as unknown as { tribe: TribeMutations }).tribe;
    const tribe = tribeId
      ? await tribeModel.update({
          where: { id: tribeId },
          data: { name, color },
          select: { id: true, name: true, color: true },
        })
      : await tribeModel.create({
          data: { id: normalizeId(name), name, color },
          select: { id: true, name: true, color: true },
        });
    return NextResponse.json({ tribe });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save tribe.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
