import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type AssignBody = {
  userId?: string;
  leagueId?: string;
  playerId?: string;
  teamId?: string | null;
};

function toAssignmentMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" && raw) out[key] = raw;
  }
  return out;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AssignBody | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const playerId = String(body?.playerId || "");
  const teamIdRaw = body?.teamId;
  const teamId = teamIdRaw === null || teamIdRaw === "" ? null : String(teamIdRaw || "");

  if (!userId || !leagueId || !playerId) {
    return NextResponse.json({ error: "userId, leagueId, and playerId are required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const leagueMembership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId } },
        select: { role: true, teamId: true },
      });
      if (!leagueMembership) {
        throw new Error("You are not in this league.");
      }

      let draft = await tx.draftState.findUnique({
        where: { leagueId },
        select: { id: true, assignmentByPlayerId: true },
      });
      if (!draft) {
        draft = await tx.draftState.create({
          data: { leagueId, assignmentByPlayerId: {}, eliminationByPlayerId: {} },
          select: { id: true, assignmentByPlayerId: true },
        });
      }

      const assignmentByPlayerId = toAssignmentMap(draft.assignmentByPlayerId);
      const currentTeamId = assignmentByPlayerId[playerId] || null;

      const [currentTeam, targetTeam] = await Promise.all([
        currentTeamId
          ? tx.team.findFirst({
              where: { id: currentTeamId, leagueId },
              select: { id: true, ownerUserId: true },
            })
          : Promise.resolve(null),
        teamId
          ? tx.team.findFirst({
              where: { id: teamId, leagueId },
              select: { id: true, ownerUserId: true },
            })
          : Promise.resolve(null),
      ]);

      const isAdmin = leagueMembership.role === "admin";
      const canEditTeam = (teamOwnerUserId: string | null) => isAdmin || teamOwnerUserId === userId;

      if (!teamId) {
        if (!currentTeam || !canEditTeam(currentTeam.ownerUserId)) {
          throw new Error("You can only edit your own team.");
        }
        delete assignmentByPlayerId[playerId];
      } else {
        if (!targetTeam) throw new Error("Target team not found.");
        if (!canEditTeam(targetTeam.ownerUserId)) {
          throw new Error("You can only edit your own team.");
        }
        if (currentTeam && currentTeam.id !== targetTeam.id && !canEditTeam(currentTeam.ownerUserId)) {
          throw new Error("You can only edit your own team.");
        }
        assignmentByPlayerId[playerId] = targetTeam.id;
      }

      await tx.draftState.update({
        where: { id: draft.id },
        data: { assignmentByPlayerId },
      });

      return assignmentByPlayerId;
    });

    return NextResponse.json({ assignmentByPlayerId: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update player assignment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
