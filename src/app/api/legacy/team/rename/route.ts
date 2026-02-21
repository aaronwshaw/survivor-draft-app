import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RenameBody = {
  userId?: string;
  leagueId?: string;
  teamId?: string;
  name?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RenameBody | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const teamId = String(body?.teamId || "");
  const name = String(body?.name || "").trim();

  if (!userId || !leagueId || !teamId) {
    return NextResponse.json({ error: "userId, leagueId, and teamId are required." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Team name is required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId } },
        select: { role: true },
      });
      if (!membership) throw new Error("You are not in this league.");

      const team = await tx.team.findFirst({
        where: { id: teamId, leagueId },
        select: { id: true, ownerUserId: true },
      });
      if (!team) throw new Error("Team not found.");

      const canEdit = membership.role === "admin" || team.ownerUserId === userId;
      if (!canEdit) throw new Error("You can only edit your own team.");

      return tx.team.update({
        where: { id: team.id },
        data: { name },
        select: { id: true, name: true },
      });
    });

    return NextResponse.json({ team: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to rename team.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
