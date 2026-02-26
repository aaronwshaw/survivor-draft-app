import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Body = {
  userId?: string;
  advantageID?: string;
  name?: string;
  description?: string;
};

type AdvantageRow = { advantageID: string; name: string; description: string };
type AdvantageMutations = {
  update: (args: {
    where: { advantageID: string };
    data: { name: string; description: string };
    select: { advantageID: true; name: true; description: true };
  }) => Promise<AdvantageRow>;
  create: (args: {
    data: { advantageID: string; name: string; description: string };
    select: { advantageID: true; name: true; description: true };
  }) => Promise<AdvantageRow>;
};

function normalizeId(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || `adv-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const userId = String(body?.userId || "");
  const advantageID = String(body?.advantageID || "");
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();

  if (!userId) return NextResponse.json({ error: "userId is required." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Advantage name is required." }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Advantage description is required." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isOwner: true } });
  if (!user?.isOwner) {
    return NextResponse.json({ error: "Only owners can manage advantages." }, { status: 403 });
  }

  try {
    const advantageModel = (prisma as unknown as { advantage: AdvantageMutations }).advantage;
    const advantage = advantageID
      ? await advantageModel.update({
          where: { advantageID },
          data: { name, description },
          select: { advantageID: true, name: true, description: true },
        })
      : await advantageModel.create({
          data: { advantageID: normalizeId(name), name, description },
          select: { advantageID: true, name: true, description: true },
        });
    return NextResponse.json({ advantage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save advantage.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
