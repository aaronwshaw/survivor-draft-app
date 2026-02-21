import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type EliminationBody = {
  userId?: string;
  leagueId?: string;
  playerId?: string;
  action?: "mark" | "undo";
};

function toAssignmentMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" && raw) out[key] = raw;
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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EliminationBody | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const playerId = String(body?.playerId || "");
  const action = body?.action === "undo" ? "undo" : "mark";

  if (!userId || !leagueId || !playerId) {
    return NextResponse.json({ error: "userId, leagueId, and playerId are required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId } },
        select: { role: true },
      });
      if (!membership) throw new Error("You are not in this league.");

      let draft = await tx.draftState.findUnique({
        where: { leagueId },
        select: { id: true, assignmentByPlayerId: true, eliminationByPlayerId: true },
      });
      if (!draft) {
        draft = await tx.draftState.create({
          data: { leagueId, assignmentByPlayerId: {}, eliminationByPlayerId: {} },
          select: { id: true, assignmentByPlayerId: true, eliminationByPlayerId: true },
        });
      }

      const isAdmin = membership.role === "admin";
      const assignmentByPlayerId = toAssignmentMap(draft.assignmentByPlayerId);
      const eliminationByPlayerId = toEliminationMap(draft.eliminationByPlayerId);

      if (action === "mark") {
        if (!isAdmin) {
          const teamId = assignmentByPlayerId[playerId];
          if (!teamId) throw new Error("You can only edit your own team.");
          const team = await tx.team.findUnique({
            where: { id: teamId },
            select: { ownerUserId: true, leagueId: true },
          });
          if (!team || team.leagueId !== leagueId || team.ownerUserId !== userId) {
            throw new Error("You can only edit your own team.");
          }
        }

        if (!eliminationByPlayerId[playerId]) {
          const nums = Object.values(eliminationByPlayerId);
          const next = nums.length === 0 ? 1 : Math.max(...nums) + 1;
          eliminationByPlayerId[playerId] = next;
        }
      } else {
        if (!isAdmin) throw new Error("Only admins can undo elimination.");
        const current = Number(eliminationByPlayerId[playerId]) || 0;
        if (current > 0) {
          delete eliminationByPlayerId[playerId];
          for (const pid of Object.keys(eliminationByPlayerId)) {
            const n = Number(eliminationByPlayerId[pid]) || 0;
            if (n > current) eliminationByPlayerId[pid] = n - 1;
          }
        }
      }

      const updated = await tx.draftState.update({
        where: { id: draft.id },
        data: { eliminationByPlayerId },
        select: { eliminationByPlayerId: true },
      });
      return updated.eliminationByPlayerId;
    });

    return NextResponse.json({ eliminationByPlayerId: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update elimination state.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
