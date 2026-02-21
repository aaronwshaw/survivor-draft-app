import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TribeBody = {
  userId?: string;
  leagueId?: string;
  playerId?: string;
  tribeId?: string;
  newTribeName?: string;
  tribeColor?: string;
};

type Tribe = { id: string; name: string; color: string };

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function toTribes(value: unknown): Tribe[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const entry = row as Record<string, unknown>;
      return {
        id: String(entry.id || ""),
        name: String(entry.name || ""),
        color: String(entry.color || "#e53935"),
      };
    })
    .filter((row) => !!row.id && !!row.name);
}

function toTribeByPlayer(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" && raw) out[key] = raw;
  }
  return out;
}

function makeTribeId(name: string) {
  const base = normalizeName(name).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `tribe-${base || Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as TribeBody | null;
  const userId = String(body?.userId || "");
  const leagueId = String(body?.leagueId || "");
  const playerId = String(body?.playerId || "");
  const selectedTribeId = String(body?.tribeId || "");
  const newTribeName = String(body?.newTribeName || "").trim();
  const tribeColor = String(body?.tribeColor || "#e53935");

  if (!userId || !leagueId || !playerId) {
    return NextResponse.json({ error: "userId, leagueId, and playerId are required." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const membership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId } },
        select: { role: true },
      });
      if (!membership || membership.role !== "admin") {
        throw new Error("Only admins can assign tribes.");
      }

      let draft = await tx.draftState.findUnique({
        where: { leagueId },
        select: { id: true, tribes: true, tribeByPlayerId: true },
      });
      if (!draft) {
        draft = await tx.draftState.create({
          data: { leagueId, assignmentByPlayerId: {}, eliminationByPlayerId: {}, tribes: [], tribeByPlayerId: {} },
          select: { id: true, tribes: true, tribeByPlayerId: true },
        });
      }

      const tribes = toTribes(draft.tribes);
      const tribeByPlayerId = toTribeByPlayer(draft.tribeByPlayerId);

      let finalTribeId = selectedTribeId;
      if (newTribeName) {
        const existing = tribes.find((tribe) => normalizeName(tribe.name) === normalizeName(newTribeName));
        if (existing) {
          finalTribeId = existing.id;
        } else {
          const usedIds = new Set(tribes.map((tribe) => tribe.id));
          let candidate = makeTribeId(newTribeName);
          let suffix = 2;
          while (usedIds.has(candidate)) {
            candidate = `${candidate}-${suffix}`;
            suffix += 1;
          }
          tribes.push({ id: candidate, name: newTribeName, color: tribeColor });
          finalTribeId = candidate;
        }
      }

      if (finalTribeId) {
        tribeByPlayerId[playerId] = finalTribeId;
      } else {
        delete tribeByPlayerId[playerId];
      }

      const updated = await tx.draftState.update({
        where: { id: draft.id },
        data: { tribes, tribeByPlayerId },
        select: { leagueId: true, tribes: true, tribeByPlayerId: true },
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save tribe assignment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
