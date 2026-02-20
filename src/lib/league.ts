import { prisma } from "@/lib/prisma";

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
  return prisma.$transaction(async (tx) => {
    const league = await tx.league.create({
      data: {
        name: leagueName,
        ownerUserId,
        inviteCode,
      },
    });

    await tx.team.createMany({
      data: Array.from({ length: 8 }, (_, i) => ({
        leagueId: league.id,
        slotNumber: i + 1,
        name: `Team ${i + 1}`,
        ownerUserId: null,
      })),
    });

    await tx.membership.create({
      data: {
        leagueId: league.id,
        userId: ownerUserId,
        role: "admin",
        teamId: null,
      },
    });

    await tx.draftState.create({
      data: {
        leagueId: league.id,
        assignmentByPlayerId: {},
        eliminationByPlayerId: {},
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

  return prisma.$transaction(async (tx) => {
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
      throw new Error("This league is full (8/8 teams taken).");
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
