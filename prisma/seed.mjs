import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePlacement(placement) {
  return String(placement || "").trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || "").trim().toLowerCase();
}

function parseSeasonNumber(value) {
  const text = String(value || "");
  const match = text.match(/\d+/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

function computeStats(seasons) {
  const list = Array.isArray(seasons) ? seasons : [];
  const seasonCount = list.length;
  let winnerCount = 0;
  let finalistCount = 0;

  for (const season of list) {
    const placement = normalizePlacement(season && season.placement);
    if (!placement) continue;
    if (placement.includes("winner") || placement.includes("won")) winnerCount += 1;
    if (placement.includes("runner-up") || placement.includes("finalist")) finalistCount += 1;
  }

  return { seasonCount, winnerCount, finalistCount };
}

async function main() {
  const dataPath = path.join(process.cwd(), "src", "data", "players.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const players = JSON.parse(raw);

  if (!Array.isArray(players)) {
    throw new Error("players.json must be an array.");
  }

  for (const player of players) {
    const seasons = Array.isArray(player.seasons) ? player.seasons : [];
    const stats = computeStats(seasons);
    await prisma.player.upsert({
      where: { id: String(player.id) },
      update: {
        name: String(player.name),
        photoUrl: String(player.photoUrl),
        age: player.age == null ? null : Number(player.age),
        tribe: player.tribe == null ? null : String(player.tribe),
        seasons,
        seasonCount: stats.seasonCount,
        winnerCount: stats.winnerCount,
        finalistCount: stats.finalistCount,
      },
      create: {
        id: String(player.id),
        name: String(player.name),
        photoUrl: String(player.photoUrl),
        age: player.age == null ? null : Number(player.age),
        tribe: player.tribe == null ? null : String(player.tribe),
        seasons,
        seasonCount: stats.seasonCount,
        winnerCount: stats.winnerCount,
        finalistCount: stats.finalistCount,
      },
    });
  }

  const allPlayers = await prisma.player.findMany({
    select: { id: true, name: true },
  });
  const sourceById = new Map(players.map((p) => [String(p.id), p]));
  const sourceByName = new Map(players.map((p) => [normalizeName(p.name), p]));

  for (const player of allPlayers) {
    const source = sourceById.get(player.id) || sourceByName.get(normalizeName(player.name));
    if (!source) continue;
    const seasons = Array.isArray(source.seasons) ? source.seasons : [];

    await prisma.playerSeason.deleteMany({
      where: { playerId: player.id },
    });

    if (seasons.length > 0) {
      await prisma.playerSeason.createMany({
        data: seasons.map((season) => ({
          playerId: player.id,
          seasonLabel: typeof season === "number" ? `Season ${season}` : String(season.season || ""),
          seasonNumber:
            typeof season === "number" ? season : parseSeasonNumber(season && season.season),
          placement:
            season && typeof season === "object" && "placement" in season
              ? (season.placement == null ? null : String(season.placement))
              : null,
        })),
      });
    }
  }

  console.log(`Seeded ${players.length} players.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
