import { createLeagueWithDefaults } from "@/lib/league";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { userId?: string; leagueName?: string } | null;
  const userId = String(body?.userId || "");
  const leagueName = String(body?.leagueName || "").trim();
  if (!userId) return NextResponse.json({ error: "userId is required." }, { status: 400 });
  if (!leagueName) return NextResponse.json({ error: "League name is required." }, { status: 400 });

  const league = await createLeagueWithDefaults(leagueName, userId);
  return NextResponse.json({ league });
}
