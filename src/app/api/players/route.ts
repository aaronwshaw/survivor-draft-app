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
      eliminated: true,
      seasons: true,
      advantageLinks: {
        select: {
          advantageID: true,
        },
      },
      seasonsPlayed: {
        orderBy: [{ seasonNumber: "asc" }, { seasonLabel: "asc" }],
        select: {
          seasonLabel: true,
          placement: true,
          advantagesFound: true,
          daysPlayed: true,
          tribalChallengeWinPct: true,
          individualImmunityWins: true,
          individualRewardWins: true,
        },
      },
    },
  });

  const withSeasonFallback = players.map((player) => {
    const relationalSeasons = Array.isArray(player.seasonsPlayed)
      ? player.seasonsPlayed
          .map((row) => ({
            season: row.seasonLabel,
            placement: row.placement ?? null,
            advantagesFound: row.advantagesFound ?? 0,
            daysPlayed: row.daysPlayed ?? null,
            tribalChallengeWinPct: row.tribalChallengeWinPct ?? 0,
            individualImmunityWins: row.individualImmunityWins ?? 0,
            individualRewardWins: row.individualRewardWins ?? 0,
          }))
          .filter((row) => row.season)
      : [];
    if (relationalSeasons.length > 0) {
      return {
        id: player.id,
        name: player.name,
        photoUrl: player.photoUrl,
        age: player.age,
        tribe: player.tribe,
        eliminated: player.eliminated,
        advantages: (player.advantageLinks || []).map((entry) => entry.advantageID),
        seasons: relationalSeasons,
      };
    }

    const seasons = normalizeSeasons(player.seasons);
    if (seasons.length > 0) {
      return {
        id: player.id,
        name: player.name,
        photoUrl: player.photoUrl,
        age: player.age,
        tribe: player.tribe,
        eliminated: player.eliminated,
        advantages: (player.advantageLinks || []).map((entry) => entry.advantageID),
        seasons,
      };
    }

    const fallback = fallbackById.get(player.id) || fallbackByName.get(normalizeName(player.name));
    return {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      age: player.age,
      tribe: player.tribe,
      eliminated: player.eliminated,
      advantages: (player.advantageLinks || []).map((entry) => entry.advantageID),
      seasons: Array.isArray(fallback?.seasons) ? fallback.seasons : [],
    };
  });

  return NextResponse.json(withSeasonFallback);
}
