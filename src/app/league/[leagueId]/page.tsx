import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/sign-out-button";

type Team = {
  id: string;
  slotNumber: number;
  name: string;
  ownerUserId?: string | null;
  owner?: {
    displayName?: string | null;
    email?: string | null;
  } | null;
};

async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login");
  }
  return user;
}

export default async function LeaguePage({ params }: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await params;
  const user = await requireSessionUser();

  const league = await prisma.league.findUnique({
    where: { id: leagueId },
  });
  if (!league) {
    notFound();
  }

  const membership = await prisma.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId: user.id } },
    include: { league: true, team: true },
  });

  if (!membership) {
    redirect("/leagues?err=League%20not%20found%20or%20access%20denied.");
  }

  const teams: Team[] = (await prisma.team.findMany({
    where: { leagueId },
    orderBy: { slotNumber: "asc" },
    include: { owner: true },
  })) as Team[];

  const memberships = (await prisma.membership.findMany({
    where: { leagueId },
    include: {
      user: true,
      team: true,
    },
    orderBy: { createdAt: "asc" },
  })) as Array<{
    id: string;
    leagueId: string;
    userId: string;
    role: "admin" | "member";
    teamId: string | null;
    user: { id: string; displayName: string | null; email: string };
    team: { id: string; slotNumber: number; name: string } | null;
  }>;

  async function updateTeamAssignmentAction(formData: FormData) {
    "use server";

    const sessionUser = await requireSessionUser();
    const adminMembership = await prisma.membership.findUnique({
      where: {
        leagueId_userId: {
          leagueId,
          userId: sessionUser.id,
        },
      },
    });

    if (!adminMembership || adminMembership.role !== "admin") {
      redirect(`/league/${leagueId}?err=Only%20admins%20can%20adjust%20team%20assignments.`);
    }

    const membershipId = String(formData.get("membershipId") || "");
    const targetTeamId = String(formData.get("teamId") || "");

    if (!membershipId) {
      redirect(`/league/${leagueId}?err=Invalid%20membership%20selection.`);
    }

    try {
      await prisma.$transaction(async (tx) => {
        const member = await tx.membership.findUnique({
          where: { id: membershipId },
          include: { user: true },
        });
        if (!member || member.leagueId !== leagueId) {
          throw new Error("Membership not found.");
        }

        if (!targetTeamId) {
          if (member.teamId) {
            await tx.team.updateMany({
              where: { id: member.teamId, ownerUserId: member.userId },
              data: { ownerUserId: null },
            });
          }
          await tx.membership.update({
            where: { id: member.id },
            data: { teamId: null },
          });
          return;
        }

        const targetTeam = await tx.team.findUnique({ where: { id: targetTeamId } });
        if (!targetTeam || targetTeam.leagueId !== leagueId) {
          throw new Error("Target team not found.");
        }

        if (member.teamId && member.teamId !== targetTeam.id) {
          await tx.team.updateMany({
            where: { id: member.teamId, ownerUserId: member.userId },
            data: { ownerUserId: null },
          });
        }

        if (targetTeam.ownerUserId && targetTeam.ownerUserId !== member.userId) {
          await tx.membership.updateMany({
            where: { leagueId, userId: targetTeam.ownerUserId },
            data: { teamId: null },
          });
        }

        await tx.team.update({
          where: { id: targetTeam.id },
          data: { ownerUserId: member.userId },
        });

        await tx.membership.update({
          where: { id: member.id },
          data: { teamId: targetTeam.id },
        });
      });

      redirect(`/league/${leagueId}?msg=Team%20assignment%20updated.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update team assignment.";
      redirect(`/league/${leagueId}?err=${encodeURIComponent(message)}`);
    }
  }

  const isAdmin = membership.role === "admin";

  return (
    <main className="app-shell">
      <header className="app-header main-header">
        <h1>{membership.league.name}</h1>
        <div className="header-actions auth-actions">
          {isAdmin ? (
            <details className="admin-assignments-menu">
              <summary className="secondary button-like">Team Assignments</summary>
              <div className="card admin-assignments-panel">
                <h3>Team Assignments</h3>
                <div className="form-grid">
                  {memberships.map((m) => (
                    <form key={m.id} action={updateTeamAssignmentAction} className="league-item">
                      <input type="hidden" name="membershipId" value={m.id} />
                      <div>
                        <h4>{m.user.displayName || "Unnamed User"}</h4>
                        <p className="muted">{m.user.email}</p>
                        <p className="muted">Current: {m.team ? `Team ${m.team.slotNumber} (${m.team.name})` : "Unassigned"}</p>
                      </div>
                      <div className="form-grid">
                        <select name="teamId" defaultValue={m.teamId || ""}>
                          <option value="">Unassigned</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              Team {team.slotNumber} ({team.name})
                            </option>
                          ))}
                        </select>
                        <button type="submit">Update</button>
                      </div>
                    </form>
                  ))}
                </div>
              </div>
            </details>
          ) : null}
          <span className="muted">
            {user.displayName || user.email} ({user.email})
          </span>
          <SignOutButton />
        </div>
      </header>

      <section className="page-view">
        <div className="card">
          <h2>League Overview</h2>
          <p className="muted">Role: {membership.role}</p>
          <p className="muted">Invite Code: {membership.league.inviteCode}</p>
          <p className="muted">
            Your Team: {membership.team ? `Team ${membership.team.slotNumber} (${membership.team.name})` : "None"}
          </p>
          <Link href="/leagues" className="secondary button-like">
            Back to Leagues
          </Link>
        </div>

        <div className="card">
          <h3>Teams</h3>
          <div className="teams-grid">
            {teams.map((team: Team) => (
              <article key={team.id} className="team-card">
                <h4>
                  Team {team.slotNumber}: {team.name}
                </h4>
                <p className="muted">Owner: {team.owner?.displayName || team.owner?.email || "Unclaimed"}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Draft Board Migration Status</h3>
          <p className="muted">
            This route is now DB-backed and auth-protected. Next step is migrating assignment and elimination mutations
            from the legacy client script into server actions/API routes for this page.
          </p>
        </div>
      </section>
    </main>
  );
}
