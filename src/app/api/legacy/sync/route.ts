import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = String(searchParams.get("userId") || "");
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  const memberships = await prisma.membership.findMany({
    where: { userId },
    select: { leagueId: true },
  });
  const leagueIds = memberships.map((m) => m.leagueId);

  const [users, leagues, teams, allMemberships, draftStates] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, email: true, displayName: true },
    }),
    prisma.league.findMany({
      where: { id: { in: leagueIds } },
      select: { id: true, name: true, ownerUserId: true, inviteCode: true, createdAt: true, updatedAt: true },
    }),
    prisma.team.findMany({
      where: { leagueId: { in: leagueIds } },
      select: { id: true, leagueId: true, slotNumber: true, name: true, ownerUserId: true, createdAt: true },
    }),
    prisma.membership.findMany({
      where: { leagueId: { in: leagueIds } },
      select: { id: true, leagueId: true, userId: true, role: true, teamId: true, createdAt: true },
    }),
    prisma.draftState.findMany({
      where: { leagueId: { in: leagueIds } },
      select: {
        leagueId: true,
        assignmentByPlayerId: true,
        eliminationByPlayerId: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    users,
    leagues,
    teams,
    memberships: allMemberships,
    draftStates,
  });
}
