import { joinLeagueByInviteCode } from "@/lib/league";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { userId?: string; inviteCode?: string } | null;
  const userId = String(body?.userId || "");
  const inviteCode = String(body?.inviteCode || "");
  if (!userId) return NextResponse.json({ error: "userId is required." }, { status: 400 });
  if (!inviteCode) return NextResponse.json({ error: "Invite code is required." }, { status: 400 });

  try {
    const result = await joinLeagueByInviteCode(inviteCode, userId);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Join failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
