import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePlacement(placement) {
  return String(placement || "").trim().toLowerCase();
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
