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

  const membership = await prisma.membership.findUnique({
    where: { leagueId_userId: { leagueId, userId: user.id } },
    include: { league: true, team: true },
  });

  if (!membership) {
    notFound();
  }

  const teams: Team[] = (await prisma.team.findMany({
    where: { leagueId },
    orderBy: { slotNumber: "asc" },
    include: { owner: true },
  })) as Team[];

  return (
    <main className="app-shell">
      <header className="app-header main-header">
        <h1>{membership.league.name}</h1>
        <div className="header-actions auth-actions">
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
