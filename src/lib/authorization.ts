import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Membership, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type AuthFailure = { error: NextResponse };
type AuthSuccess = { userId: string; membership: Membership };

export async function requireLeagueRole(
  leagueId: string,
  requiredRole: Role,
): Promise<AuthFailure | AuthSuccess> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const membership = await prisma.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId } },
  });
  if (!membership) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (requiredRole === "admin" && membership.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId, membership };
}

export async function requireLeagueAdmin(leagueId: string): Promise<AuthFailure | AuthSuccess> {
  return requireLeagueRole(leagueId, "admin");
}
