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

function toTeamIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && !!item);
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
        select: {
          id: true,
          assignmentByPlayerId: true,
          draftOrderTeamIds: true,
          currentPickIndex: true,
          roundNumber: true,
          direction: true,
          isDraftActive: true,
        },
      });
      if (!draft) {
        const teamRows = await tx.team.findMany({
          where: { leagueId },
          select: { id: true },
          orderBy: { slotNumber: "asc" },
        });
        draft = await tx.draftState.create({
          data: {
            leagueId,
            assignmentByPlayerId: {},
            eliminationByPlayerId: {},
            draftOrderTeamIds: teamRows.map((row) => row.id),
            currentPickIndex: 0,
            roundNumber: 1,
            direction: 1,
            isDraftActive: false,
          },
          select: {
            id: true,
            assignmentByPlayerId: true,
            draftOrderTeamIds: true,
            currentPickIndex: true,
            roundNumber: true,
            direction: true,
            isDraftActive: true,
          },
        });
      }

      const assignmentByPlayerId = toAssignmentMap(draft.assignmentByPlayerId);
      const currentTeamId = assignmentByPlayerId[playerId] || null;
      const wasUnassigned = !currentTeamId;

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

      const playerCount = await tx.player.count();
      const picksMade = Object.keys(assignmentByPlayerId).length;
      let currentPickIndex = draft.currentPickIndex;
      let roundNumber = draft.roundNumber;
      let direction = draft.direction === -1 ? -1 : 1;
      let isDraftActive = draft.isDraftActive;
      const order = toTeamIdArray(draft.draftOrderTeamIds);

      if (teamId && isDraftActive && wasUnassigned && order.length > 0) {
        if (playerCount > 0 && picksMade >= playerCount) {
          isDraftActive = false;
        } else if (direction === 1) {
          if (currentPickIndex >= order.length - 1) {
            direction = -1;
            roundNumber += 1;
          } else {
            currentPickIndex += 1;
          }
        } else if (currentPickIndex <= 0) {
          direction = 1;
          roundNumber += 1;
        } else {
          currentPickIndex -= 1;
        }
      }

      const updated = await tx.draftState.update({
        where: { id: draft.id },
        data: {
          assignmentByPlayerId,
          currentPickIndex,
          roundNumber,
          direction,
          isDraftActive,
        },
        select: {
          assignmentByPlayerId: true,
          draftOrderTeamIds: true,
          currentPickIndex: true,
          roundNumber: true,
          direction: true,
          isDraftActive: true,
          updatedAt: true,
        },
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update player assignment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
