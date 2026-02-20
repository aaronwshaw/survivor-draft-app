const DB_KEY = "survivor_app_db_v2";
const SESSION_KEY = "survivor_app_session_v1";

const FALLBACK_PLAYERS = [
  { id: "angelina-keeley", name: "Angelina Keeley", photoUrl: "photos/Angelina.webp", age: 35, tribe: null, seasons: [] },
  { id: "aubry-bracco", name: "Aubry Bracco", photoUrl: "photos/Aubry.webp", age: 39, tribe: null, seasons: [] },
  { id: "benjamin-coach-wade", name: "Benjamin \"Coach\" Wade", photoUrl: "photos/Coach.webp", age: 53, tribe: null, seasons: [] },
  { id: "charlie-davis", name: "Charlie Davis", photoUrl: "photos/Charlie.webp", age: 27, tribe: null, seasons: [] },
  { id: "chrissy-hofbeck", name: "Chrissy Hofbeck", photoUrl: "photos/Chrissy.webp", age: 54, tribe: null, seasons: [] },
  { id: "christian-hubicki", name: "Christian Hubicki", photoUrl: "photos/Christian.webp", age: 39, tribe: null, seasons: [] },
  { id: "cirie-fields", name: "Cirie Fields", photoUrl: "photos/Cirie.webp", age: 54, tribe: null, seasons: [] },
  { id: "colby-donaldson", name: "Colby Donaldson", photoUrl: "photos/Colby.webp", age: 51, tribe: null, seasons: [] },
  { id: "dee-valladares", name: "Dee Valladares", photoUrl: "photos/Dee.webp", age: 28, tribe: null, seasons: [] },
  { id: "emily-flippen", name: "Emily Flippen", photoUrl: "photos/Emily.webp", age: 30, tribe: null, seasons: [] },
  { id: "genevieve-mushaluk", name: "Genevieve Mushaluk", photoUrl: "photos/Genevieve.webp", age: 34, tribe: null, seasons: [] },
  { id: "jenna-lewis-dougherty", name: "Jenna Lewis-Dougherty", photoUrl: "photos/Jenna.webp", age: 47, tribe: null, seasons: [] },
  { id: "joe-hunter", name: "Joe Hunter", photoUrl: "photos/Joe.webp", age: 45, tribe: null, seasons: [] },
  { id: "jonathan-young", name: "Jonathan Young", photoUrl: "photos/Jonathan.webp", age: 32, tribe: null, seasons: [] },
  { id: "kamilla-karthigesu", name: "Kamilla Karthigesu", photoUrl: "photos/Kamilla.webp", age: 31, tribe: null, seasons: [] },
  { id: "ozzy-lusth", name: "Ozzy Lusth", photoUrl: "photos/Ozzy.webp", age: 43, tribe: null, seasons: [] },
  { id: "kyle-fraser", name: "Kyle Fraser", photoUrl: "photos/Kyle.webp", age: 31, tribe: null, seasons: [] },
  { id: "mike-white", name: "Mike White", photoUrl: "photos/Mike.webp", age: 54, tribe: null, seasons: [] },
  { id: "quintavius-q-burdette", name: "Quintavius \"Q\" Burdette", photoUrl: "photos/Q.webp", age: 31, tribe: null, seasons: [] },
  { id: "rick-devens", name: "Rick Devens", photoUrl: "photos/Rick.webp", age: 41, tribe: null, seasons: [] },
  { id: "rizo-velovic", name: "Rizo Velovic", photoUrl: "photos/Rizo.webp", age: 25, tribe: null, seasons: [] },
  { id: "savannah-louie", name: "Savannah Louie", photoUrl: "photos/Savannah.webp", age: 31, tribe: null, seasons: [] },
  { id: "stephenie-lagrossa-kendrick", name: "Stephenie LaGrossa Kendrick", photoUrl: "photos/Stephenie.webp", age: 45, tribe: null, seasons: [] },
  { id: "tiffany-nicole-ervin", name: "Tiffany Nicole Ervin", photoUrl: "photos/Tiffany.webp", age: 34, tribe: null, seasons: [] }
];

const state = {
  players: [],
  db: null,
  session: { currentUserId: null },
  currentSubview: "draft",
  draftFilter: "alpha",
  assignTargetPlayerId: null,
  detailsTargetPlayerId: null
};

const ui = {
  currentUserLabel: document.getElementById("currentUserLabel"),
  logoutButton: document.getElementById("logoutButton"),
  loginView: document.getElementById("loginView"),
  leaguesView: document.getElementById("leaguesView"),
  leagueView: document.getElementById("leagueView"),
  loginMessage: document.getElementById("loginMessage"),
  leaguesMessage: document.getElementById("leaguesMessage"),
  leagueMessage: document.getElementById("leagueMessage"),
  authForm: document.getElementById("authForm"),
  authEmail: document.getElementById("authEmail"),
  authDisplayName: document.getElementById("authDisplayName"),
  signUpButton: document.getElementById("signUpButton"),
  leaguesList: document.getElementById("leaguesList"),
  createLeagueForm: document.getElementById("createLeagueForm"),
  createLeagueName: document.getElementById("createLeagueName"),
  joinLeagueForm: document.getElementById("joinLeagueForm"),
  joinLeagueCode: document.getElementById("joinLeagueCode"),
  leagueTitle: document.getElementById("leagueTitle"),
  leagueMeta: document.getElementById("leagueMeta"),
  leagueInviteCode: document.getElementById("leagueInviteCode"),
  adminAssignCard: document.getElementById("adminAssignCard"),
  adminAssignForm: document.getElementById("adminAssignForm"),
  adminAssignEmail: document.getElementById("adminAssignEmail"),
  adminAssignTeamSelect: document.getElementById("adminAssignTeamSelect"),
  backToLeaguesButton: document.getElementById("backToLeaguesButton"),
  draftViewButton: document.getElementById("draftViewButton"),
  teamsViewButton: document.getElementById("teamsViewButton"),
  resetButton: document.getElementById("resetButton"),
  draftLayout: document.getElementById("draftLayout"),
  teamsColumnsView: document.getElementById("teamsColumnsView"),
  teamsContainer: document.getElementById("teamsContainer"),
  playersContainer: document.getElementById("playersContainer"),
  draftFilterSelect: document.getElementById("draftFilterSelect"),
  teamColumnsContainer: document.getElementById("teamColumnsContainer"),
  assignModal: document.getElementById("assignModal"),
  assignPlayerName: document.getElementById("assignPlayerName"),
  assignSelect: document.getElementById("assignSelect"),
  assignConfirm: document.getElementById("assignConfirm"),
  assignCancel: document.getElementById("assignCancel"),
  detailsModal: document.getElementById("detailsModal"),
  detailsPhoto: document.getElementById("detailsPhoto"),
  detailsName: document.getElementById("detailsName"),
  detailsAge: document.getElementById("detailsAge"),
  detailsTribe: document.getElementById("detailsTribe"),
  detailsSeasons: document.getElementById("detailsSeasons"),
  detailsEliminateButton: document.getElementById("detailsEliminateButton"),
  detailsCloseTop: document.getElementById("detailsCloseTop"),
  detailsCloseBottom: document.getElementById("detailsCloseBottom")
};

function nowIso() { return new Date().toISOString(); }
function id(prefix) { return `${prefix}_${Math.random().toString(36).slice(2, 10)}`; }
function email(v) { return String(v || "").trim().toLowerCase(); }
function code(v) { return String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }

function loadDb() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || { users: [], leagues: [], teams: [], memberships: [], draftStates: [] }; }
  catch { return { users: [], leagues: [], teams: [], memberships: [], draftStates: [] }; }
}
function saveDb() { localStorage.setItem(DB_KEY, JSON.stringify(state.db)); }
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || { currentUserId: null }; }
  catch { return { currentUserId: null }; }
}
function saveSession() { localStorage.setItem(SESSION_KEY, JSON.stringify(state.session)); }

function msg(view, text) {
  ui.loginMessage.textContent = view === "login" ? text : "";
  ui.leaguesMessage.textContent = view === "leagues" ? text : "";
  ui.leagueMessage.textContent = view === "league" ? text : "";
}

function currentUser() { return state.db.users.find((u) => u.id === state.session.currentUserId) || null; }
function leagueById(leagueId) { return state.db.leagues.find((l) => l.id === leagueId) || null; }
function teamsByLeague(leagueId) { return state.db.teams.filter((t) => t.leagueId === leagueId).sort((a, b) => a.slotNumber - b.slotNumber); }
function membership(userId, leagueId) { return state.db.memberships.find((m) => m.userId === userId && m.leagueId === leagueId) || null; }

function draftState(leagueId) {
  let d = state.db.draftStates.find((x) => x.leagueId === leagueId);
  if (!d) {
    d = { leagueId, assignmentByPlayerId: {}, eliminationByPlayerId: {}, updatedAt: nowIso() };
    state.db.draftStates.push(d);
    saveDb();
  }
  if (!d.eliminationByPlayerId) d.eliminationByPlayerId = {};
  return d;
}

async function loadPlayers() {
  try {
    const r = await fetch("players.json");
    if (!r.ok) throw new Error("missing");
    return await r.json();
  } catch {
    return JSON.parse(JSON.stringify(FALLBACK_PLAYERS));
  }
}

function inviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let v = "";
  for (let i = 0; i < 6; i += 1) v += chars[Math.floor(Math.random() * chars.length)];
  while (state.db.leagues.some((l) => l.inviteCode === v)) {
    v = "";
    for (let i = 0; i < 6; i += 1) v += chars[Math.floor(Math.random() * chars.length)];
  }
  return v;
}

function signUp(userEmail, displayName) {
  const e = email(userEmail);
  if (!e) throw new Error("Email is required.");
  if (state.db.users.some((u) => u.email === e)) throw new Error("That email already exists. Please sign in.");
  const u = { id: id("usr"), email: e, displayName: String(displayName || "").trim() || e.split("@")[0] };
  state.db.users.push(u);
  state.session.currentUserId = u.id;
  saveDb();
  saveSession();
}

function signIn(userEmail) {
  const e = email(userEmail);
  const u = state.db.users.find((x) => x.email === e);
  if (!u) throw new Error("No account found for that email. Use Sign Up first.");
  state.session.currentUserId = u.id;
  saveSession();
}

function signOut() {
  state.session.currentUserId = null;
  saveSession();
}

function createLeague(name, ownerUserId) {
  const leagueName = String(name || "").trim();
  if (!leagueName) throw new Error("League name is required.");
  const league = { id: id("l"), name: leagueName, ownerUserId, inviteCode: inviteCode(), createdAt: nowIso(), updatedAt: nowIso() };
  state.db.leagues.push(league);
  for (let i = 1; i <= 8; i += 1) state.db.teams.push({ id: id("t"), leagueId: league.id, slotNumber: i, name: `Team ${i}`, ownerUserId: null });
  state.db.memberships.push({ id: id("m"), leagueId: league.id, userId: ownerUserId, role: "admin", teamId: null, createdAt: nowIso() });
  state.db.draftStates.push({ leagueId: league.id, assignmentByPlayerId: {}, eliminationByPlayerId: {}, updatedAt: nowIso() });
  saveDb();
  return league;
}

function joinLeague(rawCode, userId) {
  const invite = code(rawCode);
  const league = state.db.leagues.find((l) => code(l.inviteCode) === invite);
  if (!invite) throw new Error("Enter an invite code.");
  if (!league) throw new Error("Invite code not found. Check for typos and paste only the code.");
  if (membership(userId, league.id)) throw new Error("You're already in this league.");
  const team = teamsByLeague(league.id).find((t) => t.ownerUserId === null);
  if (!team) throw new Error("This league is full (8/8 teams taken).");
  const fresh = state.db.teams.find((t) => t.id === team.id);
  if (!fresh || fresh.ownerUserId !== null) throw new Error("Team claim conflict. Try again.");
  fresh.ownerUserId = userId;
  state.db.memberships.push({ id: id("m"), leagueId: league.id, userId, role: "member", teamId: fresh.id, createdAt: nowIso() });
  saveDb();
  return { league, slotNumber: fresh.slotNumber };
}

function adminAssignUserToTeam(ctx, userEmail, teamId) {
  if (ctx.membership.role !== "admin") throw new Error("Only admins can assign users to teams.");
  const normalizedEmail = email(userEmail);
  if (!normalizedEmail) throw new Error("User email is required.");

  const targetUser = state.db.users.find((u) => u.email === normalizedEmail);
  if (!targetUser) throw new Error("User not found. They need to sign up first.");

  const targetTeam = state.db.teams.find((t) => t.id === teamId && t.leagueId === ctx.league.id);
  if (!targetTeam) throw new Error("Target team not found.");
  if (targetTeam.ownerUserId && targetTeam.ownerUserId !== targetUser.id) {
    throw new Error("That team is already owned by another user.");
  }

  if (targetUser.id === ctx.league.ownerUserId) {
    throw new Error("Admin owner does not take a team slot in this setup.");
  }

  const existingMembership = membership(targetUser.id, ctx.league.id);
  if (existingMembership && existingMembership.role === "admin") {
    throw new Error("Admins cannot be assigned to team slots.");
  }

  state.db.teams.forEach((team) => {
    if (team.leagueId === ctx.league.id && team.ownerUserId === targetUser.id && team.id !== targetTeam.id) {
      team.ownerUserId = null;
    }
  });

  targetTeam.ownerUserId = targetUser.id;

  if (existingMembership) {
    existingMembership.teamId = targetTeam.id;
  } else {
    state.db.memberships.push({
      id: id("m"),
      leagueId: ctx.league.id,
      userId: targetUser.id,
      role: "member",
      teamId: targetTeam.id,
      createdAt: nowIso()
    });
  }

  saveDb();
  return targetTeam;
}

function canRenameTeam(user, m, team) { return !!(user && m && team && (m.role === "admin" || team.ownerUserId === user.id)); }
function canAssignPlayer(user, m, teamTarget) { return !!(user && m && teamTarget && (m.role === "admin" || teamTarget.ownerUserId === user.id)); }
function canUnassignPlayer(user, m, teamSource) { return !!(user && m && teamSource && (m.role === "admin" || teamSource.ownerUserId === user.id)); }
function canResetLeague(user, m, league) { return !!(user && m && league && m.role === "admin"); }

function ctxForLeague(leagueId) {
  const user = currentUser();
  const league = leagueById(leagueId);
  if (!user || !league) return null;
  const m = membership(user.id, leagueId);
  if (!m) return null;
  return { user, league, membership: m, teams: teamsByLeague(leagueId), draft: draftState(leagueId) };
}

function renameTeam(ctx, teamId, name) {
  const team = state.db.teams.find((t) => t.id === teamId && t.leagueId === ctx.league.id);
  if (!team) throw new Error("Team not found.");
  if (!canRenameTeam(ctx.user, ctx.membership, team)) throw new Error("You can only edit your own team.");
  const trimmed = String(name || "").trim();
  if (!trimmed) return;
  team.name = trimmed;
  saveDb();
}

function assignPlayer(ctx, playerId, teamIdOrNull) {
  const draft = draftState(ctx.league.id);
  const currentTeamId = draft.assignmentByPlayerId[playerId] || null;
  const currentTeam = currentTeamId ? state.db.teams.find((t) => t.id === currentTeamId) : null;

  if (teamIdOrNull === null) {
    if (!currentTeam || !canUnassignPlayer(ctx.user, ctx.membership, currentTeam)) throw new Error("You can only edit your own team.");
    delete draft.assignmentByPlayerId[playerId];
    draft.updatedAt = nowIso();
    saveDb();
    return;
  }

  const target = state.db.teams.find((t) => t.id === teamIdOrNull && t.leagueId === ctx.league.id);
  if (!target) throw new Error("Target team not found.");
  if (!canAssignPlayer(ctx.user, ctx.membership, target)) throw new Error("You can only edit your own team.");
  if (currentTeam && currentTeam.id !== target.id && !canUnassignPlayer(ctx.user, ctx.membership, currentTeam)) {
    throw new Error("You can only edit your own team.");
  }
  draft.assignmentByPlayerId[playerId] = target.id;
  draft.updatedAt = nowIso();
  saveDb();
}

function resetLeague(ctx) {
  if (!canResetLeague(ctx.user, ctx.membership, ctx.league)) throw new Error("Only admins can reset this league.");
  const draft = draftState(ctx.league.id);
  draft.assignmentByPlayerId = {};
  draft.eliminationByPlayerId = {};
  draft.updatedAt = nowIso();
  saveDb();
}

function canEliminate(ctx, playerId) {
  if (ctx.membership.role === "admin") return true;
  const teamId = ctx.draft.assignmentByPlayerId[playerId];
  if (!teamId) return false;
  const team = state.db.teams.find((t) => t.id === teamId);
  return !!(team && team.ownerUserId === ctx.user.id);
}

function markEliminated(ctx, playerId) {
  if (!canEliminate(ctx, playerId)) throw new Error("You can only edit your own team.");
  if (ctx.draft.eliminationByPlayerId[playerId]) return;
  const nums = Object.values(ctx.draft.eliminationByPlayerId).map((v) => Number(v) || 0);
  const next = nums.length === 0 ? 1 : Math.max(...nums) + 1;
  ctx.draft.eliminationByPlayerId[playerId] = next;
  ctx.draft.updatedAt = nowIso();
  saveDb();
}

function undoEliminated(ctx, playerId) {
  if (ctx.membership.role !== "admin") throw new Error("Only admins can undo elimination.");
  const current = Number(ctx.draft.eliminationByPlayerId[playerId]);
  if (!current) return;
  delete ctx.draft.eliminationByPlayerId[playerId];
  Object.keys(ctx.draft.eliminationByPlayerId).forEach((pid) => {
    const n = Number(ctx.draft.eliminationByPlayerId[pid]) || 0;
    if (n > current) ctx.draft.eliminationByPlayerId[pid] = n - 1;
  });
  ctx.draft.updatedAt = nowIso();
  saveDb();
}

function route() {
  const h = (location.hash || "#/login").replace(/^#/, "");
  const p = h.split("/").filter(Boolean);
  if (p[0] === "leagues") return { name: "leagues" };
  if (p[0] === "league" && p[1]) return { name: "league", leagueId: p[1] };
  return { name: "login" };
}

function go(path) { location.hash = path; }

function toggleView(name) {
  ui.loginView.classList.toggle("view-hidden", name !== "login");
  ui.leaguesView.classList.toggle("view-hidden", name !== "leagues");
  ui.leagueView.classList.toggle("view-hidden", name !== "league");
}

function renderAuth() {
  const user = currentUser();
  ui.logoutButton.classList.toggle("view-hidden", !user);
  ui.currentUserLabel.textContent = user ? `${user.displayName} (${user.email})` : "";
}

function leagueRows(userId) {
  return state.db.memberships
    .filter((m) => m.userId === userId)
    .map((m) => {
      const l = leagueById(m.leagueId);
      if (!l) return null;
      const t = m.teamId ? state.db.teams.find((x) => x.id === m.teamId) : null;
      return { leagueId: l.id, leagueName: l.name, role: m.role, inviteCode: l.inviteCode, teamLabel: t ? `Team ${t.slotNumber} (${t.name})` : "No team" };
    })
    .filter(Boolean);
}

function updateDraftSubview() {
  const draft = state.currentSubview === "draft";
  ui.draftLayout.classList.toggle("view-hidden", !draft);
  ui.teamsColumnsView.classList.toggle("view-hidden", draft);
  ui.draftViewButton.classList.toggle("active-view", draft);
  ui.teamsViewButton.classList.toggle("active-view", !draft);
}

function ordinal(n) {
  const abs = Math.abs(Number(n) || 0);
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${abs}th`;
  const mod10 = abs % 10;
  if (mod10 === 1) return `${abs}st`;
  if (mod10 === 2) return `${abs}nd`;
  if (mod10 === 3) return `${abs}rd`;
  return `${abs}th`;
}

function eliminationBadge(draft, playerId) {
  const n = draft.eliminationByPlayerId[playerId];
  if (!n) return null;
  const place = Math.max(1, state.players.length - Number(n) + 1);
  const b = document.createElement("span");
  b.className = "elimination-badge";
  b.textContent = String(place);
  b.title = `${ordinal(place)} place`;
  return b;
}

function openAssign(leagueId, playerId) {
  const ctx = ctxForLeague(leagueId);
  if (!ctx) return;
  state.assignTargetPlayerId = playerId;
  ui.assignPlayerName.textContent = state.players.find((p) => p.id === playerId)?.name || "";
  ui.assignSelect.innerHTML = "";

  const currentTeamId = ctx.draft.assignmentByPlayerId[playerId] || null;
  const currentTeam = currentTeamId ? ctx.teams.find((t) => t.id === currentTeamId) : null;
  if (!currentTeam || canUnassignPlayer(ctx.user, ctx.membership, currentTeam) || ctx.membership.role === "admin") {
    const o = document.createElement("option");
    o.value = "";
    o.textContent = "Unassigned";
    ui.assignSelect.appendChild(o);
  }
  ctx.teams.forEach((t) => {
    if (!canAssignPlayer(ctx.user, ctx.membership, t)) return;
    const o = document.createElement("option");
    o.value = t.id;
    o.textContent = t.name;
    ui.assignSelect.appendChild(o);
  });
  if (ui.assignSelect.options.length === 0) {
    msg("league", "You can only edit your own team.");
    return;
  }
  ui.assignSelect.value = currentTeamId || "";
  ui.assignModal.classList.remove("hidden");
}

function closeAssign() {
  state.assignTargetPlayerId = null;
  ui.assignModal.classList.add("hidden");
}

function updateEliminateButton(ctx, playerId) {
  const n = ctx.draft.eliminationByPlayerId[playerId];
  if (n) {
    const place = Math.max(1, state.players.length - Number(n) + 1);
    if (ctx.membership.role === "admin") {
      ui.detailsEliminateButton.disabled = false;
      ui.detailsEliminateButton.textContent = `Undo Elimination (${ordinal(place)} place)`;
    } else {
      ui.detailsEliminateButton.disabled = true;
      ui.detailsEliminateButton.textContent = `Eliminated (${ordinal(place)} place)`;
    }
    return;
  }
  ui.detailsEliminateButton.disabled = !canEliminate(ctx, playerId);
  ui.detailsEliminateButton.textContent = "Eliminated";
}

function openDetails(leagueId, playerId) {
  const ctx = ctxForLeague(leagueId);
  const p = state.players.find((x) => x.id === playerId);
  if (!ctx || !p) return;
  state.detailsTargetPlayerId = playerId;
  ui.detailsPhoto.src = p.photoUrl;
  ui.detailsPhoto.alt = p.name;
  ui.detailsName.textContent = p.name;
  ui.detailsAge.textContent = p.age ?? "Unknown";
  ui.detailsTribe.textContent = p.tribe ?? "Unknown";
  ui.detailsSeasons.innerHTML = "";
  (Array.isArray(p.seasons) ? p.seasons : []).forEach((s) => {
    const li = document.createElement("li");
    li.textContent = typeof s === "number" ? `Season ${s}` : (s.placement ? `${s.season} (${s.placement})` : s.season);
    ui.detailsSeasons.appendChild(li);
  });
  if (!ui.detailsSeasons.children.length) {
    const li = document.createElement("li");
    li.textContent = "No season data available yet.";
    ui.detailsSeasons.appendChild(li);
  }
  updateEliminateButton(ctx, playerId);
  ui.detailsModal.classList.remove("hidden");
}

function closeDetails() {
  state.detailsTargetPlayerId = null;
  ui.detailsModal.classList.add("hidden");
}

function teamCard(ctx, team) {
  const card = document.createElement("article");
  card.className = "team-card";
  const input = document.createElement("input");
  input.className = "team-name-input";
  input.value = team.name;
  input.disabled = !canRenameTeam(ctx.user, ctx.membership, team);
  input.addEventListener("change", (e) => {
    try { renameTeam(ctx, team.id, e.target.value); render(); }
    catch (err) { msg("league", err.message); render(); }
  });
  card.appendChild(input);
  const owner = document.createElement("p");
  owner.className = "muted";
  owner.textContent = team.ownerUserId ? `Owner: ${(state.db.users.find((u) => u.id === team.ownerUserId) || {}).displayName || "Unknown"}` : "Owner: Unclaimed";
  card.appendChild(owner);
  const ul = document.createElement("ul");
  ul.className = "roster-list";
  const pids = Object.entries(ctx.draft.assignmentByPlayerId).filter(([, t]) => t === team.id).map(([pid]) => pid);
  if (!pids.length) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No players assigned";
    ul.appendChild(li);
  }
  pids.forEach((pid) => {
    const p = state.players.find((x) => x.id === pid);
    if (!p) return;
    const li = document.createElement("li");
    li.className = "roster-item";
    li.innerHTML = `<span>${p.name}</span>`;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secondary";
    b.textContent = "Unassign";
    b.disabled = !canUnassignPlayer(ctx.user, ctx.membership, team);
    b.addEventListener("click", () => {
      try { assignPlayer(ctx, p.id, null); render(); }
      catch (err) { msg("league", err.message); render(); }
    });
    li.appendChild(b);
    ul.appendChild(li);
  });
  card.appendChild(ul);
  return card;
}

function playerCard(ctx, p) {
  const card = document.createElement("article");
  card.className = "player-card";
  const wrap = document.createElement("div");
  wrap.className = "photo-wrap";
  const img = document.createElement("img");
  img.className = "player-photo";
  img.src = p.photoUrl;
  img.alt = p.name;
  img.addEventListener("click", () => openDetails(ctx.league.id, p.id));
  wrap.appendChild(img);
  const badge = eliminationBadge(ctx.draft, p.id);
  if (badge) wrap.appendChild(badge);
  card.appendChild(wrap);
  const h = document.createElement("h3");
  h.textContent = p.name;
  card.appendChild(h);
  const tid = ctx.draft.assignmentByPlayerId[p.id];
  const team = tid ? ctx.teams.find((t) => t.id === tid) : null;
  const info = document.createElement("p");
  info.className = "team-indicator";
  info.textContent = `Team: ${team ? team.name : "Unassigned"}`;
  card.appendChild(info);
  const actions = document.createElement("div");
  actions.className = "card-actions";
  const d = document.createElement("button");
  d.className = "secondary";
  d.textContent = "Details";
  d.addEventListener("click", () => openDetails(ctx.league.id, p.id));
  const a = document.createElement("button");
  a.textContent = "Assign";
  a.addEventListener("click", () => openAssign(ctx.league.id, p.id));
  a.disabled = !ctx.teams.some((t) => canAssignPlayer(ctx.user, ctx.membership, t));
  actions.appendChild(d);
  actions.appendChild(a);
  card.appendChild(actions);
  return card;
}

function teamColumn(ctx, team) {
  const col = document.createElement("article");
  col.className = "team-column";
  const h = document.createElement("h3");
  h.textContent = team.name;
  col.appendChild(h);
  const grid = document.createElement("div");
  grid.className = "team-column-photos";
  const pids = Object.entries(ctx.draft.assignmentByPlayerId).filter(([, t]) => t === team.id).map(([pid]) => pid);
  if (!pids.length) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "No players";
    col.appendChild(p);
    return col;
  }
  pids.forEach((pid) => {
    const p = state.players.find((x) => x.id === pid);
    if (!p) return;
    const f = document.createElement("figure");
    f.className = "team-photo-card";
    const wrap = document.createElement("div");
    wrap.className = "photo-wrap";
    const img = document.createElement("img");
    img.className = "team-photo";
    img.src = p.photoUrl;
    img.alt = p.name;
    img.addEventListener("click", () => openDetails(ctx.league.id, p.id));
    wrap.appendChild(img);
    const badge = eliminationBadge(ctx.draft, p.id);
    if (badge) wrap.appendChild(badge);
    f.appendChild(wrap);
    const cap = document.createElement("figcaption");
    cap.textContent = p.name;
    f.appendChild(cap);
    grid.appendChild(f);
  });
  col.appendChild(grid);
  return col;
}

function firstSeasonNumber(player) {
  const seasons = Array.isArray(player.seasons) ? player.seasons : [];
  const nums = seasons
    .map((entry) => {
      if (typeof entry === "number") return entry;
      if (entry && typeof entry.season === "string") {
        const match = entry.season.match(/\d+/);
        return match ? Number(match[0]) : null;
      }
      return null;
    })
    .filter((n) => Number.isFinite(n));
  if (nums.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(...nums);
}

function sortDraftPlayers(players) {
  const sorted = [...players];
  if (state.draftFilter === "season") {
    sorted.sort((a, b) => {
      const aSeason = firstSeasonNumber(a);
      const bSeason = firstSeasonNumber(b);
      if (aSeason !== bSeason) return aSeason - bSeason;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }
  sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

function renderLeagues() {
  const user = currentUser();
  if (!user) { go("#/login"); return; }
  toggleView("leagues");
  ui.leaguesList.innerHTML = "";
  const rows = leagueRows(user.id);
  if (!rows.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No leagues yet.";
    ui.leaguesList.appendChild(p);
  }
  rows.forEach((r) => {
    const item = document.createElement("article");
    item.className = "league-item";
    item.innerHTML = `<div><h4>${r.leagueName}</h4><p class="muted">Role: ${r.role} | ${r.teamLabel}</p><p class="muted">Invite Code: ${r.inviteCode}</p></div>`;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secondary";
    b.textContent = "Open";
    b.addEventListener("click", () => go(`#/league/${r.leagueId}`));
    item.appendChild(b);
    ui.leaguesList.appendChild(item);
  });
}

function renderLeague(leagueId) {
  const ctx = ctxForLeague(leagueId);
  if (!ctx) { msg("leagues", "League not found or access denied."); go("#/leagues"); return; }
  toggleView("league");
  ui.leagueTitle.textContent = ctx.league.name;
  const myTeam = ctx.membership.teamId ? ctx.teams.find((t) => t.id === ctx.membership.teamId) : null;
  ui.leagueMeta.textContent = `Role: ${ctx.membership.role} | ${myTeam ? `Team ${myTeam.slotNumber} (${myTeam.name})` : "No team assigned"}`;
  ui.leagueInviteCode.textContent = `Invite Code: ${ctx.league.inviteCode}`;
  ui.resetButton.classList.toggle("view-hidden", !canResetLeague(ctx.user, ctx.membership, ctx.league));

  const isAdmin = ctx.membership.role === "admin";
  ui.adminAssignCard.classList.toggle("view-hidden", !isAdmin);
  if (isAdmin) {
    ui.adminAssignTeamSelect.innerHTML = "";
    ctx.teams.forEach((team) => {
      const owner = team.ownerUserId ? state.db.users.find((u) => u.id === team.ownerUserId) : null;
      const option = document.createElement("option");
      option.value = team.id;
      option.textContent = owner
        ? `Team ${team.slotNumber} - ${team.name} (Owner: ${owner.displayName})`
        : `Team ${team.slotNumber} - ${team.name} (Open)`;
      ui.adminAssignTeamSelect.appendChild(option);
    });
  }

  updateDraftSubview();
  ui.teamsContainer.innerHTML = "";
  ui.playersContainer.innerHTML = "";
  ui.teamColumnsContainer.innerHTML = "";
  ctx.teams.forEach((t) => ui.teamsContainer.appendChild(teamCard(ctx, t)));
  const unassignedPlayers = sortDraftPlayers(state.players.filter((p) => !ctx.draft.assignmentByPlayerId[p.id]));
  ui.draftFilterSelect.value = state.draftFilter;
  if (unassignedPlayers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "All players are assigned.";
    ui.playersContainer.appendChild(empty);
  } else {
    unassignedPlayers.forEach((p) => ui.playersContainer.appendChild(playerCard(ctx, p)));
  }
  ctx.teams.forEach((t) => ui.teamColumnsContainer.appendChild(teamColumn(ctx, t)));
}

function render() {
  renderAuth();
  const r = route();
  const user = currentUser();
  if (!user && r.name !== "login") { go("#/login"); return; }
  if (user && r.name === "login") { go("#/leagues"); return; }
  if (r.name === "login") { toggleView("login"); return; }
  if (r.name === "leagues") { renderLeagues(); return; }
  if (r.name === "league") { renderLeague(r.leagueId); return; }
  toggleView("login");
}

function wire() {
  window.addEventListener("hashchange", () => { msg("", ""); render(); });
  ui.authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try { signIn(ui.authEmail.value); msg("", ""); go("#/leagues"); }
    catch (err) { msg("login", err.message); render(); }
  });
  ui.signUpButton.addEventListener("click", () => {
    try { signUp(ui.authEmail.value, ui.authDisplayName.value); msg("", ""); go("#/leagues"); }
    catch (err) { msg("login", err.message); render(); }
  });
  ui.logoutButton.addEventListener("click", () => { signOut(); msg("", ""); go("#/login"); });

  ui.createLeagueForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = currentUser();
    if (!user) { go("#/login"); return; }
    try {
      const l = createLeague(ui.createLeagueName.value, user.id);
      ui.createLeagueForm.reset();
      msg("leagues", `League created: ${l.name}. Invite code: ${l.inviteCode}`);
      render();
    } catch (err) {
      msg("leagues", err.message);
      render();
    }
  });

  ui.joinLeagueForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = currentUser();
    if (!user) { go("#/login"); return; }
    try {
      const normalizedInput = code(ui.joinLeagueCode.value);
      const result = joinLeague(normalizedInput, user.id);
      ui.joinLeagueForm.reset();
      msg("leagues", `Joined ${result.league.name}. You are Team ${result.slotNumber}.`);
      render();
    } catch (err) {
      msg("leagues", err.message);
      render();
    }
  });

  ui.adminAssignForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    try {
      const assignedTeam = adminAssignUserToTeam(ctx, ui.adminAssignEmail.value, ui.adminAssignTeamSelect.value);
      ui.adminAssignForm.reset();
      msg("league", `User assigned to Team ${assignedTeam.slotNumber} (${assignedTeam.name}).`);
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });

  ui.backToLeaguesButton.addEventListener("click", () => go("#/leagues"));
  ui.draftViewButton.addEventListener("click", () => { state.currentSubview = "draft"; updateDraftSubview(); });
  ui.teamsViewButton.addEventListener("click", () => { state.currentSubview = "teams"; updateDraftSubview(); });
  ui.draftFilterSelect.addEventListener("change", () => {
    state.draftFilter = ui.draftFilterSelect.value === "season" ? "season" : "alpha";
    const r = route();
    if (r.name === "league") render();
  });

  ui.resetButton.addEventListener("click", () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    if (!confirm("Reset this league draft?")) return;
    try { resetLeague(ctx); msg("", ""); render(); }
    catch (err) { msg("league", err.message); render(); }
  });

  ui.assignConfirm.addEventListener("click", () => {
    const r = route();
    if (r.name !== "league" || !state.assignTargetPlayerId) { closeAssign(); return; }
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) { closeAssign(); return; }
    try { assignPlayer(ctx, state.assignTargetPlayerId, ui.assignSelect.value || null); closeAssign(); msg("", ""); render(); }
    catch (err) { closeAssign(); msg("league", err.message); render(); }
  });
  ui.assignCancel.addEventListener("click", closeAssign);
  ui.assignModal.addEventListener("click", (e) => { if (e.target === ui.assignModal) closeAssign(); });

  ui.detailsEliminateButton.addEventListener("click", () => {
    const r = route();
    if (r.name !== "league" || !state.detailsTargetPlayerId) return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    try {
      if (ctx.draft.eliminationByPlayerId[state.detailsTargetPlayerId]) {
        undoEliminated(ctx, state.detailsTargetPlayerId);
      } else {
        markEliminated(ctx, state.detailsTargetPlayerId);
      }
      msg("", "");
      render();
      updateEliminateButton(ctxForLeague(r.leagueId), state.detailsTargetPlayerId);
    }
    catch (err) { msg("league", err.message); render(); }
  });
  ui.detailsCloseTop.addEventListener("click", closeDetails);
  ui.detailsCloseBottom.addEventListener("click", closeDetails);
  ui.detailsModal.addEventListener("click", (e) => { if (e.target === ui.detailsModal) closeDetails(); });
}

async function init() {
  state.players = await loadPlayers();
  state.db = loadDb();
  state.session = loadSession();
  wire();
  render();
}

init();
