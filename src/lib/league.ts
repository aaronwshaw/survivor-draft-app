import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function generateUniqueInviteCode(length = 6): Promise<string> {
  let code = "";
  let exists = true;
  while (exists) {
    code = "";
    for (let i = 0; i < length; i += 1) {
      code += INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)];
    }
    const found = await prisma.league.findUnique({ where: { inviteCode: code } });
    exists = !!found;
  }
  return code;
}

export async function createLeagueWithDefaults(leagueName: string, ownerUserId: string) {
  const inviteCode = await generateUniqueInviteCode();
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const league = await tx.league.create({
      data: {
        name: leagueName,
        ownerUserId,
        inviteCode,
      },
    });

    let adminTeamId = "";
    const draftOrderTeamIds: string[] = [];
    for (let i = 1; i <= 1; i += 1) {
      const createdTeam = await tx.team.create({
        data: {
          leagueId: league.id,
          slotNumber: i,
          name: `Team ${i}`,
          ownerUserId: i === 1 ? ownerUserId : null,
        },
      });
      draftOrderTeamIds.push(createdTeam.id);
      if (i === 1) {
        adminTeamId = createdTeam.id;
      }
    }

    await tx.membership.create({
      data: {
        leagueId: league.id,
        userId: ownerUserId,
        role: "admin",
        teamId: adminTeamId,
      },
    });

    await tx.draftState.create({
      data: {
        leagueId: league.id,
        assignmentByPlayerId: {},
        eliminationByPlayerId: {},
        draftOrderTeamIds,
        currentPickIndex: 0,
        roundNumber: 1,
        direction: 1,
        isDraftActive: false,
      },
    });

    return league;
  });
}

export async function joinLeagueByInviteCode(inviteCodeRaw: string, userId: string) {
  const inviteCode = String(inviteCodeRaw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!inviteCode) {
    throw new Error("Enter an invite code.");
  }

  const league = await prisma.league.findUnique({ where: { inviteCode } });
  if (!league) {
    throw new Error("Invite code not found. Check for typos and paste only the code.");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const existingMembership = await tx.membership.findUnique({
      where: { leagueId_userId: { leagueId: league.id, userId } },
    });
    if (existingMembership) {
      throw new Error("You're already in this league.");
    }

    const firstOpen = await tx.team.findFirst({
      where: { leagueId: league.id, ownerUserId: null },
      orderBy: { slotNumber: "asc" },
    });
    if (!firstOpen) {
      throw new Error("No open team is available. Ask an admin to add a team.");
    }

    const claim = await tx.team.updateMany({
      where: { id: firstOpen.id, ownerUserId: null },
      data: { ownerUserId: userId },
    });
    if (claim.count !== 1) {
      throw new Error("Team claim conflict. Try joining again.");
    }

    await tx.membership.create({
      data: {
        leagueId: league.id,
        userId,
        role: "member",
        teamId: firstOpen.id,
      },
    });

    return { leagueId: league.id, leagueName: league.name, slotNumber: firstOpen.slotNumber };
  });
}
