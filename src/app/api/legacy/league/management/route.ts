import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Body =
  | {
      action: "updateRow";
      userId?: string;
      leagueId?: string;
      targetTeamId?: string;
      targetUserId?: string;
      displayName?: string;
      teamName?: string;
      assignTeamId?: string;
    }
  | {
      action: "addTeam";
      userId?: string;
      leagueId?: string;
      teamName?: string;
    }
  | {
      action: "removeUser";
      userId?: string;
      leagueId?: string;
      targetUserId?: string;
    }
  | {
      action: "deleteTeam";
      userId?: string;
      leagueId?: string;
      targetTeamId?: string;
    }
  | {
      action: "deleteLeague";
      userId?: string;
      leagueId?: string;
    };

async function requireAdmin(tx: Prisma.TransactionClient, userId: string, leagueId: string) {
  const membership = await tx.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId } },
    select: { role: true },
  });
  if (!membership || membership.role !== "admin") {
    throw new Error("Only admins can manage league teams.");
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const action = body?.action;
  const userId = String((body as { userId?: string } | null)?.userId || "");
  const leagueId = String((body as { leagueId?: string } | null)?.leagueId || "");

  if (!action || !userId || !leagueId) {
    return NextResponse.json({ error: "action, userId, and leagueId are required." }, { status: 400 });
  }

  try {
    if (action === "deleteLeague") {
      await prisma.$transaction(async (tx) => {
        await requireAdmin(tx, userId, leagueId);
        await tx.league.delete({
          where: { id: leagueId },
        });
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "removeUser") {
      const targetUserId = String((body as { targetUserId?: string } | null)?.targetUserId || "");
      if (!targetUserId) {
        return NextResponse.json({ error: "targetUserId is required." }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        await requireAdmin(tx, userId, leagueId);
        if (targetUserId === userId) {
          throw new Error("You cannot remove yourself from this league.");
        }

        const targetMembership = await tx.membership.findUnique({
          where: { leagueId_userId: { leagueId, userId: targetUserId } },
          select: { id: true, role: true, teamId: true },
        });
        if (!targetMembership) throw new Error("User is not in this league.");

        if (targetMembership.role === "admin") {
          const adminCount = await tx.membership.count({
            where: { leagueId, role: "admin" },
          });
          if (adminCount <= 1) {
            throw new Error("Cannot remove the only admin from the league.");
          }
        }

        if (targetMembership.teamId) {
          await tx.team.updateMany({
            where: { id: targetMembership.teamId, ownerUserId: targetUserId },
            data: { ownerUserId: null },
          });
        }

        await tx.membership.delete({
          where: { id: targetMembership.id },
        });
      });

      return NextResponse.json({ ok: true });
    }

    if (action === "deleteTeam") {
      const targetTeamId = String((body as { targetTeamId?: string } | null)?.targetTeamId || "");
      if (!targetTeamId) {
        return NextResponse.json({ error: "targetTeamId is required." }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        await requireAdmin(tx, userId, leagueId);

        const teamCount = await tx.team.count({ where: { leagueId } });
        if (teamCount <= 1) {
          throw new Error("At least one team is required.");
        }

        const team = await tx.team.findFirst({
          where: { id: targetTeamId, leagueId },
          select: { id: true, ownerUserId: true },
        });
        if (!team) throw new Error("Team not found.");

        if (team.ownerUserId) {
          await tx.membership.deleteMany({
            where: { leagueId, userId: team.ownerUserId },
          });
        }

        await tx.team.delete({
          where: { id: team.id },
        });

        const draft = await tx.draftState.findUnique({
          where: { leagueId },
          select: {
            id: true,
            assignmentByPlayerId: true,
            draftOrderTeamIds: true,
            currentPickIndex: true,
            isDraftActive: true,
          },
        });
        if (!draft) return;

        const order = Array.isArray(draft.draftOrderTeamIds)
          ? draft.draftOrderTeamIds.filter((id): id is string => typeof id === "string" && id !== team.id)
          : [];
        if (order.length === 0) {
          throw new Error("Cannot delete the final team.");
        }

        const assignmentByPlayerId =
          draft.assignmentByPlayerId && typeof draft.assignmentByPlayerId === "object" && !Array.isArray(draft.assignmentByPlayerId)
            ? { ...(draft.assignmentByPlayerId as Record<string, unknown>) }
            : {};
        for (const [playerId, assignedTeamId] of Object.entries(assignmentByPlayerId)) {
          if (assignedTeamId === team.id) {
            delete assignmentByPlayerId[playerId];
          }
        }

        const nextPickIndex = Math.max(0, Math.min(order.length - 1, Number(draft.currentPickIndex) || 0));
        await tx.draftState.update({
          where: { id: draft.id },
          data: {
            assignmentByPlayerId: assignmentByPlayerId as Prisma.InputJsonValue,
            draftOrderTeamIds: order,
            currentPickIndex: nextPickIndex,
            isDraftActive: draft.isDraftActive && order.length > 0,
          },
        });
      });

      return NextResponse.json({ ok: true });
    }

    if (action === "addTeam") {
      const teamNameRaw = String((body as { teamName?: string } | null)?.teamName || "").trim();
      const created = await prisma.$transaction(async (tx) => {
        await requireAdmin(tx, userId, leagueId);
        const existingTeams = await tx.team.findMany({
          where: { leagueId },
          select: { slotNumber: true },
          orderBy: { slotNumber: "asc" },
        });
        const nextSlot = existingTeams.length === 0 ? 1 : Math.max(...existingTeams.map((t) => t.slotNumber)) + 1;
        const team = await tx.team.create({
          data: {
            leagueId,
            slotNumber: nextSlot,
            name: teamNameRaw || `Team ${nextSlot}`,
            ownerUserId: null,
          },
          select: { id: true, slotNumber: true, name: true },
        });

        const draft = await tx.draftState.findUnique({
          where: { leagueId },
          select: { id: true, draftOrderTeamIds: true },
        });
        if (draft) {
          const order = Array.isArray(draft.draftOrderTeamIds)
            ? (draft.draftOrderTeamIds.filter((x): x is string => typeof x === "string"))
            : [];
          if (!order.includes(team.id)) {
            order.push(team.id);
            await tx.draftState.update({
              where: { id: draft.id },
              data: { draftOrderTeamIds: order },
            });
          }
        } else {
          await tx.draftState.create({
            data: {
              leagueId,
              assignmentByPlayerId: {},
              eliminationByPlayerId: {},
              draftOrderTeamIds: [team.id],
              currentPickIndex: 0,
              roundNumber: 1,
              direction: 1,
              isDraftActive: false,
            },
          });
        }

        return team;
      });

      return NextResponse.json({ team: created });
    }

    const targetTeamId = String(body.targetTeamId || "");
    const targetUserId = String(body.targetUserId || "");
    const displayName = String(body.displayName || "").trim();
    const teamName = String(body.teamName || "").trim();
    const assignTeamIdRaw = String(body.assignTeamId || "");
    const assignTeamId = assignTeamIdRaw || targetTeamId;

    if (!targetTeamId) {
      return NextResponse.json({ error: "targetTeamId is required." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await requireAdmin(tx, userId, leagueId);

      const sourceTeam = await tx.team.findFirst({
        where: { id: targetTeamId, leagueId },
        select: { id: true },
      });
      if (!sourceTeam) throw new Error("Source team not found.");

      if (teamName) {
        await tx.team.update({
          where: { id: targetTeamId },
          data: { name: teamName },
        });
      }

      if (!targetUserId) {
        return;
      }

      const targetMembership = await tx.membership.findUnique({
        where: { leagueId_userId: { leagueId, userId: targetUserId } },
      });
      if (!targetMembership) throw new Error("User is not in this league.");

      if (displayName) {
        await tx.user.update({
          where: { id: targetUserId },
          data: { displayName },
        });
      }

      const destinationTeam = await tx.team.findFirst({
        where: { id: assignTeamId, leagueId },
      });
      if (!destinationTeam) throw new Error("Assigned team not found.");

      const currentTeamId = targetMembership.teamId;
      const occupyingUserId =
        destinationTeam.ownerUserId && destinationTeam.ownerUserId !== targetUserId ? destinationTeam.ownerUserId : null;

      if (currentTeamId && currentTeamId !== destinationTeam.id) {
        await tx.team.update({
          where: { id: currentTeamId },
          data: { ownerUserId: null },
        });
      }

      await tx.team.update({
        where: { id: destinationTeam.id },
        data: { ownerUserId: targetUserId },
      });
      await tx.membership.update({
        where: { id: targetMembership.id },
        data: { teamId: destinationTeam.id },
      });

      if (occupyingUserId) {
        const occupyingMembership = await tx.membership.findUnique({
          where: { leagueId_userId: { leagueId, userId: occupyingUserId } },
        });
        if (!occupyingMembership) throw new Error("Target team owner is missing membership data.");

        if (currentTeamId && currentTeamId !== destinationTeam.id) {
          await tx.team.update({
            where: { id: currentTeamId },
            data: { ownerUserId: occupyingUserId },
          });
          await tx.membership.update({
            where: { id: occupyingMembership.id },
            data: { teamId: currentTeamId },
          });
        } else {
          await tx.membership.update({
            where: { id: occupyingMembership.id },
            data: { teamId: null },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save league management changes.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
