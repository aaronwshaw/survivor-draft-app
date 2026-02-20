import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function requireAdmin(leagueId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const membership = await prisma.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId } },
  });
  if (!membership || membership.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId };
}

export async function GET(_: Request, context: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await context.params;
  const auth = await requireAdmin(leagueId);
  if ("error" in auth) return auth.error;

  const rows = await prisma.membership.findMany({
    where: { leagueId },
    include: {
      user: { select: { id: true, email: true, displayName: true } },
      team: { select: { id: true, slotNumber: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const teams = await prisma.team.findMany({
    where: { leagueId },
    select: { id: true, slotNumber: true, name: true, ownerUserId: true },
    orderBy: { slotNumber: "asc" },
  });

  return NextResponse.json({
    assignments: rows.map((row) => ({
      userId: row.userId,
      name: row.user.displayName || row.user.email,
      email: row.user.email,
      teamId: row.teamId,
      teamLabel: row.team ? `Team ${row.team.slotNumber} (${row.team.name})` : "Unassigned",
    })),
    teams,
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await context.params;
  const auth = await requireAdmin(leagueId);
  if ("error" in auth) return auth.error;

  const body = (await request.json().catch(() => null)) as { userId?: string; teamId?: string } | null;
  const targetUserId = String(body?.userId || "");
  const targetTeamId = String(body?.teamId || "");
  if (!targetUserId || !targetTeamId) {
    return NextResponse.json({ error: "userId and teamId are required" }, { status: 400 });
  }

  const result: { ok: true } | { ok: false; message: string } = await prisma.$transaction(async (tx) => {
    const targetMembership = await tx.membership.findUnique({
      where: { leagueId_userId: { leagueId, userId: targetUserId } },
    });
    if (!targetMembership) throw new Error("User is not in this league.");

    const targetTeam = await tx.team.findFirst({
      where: { id: targetTeamId, leagueId },
    });
    if (!targetTeam) throw new Error("Target team not found.");

    const currentTeamId = targetMembership.teamId;
    const occupyingUserId =
      targetTeam.ownerUserId && targetTeam.ownerUserId !== targetUserId ? targetTeam.ownerUserId : null;

    if (currentTeamId && currentTeamId !== targetTeam.id) {
      await tx.team.update({
        where: { id: currentTeamId },
        data: { ownerUserId: null },
      });
    }

    await tx.team.update({
      where: { id: targetTeam.id },
      data: { ownerUserId: targetUserId },
    });
    await tx.membership.update({
      where: { id: targetMembership.id },
      data: { teamId: targetTeam.id },
    });

    if (occupyingUserId) {
      const occupyingMembership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId: occupyingUserId } },
      });
      if (!occupyingMembership) throw new Error("Target team owner is missing membership data.");

      if (currentTeamId && currentTeamId !== targetTeam.id) {
        await tx.team.update({
          where: { id: currentTeamId },
          data: { ownerUserId: occupyingUserId },
        });
        await tx.membership.update({
          where: { id: occupyingMembership.id },
          data: { teamId: currentTeamId },
        });
      } else {
        await tx.membership.update({
          where: { id: occupyingMembership.id },
          data: { teamId: null },
        });
      }
    }

    return { ok: true as const };
  }).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : "Unable to update assignment.";
    return { ok: false as const, message };
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
