import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLeagueWithDefaults, joinLeagueByInviteCode } from "@/lib/league";
import SignOutButton from "@/components/sign-out-button";

type MembershipWithLeagueTeam = Prisma.MembershipGetPayload<{
  include: { league: true; team: true };
}>;

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

export default async function LeaguesPage({
  searchParams,
}: {
  searchParams?: Promise<{ msg?: string; err?: string }>;
}) {
  const user = await requireSessionUser();
  const qp = (await searchParams) || {};

  const memberships: MembershipWithLeagueTeam[] = await prisma.membership.findMany({
    where: { userId: user.id },
    include: {
      league: true,
      team: true,
    },
    orderBy: { createdAt: "desc" },
  });

  async function createLeagueAction(formData: FormData) {
    "use server";
    const current = await requireSessionUser();
    const leagueName = String(formData.get("leagueName") || "").trim();
    if (!leagueName) {
      redirect("/leagues?err=League%20name%20is%20required.");
    }
    const league = await createLeagueWithDefaults(leagueName, current.id);
    redirect(`/leagues?msg=${encodeURIComponent(`League created: ${league.name}. Invite code: ${league.inviteCode}`)}`);
  }

  async function joinLeagueAction(formData: FormData) {
    "use server";
    const current = await requireSessionUser();
    const inviteCode = String(formData.get("inviteCode") || "");
    try {
      const result = await joinLeagueByInviteCode(inviteCode, current.id);
      redirect(
        `/leagues?msg=${encodeURIComponent(`Joined ${result.leagueName}. You are Team ${result.slotNumber}.`)}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Join failed.";
      redirect(`/leagues?err=${encodeURIComponent(message)}`);
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header main-header">
        <h1>Survivor Team Draft</h1>
        <div className="header-actions auth-actions">
          <span className="muted">
            {user.displayName || user.email} ({user.email})
          </span>
          <SignOutButton />
        </div>
      </header>

      <section className="page-view" aria-labelledby="leaguesTitle">
        <h2 id="leaguesTitle">Your Leagues</h2>
        <div className="leagues-grid">
          <section className="card">
            <h3>Memberships</h3>
            <div className="leagues-list">
              {memberships.length === 0 ? (
                <p className="muted">No leagues yet.</p>
              ) : (
                memberships.map((m: MembershipWithLeagueTeam) => (
                  <article className="league-item" key={m.id}>
                    <div>
                      <h4>{m.league.name}</h4>
                      <p className="muted">
                        Role: {m.role} | {m.team ? `Team ${m.team.slotNumber} (${m.team.name})` : "No team"}
                      </p>
                      <p className="muted">Invite Code: {m.league.inviteCode}</p>
                    </div>
                    <Link className="secondary button-like" href={`/league/${m.leagueId}`}>
                      Open
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="card">
            <h3>Create League</h3>
            <form className="form-grid" action={createLeagueAction}>
              <label>
                League Name
                <input name="leagueName" type="text" required placeholder="Family Survivor Pool" />
              </label>
              <button type="submit">Create League</button>
            </form>
          </section>

          <section className="card">
            <h3>Join League</h3>
            <form className="form-grid" action={joinLeagueAction}>
              <label>
                Invite Code
                <input name="inviteCode" type="text" required placeholder="ABC123" />
              </label>
              <button type="submit">Join League</button>
            </form>
          </section>
        </div>
        <p className="message">{qp.err ? decodeURIComponent(qp.err) : qp.msg ? decodeURIComponent(qp.msg) : ""}</p>
      </section>
    </main>
  );
}
