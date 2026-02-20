import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

  return NextResponse.json(players);
}
