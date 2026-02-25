import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ConfigBody = {
  userId?: string;
  leagueId?: string;
  action?: "move" | "randomize" | "start" | "stop" | "reset";
  teamId?: string;
  direction?: -1 | 1;
};

function toTeamIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && !!item);
}

function toAssignmentMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" && raw) out[key] = raw;
  }
  return out;
}

function toPickOrderMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = Number(raw) || 0;
    if (n > 0) out[key] = Math.floor(n);
  }
  return out;
}

function toEliminationMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = Number(raw) || 0;
    if (n > 0) out[key] = n;
  }
  return out;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ConfigBody | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const action = body?.action;
  const teamId = String(body?.teamId || "");
  const moveDirection = body?.direction === -1 ? -1 : 1;

  if (!userId || !leagueId || !action) {
    return NextResponse.json({ error: "userId, leagueId, and action are required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId } },
        select: { role: true },
      });
      if (!membership || membership.role !== "admin") {
        throw new Error("Only admins can change draft settings.");
      }

      const teams = await tx.team.findMany({
        where: { leagueId },
        select: { id: true },
        orderBy: { slotNumber: "asc" },
      });
      const teamIds = teams.map((team) => team.id);

      let draft = await tx.draftState.findUnique({
        where: { leagueId },
        select: {
          id: true,
          assignmentByPlayerId: true,
          pickOrderByPlayerId: true,
          eliminationByPlayerId: true,
          draftOrderTeamIds: true,
          currentPickIndex: true,
          roundNumber: true,
          direction: true,
          isDraftActive: true,
        },
      });
      if (!draft) {
        draft = await tx.draftState.create({
          data: {
            leagueId,
            assignmentByPlayerId: {},
            pickOrderByPlayerId: {},
            eliminationByPlayerId: {},
            draftOrderTeamIds: teamIds,
            currentPickIndex: 0,
            roundNumber: 1,
            direction: 1,
            isDraftActive: false,
          },
          select: {
            id: true,
            assignmentByPlayerId: true,
            pickOrderByPlayerId: true,
            eliminationByPlayerId: true,
            draftOrderTeamIds: true,
            currentPickIndex: true,
            roundNumber: true,
            direction: true,
            isDraftActive: true,
          },
        });
      }

      let order = toTeamIdArray(draft.draftOrderTeamIds).filter((id) => teamIds.includes(id));
      if (order.length !== teamIds.length) {
        const set = new Set(order);
        for (const id of teamIds) {
          if (!set.has(id)) order.push(id);
        }
      }

      let assignmentByPlayerId = toAssignmentMap(draft.assignmentByPlayerId);
      let pickOrderByPlayerId = toPickOrderMap(draft.pickOrderByPlayerId);
      let eliminationByPlayerId = toEliminationMap(draft.eliminationByPlayerId);
      let currentPickIndex = draft.currentPickIndex;
      let roundNumber = draft.roundNumber;
      let direction = draft.direction === -1 ? -1 : 1;
      let isDraftActive = draft.isDraftActive;

      if (action === "move") {
        if (!teamId) throw new Error("teamId is required for move.");
        if (isDraftActive) throw new Error("Cannot change order while draft is active.");
        const i = order.indexOf(teamId);
        if (i >= 0) {
          const j = i + moveDirection;
          if (j >= 0 && j < order.length) {
            [order[i], order[j]] = [order[j], order[i]];
          }
        }
      } else if (action === "randomize") {
        if (isDraftActive) throw new Error("Cannot randomize while draft is active.");
        order = shuffle(order);
      } else if (action === "start") {
        assignmentByPlayerId = {};
        pickOrderByPlayerId = {};
        eliminationByPlayerId = {};
        currentPickIndex = 0;
        roundNumber = 1;
        direction = 1;
        isDraftActive = true;
      } else if (action === "stop") {
        isDraftActive = false;
      } else if (action === "reset") {
        assignmentByPlayerId = {};
        pickOrderByPlayerId = {};
        eliminationByPlayerId = {};
      }

      const updated = await tx.draftState.update({
        where: { id: draft.id },
        data: {
          assignmentByPlayerId,
          pickOrderByPlayerId,
          eliminationByPlayerId,
          draftOrderTeamIds: order,
          currentPickIndex,
          roundNumber,
          direction,
          isDraftActive,
        },
        select: {
          leagueId: true,
          assignmentByPlayerId: true,
          pickOrderByPlayerId: true,
          eliminationByPlayerId: true,
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
    const message = error instanceof Error ? error.message : "Unable to update draft settings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
