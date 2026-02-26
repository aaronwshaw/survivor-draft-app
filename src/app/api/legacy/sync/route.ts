import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type TribeRow = { id: string; name: string; color: string };
type TribeLookup = {
  findMany: (args: {
    orderBy: { name: "asc" };
    select: { id: true; name: true; color: true };
  }) => Promise<TribeRow[]>;
};
type AdvantageRow = { advantageID: string; name: string; description: string };
type AdvantageLookup = {
  findMany: (args: {
    orderBy: { name: "asc" };
    select: { advantageID: true; name: true; description: true };
  }) => Promise<AdvantageRow[]>;
};

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

  const [users, leagues, teams, allMemberships, draftStates, tribes, advantages] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, email: true, displayName: true, isOwner: true },
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
        pickOrderByPlayerId: true,
        eliminationByPlayerId: true,
        draftOrderTeamIds: true,
        currentPickIndex: true,
        roundNumber: true,
        direction: true,
        isDraftActive: true,
        tribes: true,
        tribeByPlayerId: true,
        updatedAt: true,
      },
    }),
    (prisma as unknown as { tribe: TribeLookup }).tribe.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, color: true },
    }),
    (prisma as unknown as { advantage: AdvantageLookup }).advantage.findMany({
      orderBy: { name: "asc" },
      select: { advantageID: true, name: true, description: true },
    }),
  ]);

  return NextResponse.json({
    users,
    leagues,
    teams,
    memberships: allMemberships,
    draftStates,
    tribes,
    advantages,
  });
}
