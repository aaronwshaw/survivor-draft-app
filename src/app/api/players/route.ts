import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fallbackPlayers from "@/data/players.json";

function normalizeName(raw: unknown) {
  return String(raw || "").trim().toLowerCase();
}

function normalizeSeasons(raw: unknown) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function GET() {
  const fallbackById = new Map(
    (Array.isArray(fallbackPlayers) ? fallbackPlayers : []).map((p) => [p.id, p]),
  );
  const fallbackByName = new Map(
    (Array.isArray(fallbackPlayers) ? fallbackPlayers : []).map((p) => [normalizeName(p.name), p]),
  );

  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      age: true,
      tribe: true,
      seasons: true,
    },
  });

  const withSeasonFallback = players.map((player) => {
    const seasons = normalizeSeasons(player.seasons);
    if (seasons.length > 0) return player;

    const fallback = fallbackById.get(player.id) || fallbackByName.get(normalizeName(player.name));
    return {
      ...player,
      seasons: Array.isArray(fallback?.seasons) ? fallback.seasons : [],
    };
  });

  return NextResponse.json(withSeasonFallback);
}
