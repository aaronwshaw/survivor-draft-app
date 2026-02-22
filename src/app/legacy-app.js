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
  authMode: "login",
  currentSubview: "draft",
  showTurnPreview: false,
  draftFilter: "alpha",
  tribeFilter: "all",
  assignTargetPlayerId: null,
  detailsTargetPlayerId: null,
  teamsViewTeamId: null,
  isEditingTeamName: false,
  isEditingGlobalTribeId: null,
  teamAssignmentEditingTeamId: null,
  liveSyncTimer: null,
  liveSyncInFlight: false,
  liveSyncIntervalMs: 0,
  teamAssignmentsMsgTimer: null
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
  authUsername: document.getElementById("authUsername"),
  authPassword: document.getElementById("authPassword"),
  authDisplayNameField: document.getElementById("authDisplayNameField"),
  authDisplayName: document.getElementById("authDisplayName"),
  authSubmitButton: document.getElementById("authSubmitButton"),
  landingLoginOption: document.getElementById("landingLoginOption"),
  landingCreateOption: document.getElementById("landingCreateOption"),
  leaguesList: document.getElementById("leaguesList"),
  createLeagueForm: document.getElementById("createLeagueForm"),
  createLeagueName: document.getElementById("createLeagueName"),
  joinLeagueForm: document.getElementById("joinLeagueForm"),
  joinLeagueCode: document.getElementById("joinLeagueCode"),
  leagueTitle: document.getElementById("leagueTitle"),
  leagueMeta: document.getElementById("leagueMeta"),
  leagueInfoCard: document.getElementById("leagueInfoCard"),
  leagueInviteCode: document.getElementById("leagueInviteCode"),
  copyInviteCodeButton: document.getElementById("copyInviteCodeButton"),
  turnBanner: document.getElementById("turnBanner"),
  turnBannerText: document.getElementById("turnBannerText"),
  turnPreview: document.getElementById("turnPreview"),
  turnPreviewList: document.getElementById("turnPreviewList"),
  draftOrderNavButton: document.getElementById("draftOrderNavButton"),
  draftOrderView: document.getElementById("draftOrderView"),
  leagueManagementView: document.getElementById("leagueManagementView"),
  draftTurnStatus: document.getElementById("draftTurnStatus"),
  draftOrderList: document.getElementById("draftOrderList"),
  randomizeDraftOrderButton: document.getElementById("randomizeDraftOrderButton"),
  startDraftButton: document.getElementById("startDraftButton"),
  stopDraftButton: document.getElementById("stopDraftButton"),
  teamAssignmentsView: document.getElementById("teamAssignmentsView"),
  addTeamButton: document.getElementById("addTeamButton"),
  teamAssignmentsTableBody: document.getElementById("teamAssignmentsTableBody"),
  teamAssignmentsMessage: document.getElementById("teamAssignmentsMessage"),
  backToLeaguesButton: document.getElementById("backToLeaguesButton"),
  draftViewButton: document.getElementById("draftViewButton"),
  teamsViewButton: document.getElementById("teamsViewButton"),
  yourTeamViewButton: document.getElementById("yourTeamViewButton"),
  survivorMgmtViewButton: document.getElementById("survivorMgmtViewButton"),
  resetButton: document.getElementById("resetButton"),
  draftLayout: document.getElementById("draftLayout"),
  teamsColumnsView: document.getElementById("teamsColumnsView"),
  yourTeamView: document.getElementById("yourTeamView"),
  survivorManagementView: document.getElementById("survivorManagementView"),
  tribeManagementList: document.getElementById("tribeManagementList"),
  newGlobalTribeName: document.getElementById("newGlobalTribeName"),
  newGlobalTribeColor: document.getElementById("newGlobalTribeColor"),
  createGlobalTribeButton: document.getElementById("createGlobalTribeButton"),
  survivorPlayersGrid: document.getElementById("survivorPlayersGrid"),
  yourTeamNameDisplay: document.getElementById("yourTeamNameDisplay"),
  yourTeamNameInput: document.getElementById("yourTeamNameInput"),
  yourTeamMeta: document.getElementById("yourTeamMeta"),
  yourTeamPlayers: document.getElementById("yourTeamPlayers"),
  editTeamNameButton: document.getElementById("editTeamNameButton"),
  saveTeamNameButton: document.getElementById("saveTeamNameButton"),
  teamsContainer: document.getElementById("teamsContainer"),
  playersContainer: document.getElementById("playersContainer"),
  draftFilterSelect: document.getElementById("draftFilterSelect"),
  tribeFilterSelect: document.getElementById("tribeFilterSelect"),
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
  tribeAssignSection: document.getElementById("tribeAssignSection"),
  tribeAssignToggle: document.getElementById("tribeAssignToggle"),
  tribeAssignPanel: document.getElementById("tribeAssignPanel"),
  tribeSelect: document.getElementById("tribeSelect"),
  newTribeName: document.getElementById("newTribeName"),
  tribeColorSelect: document.getElementById("tribeColorSelect"),
  saveTribeButton: document.getElementById("saveTribeButton"),
  detailsEliminateButton: document.getElementById("detailsEliminateButton"),
  detailsCloseTop: document.getElementById("detailsCloseTop"),
  detailsCloseBottom: document.getElementById("detailsCloseBottom"),
  topMenuToggle: document.getElementById("topMenuToggle"),
  topBarMenu: document.getElementById("topBarMenu"),
  globalLeagueNav: document.getElementById("globalLeagueNav")
};

function nowIso() { return new Date().toISOString(); }
function email(v) { return String(v || "").trim().toLowerCase(); }
function code(v) { return String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function normalizeName(v) { return String(v || "").trim().toLowerCase(); }
const EMPTY_DB = { users: [], leagues: [], teams: [], memberships: [], draftStates: [], tribes: [] };

function isMobileLayout() {
  return typeof window !== "undefined" && window.innerWidth <= 768;
}

async function apiJson(url, options) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(json?.error || `Request failed (${response.status}).`));
  }
  return json;
}

function loadDb() {
  try { return JSON.parse(localStorage.getItem(DB_KEY)) || EMPTY_DB; }
  catch { return EMPTY_DB; }
}
function saveDb() { localStorage.setItem(DB_KEY, JSON.stringify(state.db)); }
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || { currentUserId: null }; }
  catch { return { currentUserId: null }; }
}
function saveSession() { localStorage.setItem(SESSION_KEY, JSON.stringify(state.session)); }

function clearLiveSync() {
  if (state.liveSyncTimer) {
    clearInterval(state.liveSyncTimer);
    state.liveSyncTimer = null;
  }
  state.liveSyncIntervalMs = 0;
}

function desiredLiveSyncInterval() {
  const user = currentUser();
  if (!user) return 0;
  const r = route();
  if (r.name !== "league") return 0;
  const ctx = ctxForLeague(r.leagueId);
  if (!ctx) return 0;
  const draft = ensureDraftConfig(ctx);
  return draft.isDraftActive ? 15000 : 0;
}

function isEditingField() {
  const active = document.activeElement;
  if (!active || !(active instanceof HTMLElement)) return false;
  if (active.isContentEditable) return true;
  return !!active.closest("input, textarea, select");
}

function ensureLiveSync() {
  const interval = desiredLiveSyncInterval();
  if (interval === 0) {
    clearLiveSync();
    return;
  }
  if (state.liveSyncTimer && state.liveSyncIntervalMs === interval) return;
  clearLiveSync();
  state.liveSyncIntervalMs = interval;
  state.liveSyncTimer = setInterval(async () => {
    if (state.liveSyncInFlight) return;
    const r = route();
    if (r.name !== "league") return;
    if (!currentUser()) return;
    if (isEditingField()) return;
    state.liveSyncInFlight = true;
    try {
      await syncDb();
      if (isEditingField()) return;
      render();
    } catch {
      // keep polling; transient network issues should self-heal
    } finally {
      state.liveSyncInFlight = false;
    }
  }, interval);
}

function msg(view, text) {
  ui.loginMessage.textContent = view === "login" ? text : "";
  ui.leaguesMessage.textContent = view === "leagues" ? text : "";
  ui.leagueMessage.textContent = view === "league" ? text : "";
}

function showTeamAssignmentsMessage(text) {
  if (!ui.teamAssignmentsMessage) return;
  ui.teamAssignmentsMessage.textContent = text;
  if (state.teamAssignmentsMsgTimer) {
    clearTimeout(state.teamAssignmentsMsgTimer);
  }
  state.teamAssignmentsMsgTimer = setTimeout(() => {
    ui.teamAssignmentsMessage.textContent = "";
    state.teamAssignmentsMsgTimer = null;
  }, 1800);
}

function styleTribeColorOptions() {
  const selects = [ui.tribeColorSelect, ui.newGlobalTribeColor].filter(Boolean);
  selects.forEach((selectEl) => {
    Array.from(selectEl.options).forEach((option) => {
      option.style.color = option.value;
      option.textContent = option.textContent || "";
    });
  });
}

function setAuthMode(mode) {
  state.authMode = mode === "signup" ? "signup" : "login";
  const isSignup = state.authMode === "signup";
  ui.authDisplayNameField.hidden = !isSignup;
  ui.authDisplayName.required = isSignup;
  ui.authSubmitButton.textContent = isSignup ? "Create Account" : "Login";
  ui.landingLoginOption.classList.toggle("active-mode", !isSignup);
  ui.landingCreateOption.classList.toggle("active-mode", isSignup);
}

function currentUser() { return state.db.users.find((u) => u.id === state.session.currentUserId) || null; }
function leagueById(leagueId) { return state.db.leagues.find((l) => l.id === leagueId) || null; }
function teamsByLeague(leagueId) { return state.db.teams.filter((t) => t.leagueId === leagueId).sort((a, b) => a.slotNumber - b.slotNumber); }
function membership(userId, leagueId) { return state.db.memberships.find((m) => m.userId === userId && m.leagueId === leagueId) || null; }

function draftState(leagueId) {
  let d = state.db.draftStates.find((x) => x.leagueId === leagueId);
  if (!d) {
    d = { leagueId, assignmentByPlayerId: {}, updatedAt: nowIso() };
    state.db.draftStates.push(d);
    saveDb();
  }
  return d;
}

function ensureDraftConfig(ctx) {
  const d = draftState(ctx.league.id);
  if (!Array.isArray(d.draftOrderTeamIds) || d.draftOrderTeamIds.length !== ctx.teams.length) {
    d.draftOrderTeamIds = ctx.teams.map((t) => t.id);
  }
  if (typeof d.currentPickIndex !== "number") d.currentPickIndex = 0;
  if (typeof d.roundNumber !== "number") d.roundNumber = 1;
  if (d.direction !== -1 && d.direction !== 1) d.direction = 1;
  if (typeof d.isDraftActive !== "boolean") d.isDraftActive = false;
  return d;
}

function currentTurnTeamId(draft) {
  if (!draft.isDraftActive) return null;
  if (!Array.isArray(draft.draftOrderTeamIds) || draft.draftOrderTeamIds.length === 0) return null;
  const idx = Math.max(0, Math.min(draft.draftOrderTeamIds.length - 1, Number(draft.currentPickIndex) || 0));
  return draft.draftOrderTeamIds[idx] || null;
}

function applyDraftState(draft, payload) {
  if (payload.assignmentByPlayerId) draft.assignmentByPlayerId = payload.assignmentByPlayerId;
  if (Array.isArray(payload.draftOrderTeamIds)) draft.draftOrderTeamIds = payload.draftOrderTeamIds;
  if (typeof payload.currentPickIndex === "number") draft.currentPickIndex = payload.currentPickIndex;
  if (typeof payload.roundNumber === "number") draft.roundNumber = payload.roundNumber;
  if (payload.direction === -1 || payload.direction === 1) draft.direction = payload.direction;
  if (typeof payload.isDraftActive === "boolean") draft.isDraftActive = payload.isDraftActive;
  draft.updatedAt = nowIso();
}

function teamForPick(ctx, draft) {
  const teamId = currentTurnTeamId(draft);
  if (!teamId) return null;
  return ctx.teams.find((t) => t.id === teamId) || null;
}

function myTurn(ctx, draft) {
  const mine = myTeam(ctx);
  if (!mine) return false;
  return currentTurnTeamId(draft) === mine.id;
}

async function loadPlayers() {
  const localDataModule = await import("../data/players.json");
  const localPlayers = Array.isArray(localDataModule.default) ? localDataModule.default : [];
  const localById = new Map(localPlayers.map((p) => [p.id, p]));
  const localByName = new Map(localPlayers.map((p) => [normalizeName(p.name), p]));
  const mergeLocalSeasons = (rows) => rows.map((row) => {
    const seasons = normalizeSeasons(row.seasons);
    if (seasons.length > 0) return { ...row, seasons };
    const local = localById.get(row.id) || localByName.get(normalizeName(row.name));
    return {
      ...row,
      seasons: normalizeSeasons(local?.seasons),
    };
  });

  try {
    const r = await fetch("/api/players", { cache: "no-store" });
    if (!r.ok) throw new Error("missing");
    const rows = await r.json();
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("empty");
    return mergeLocalSeasons(rows);
  } catch {
    return mergeLocalSeasons(JSON.parse(JSON.stringify(FALLBACK_PLAYERS)));
  }
}

async function syncDb() {
  const userId = state.session?.currentUserId;
  if (!userId) {
    state.db = EMPTY_DB;
    saveDb();
    return;
  }
  const result = await apiJson(`/api/legacy/sync?userId=${encodeURIComponent(userId)}&t=${Date.now()}`, {
    method: "GET",
    cache: "no-store",
  });
  state.db = {
    users: result.users || [],
    leagues: result.leagues || [],
    teams: result.teams || [],
    memberships: result.memberships || [],
    draftStates: result.draftStates || [],
    tribes: result.tribes || [],
  };
  state.players = await loadPlayers();
  saveDb();
}

function normalizeSeasons(rawSeasons) {
  if (Array.isArray(rawSeasons)) return rawSeasons;
  if (typeof rawSeasons === "string") {
    try {
      const parsed = JSON.parse(rawSeasons);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (rawSeasons && typeof rawSeasons === "object") {
    const values = Object.values(rawSeasons);
    return Array.isArray(values) ? values : [];
  }
  return [];
}

async function signUp(rawUsername, rawPassword, displayName) {
  const username = email(rawUsername);
  if (!username) throw new Error("Username is required.");
  const name = String(displayName || "").trim();
  if (!name) throw new Error("Display name is required for account creation.");
  const result = await apiJson("/api/legacy/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password: String(rawPassword || ""), displayName: name }),
  });
  state.session.currentUserId = result.user.id;
  saveSession();
  await syncDb();
}

async function signIn(rawUsername, rawPassword) {
  const username = email(rawUsername);
  if (!username) throw new Error("Username is required.");
  const result = await apiJson("/api/legacy/auth/signin", {
    method: "POST",
    body: JSON.stringify({ username, password: String(rawPassword || "") }),
  });
  state.session.currentUserId = result.user.id;
  saveSession();
  await syncDb();
}

function signOut() {
  state.session.currentUserId = null;
  saveSession();
  state.db = EMPTY_DB;
  saveDb();
  clearLiveSync();
}

async function createLeague(name, ownerUserId) {
  const leagueName = String(name || "").trim();
  if (!leagueName) throw new Error("League name is required.");
  const result = await apiJson("/api/legacy/leagues/create", {
    method: "POST",
    body: JSON.stringify({ userId: ownerUserId, leagueName }),
  });
  await syncDb();
  return result.league;
}

async function joinLeague(rawCode, userId) {
  const result = await apiJson("/api/legacy/leagues/join", {
    method: "POST",
    body: JSON.stringify({ userId, inviteCode: String(rawCode || "") }),
  });
  await syncDb();
  return result.result;
}

async function persistLeagueManagementUpdate(ctx, payload) {
  return apiJson("/api/legacy/league/management", {
    method: "POST",
    body: JSON.stringify({
      action: "updateRow",
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      ...payload,
    }),
  });
}

async function addLeagueTeam(ctx, teamName = "") {
  return apiJson("/api/legacy/league/management", {
    method: "POST",
    body: JSON.stringify({
      action: "addTeam",
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      teamName,
    }),
  });
}

async function removeUserFromLeague(ctx, targetUserId) {
  return apiJson("/api/legacy/league/management", {
    method: "POST",
    body: JSON.stringify({
      action: "removeUser",
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      targetUserId,
    }),
  });
}

async function deleteTeamFromLeague(ctx, targetTeamId) {
  return apiJson("/api/legacy/league/management", {
    method: "POST",
    body: JSON.stringify({
      action: "deleteTeam",
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      targetTeamId,
    }),
  });
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

function myTeam(ctx) {
  if (!ctx?.membership?.teamId) return null;
  return ctx.teams.find((t) => t.id === ctx.membership.teamId) || null;
}

async function renameTeam(ctx, teamId, name) {
  const team = state.db.teams.find((t) => t.id === teamId && t.leagueId === ctx.league.id);
  if (!team) throw new Error("Team not found.");
  if (!canRenameTeam(ctx.user, ctx.membership, team)) throw new Error("You can only edit your own team.");
  const trimmed = String(name || "").trim();
  if (!trimmed) throw new Error("Team name is required.");
  await apiJson("/api/legacy/team/rename", {
    method: "POST",
    body: JSON.stringify({
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      teamId: team.id,
      name: trimmed,
    }),
  });
  await syncDb();
}

async function persistPlayerAssignment(ctx, playerId, teamIdOrNull) {
  return apiJson("/api/legacy/draft/assign", {
    method: "POST",
    body: JSON.stringify({
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      playerId,
      teamId: teamIdOrNull,
    }),
  });
}

async function persistSurvivorPlayer(ctx, playerId, tribeId, eliminated) {
  return apiJson("/api/legacy/survivor/player", {
    method: "POST",
    body: JSON.stringify({
      userId: ctx.user.id,
      playerId,
      tribeId,
      eliminated,
    }),
  });
}

async function persistSurvivorTribe(ctx, tribeId, name, color) {
  return apiJson("/api/legacy/survivor/tribes", {
    method: "POST",
    body: JSON.stringify({
      userId: ctx.user.id,
      tribeId,
      name,
      color,
    }),
  });
}

async function persistDraftConfig(ctx, action, extra = {}) {
  return apiJson("/api/legacy/draft/config", {
    method: "POST",
    body: JSON.stringify({
      userId: ctx.user.id,
      leagueId: ctx.league.id,
      action,
      ...extra,
    }),
  });
}

async function assignPlayer(ctx, playerId, teamIdOrNull) {
  const draft = ensureDraftConfig(ctx);
  const currentTeamId = draft.assignmentByPlayerId[playerId] || null;
  const currentTeam = currentTeamId ? state.db.teams.find((t) => t.id === currentTeamId) : null;

  if (teamIdOrNull === null) {
    if (!currentTeam || !canUnassignPlayer(ctx.user, ctx.membership, currentTeam)) throw new Error("You can only edit your own team.");
    const result = await persistPlayerAssignment(ctx, playerId, null);
    applyDraftState(draft, result);
    saveDb();
    return;
  }

  const target = state.db.teams.find((t) => t.id === teamIdOrNull && t.leagueId === ctx.league.id);
  if (!target) throw new Error("Target team not found.");
  if (!canAssignPlayer(ctx.user, ctx.membership, target)) throw new Error("You can only edit your own team.");
  if (currentTeam && currentTeam.id !== target.id && !canUnassignPlayer(ctx.user, ctx.membership, currentTeam)) {
    throw new Error("You can only edit your own team.");
  }
  const result = await persistPlayerAssignment(ctx, playerId, target.id);
  applyDraftState(draft, result);
  saveDb();
}

async function claimPlayer(ctx, playerId) {
  if (ctx.membership.role === "admin") throw new Error("Admins should use Assign.");
  const draft = ensureDraftConfig(ctx);
  if (!draft.isDraftActive) {
    throw new Error("Draft has not started yet.");
  }
  if (!myTurn(ctx, draft)) {
    throw new Error("It is not your turn.");
  }
  const mine = myTeam(ctx);
  if (!mine) throw new Error("You are not assigned to a team.");
  const currentTeamId = draft.assignmentByPlayerId[playerId] || null;
  if (currentTeamId && currentTeamId !== mine.id) {
    throw new Error("This player is already claimed by another team.");
  }
  await assignPlayer(ctx, playerId, mine.id);
}

async function resetLeague(ctx) {
  if (!canResetLeague(ctx.user, ctx.membership, ctx.league)) throw new Error("Only admins can reset this league.");
  await persistDraftConfig(ctx, "reset");
  await syncDb();
}

function tribeForId(tribeId) {
  if (!tribeId) return null;
  return (state.db.tribes || []).find((tribe) => tribe.id === tribeId) || null;
}

function nextEliminationNumber() {
  const nums = state.players
    .map((player) => Number(player.eliminated) || 0)
    .filter((n) => n > 0);
  return nums.length === 0 ? 1 : Math.max(...nums) + 1;
}

async function updatePlayerSurvivorState(ctx, playerId, nextTribeId, nextEliminated) {
  if (!ctx.user.isOwner) throw new Error("Only owners can manage survivor data.");
  await persistSurvivorPlayer(ctx, playerId, nextTribeId || null, nextEliminated || null);
  await syncDb();
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
  ui.globalLeagueNav.classList.toggle("view-hidden", name !== "league");
  if (name !== "league") {
    ui.topBarMenu.classList.remove("open");
    document.body.classList.remove("draft-desktop-lock");
  }
}

function renderAuth() {
  const user = currentUser();
  ui.logoutButton.classList.toggle("view-hidden", !user);
  ui.currentUserLabel.textContent = user ? `${user.displayName} (@${user.username || user.email})` : "";
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
  const isDraft = state.currentSubview === "draft";
  const isTeams = state.currentSubview === "teams";
  const isOrder = state.currentSubview === "order";
  const isYourTeam = state.currentSubview === "yourteam";
  const isSurvivor = state.currentSubview === "survivor";
  ui.draftLayout.classList.toggle("view-hidden", !isDraft);
  ui.teamsColumnsView.classList.toggle("view-hidden", !isTeams);
  ui.leagueManagementView.classList.toggle("view-hidden", !isOrder);
  ui.yourTeamView.classList.toggle("view-hidden", !isYourTeam);
  ui.survivorManagementView.classList.toggle("view-hidden", !isSurvivor);
  ui.leagueInfoCard.classList.toggle("view-hidden", !(isYourTeam || isOrder));
  ui.draftViewButton.classList.toggle("active-view", isDraft);
  ui.teamsViewButton.classList.toggle("active-view", isTeams);
  ui.draftOrderNavButton.classList.toggle("active-view", isOrder);
  ui.yourTeamViewButton.classList.toggle("active-view", isYourTeam);
  ui.survivorMgmtViewButton.classList.toggle("active-view", isSurvivor);
  const shouldLockDesktop = isDraft && !isMobileLayout() && route().name === "league";
  document.body.classList.toggle("draft-desktop-lock", shouldLockDesktop);
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

function eliminationBadge(player) {
  const n = Number(player?.eliminated) || 0;
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
  const player = state.players.find((entry) => entry.id === playerId);
  const n = Number(player?.eliminated) || 0;
  const canManage = !!(ctx.user?.isOwner && state.currentSubview === "survivor");
  if (!canManage) {
    ui.detailsEliminateButton.classList.add("view-hidden");
    return;
  }
  ui.detailsEliminateButton.classList.remove("view-hidden");
  if (n) {
    const place = Math.max(1, state.players.length - Number(n) + 1);
    ui.detailsEliminateButton.disabled = false;
    ui.detailsEliminateButton.textContent = `Uneliminate (${ordinal(place)} place)`;
    return;
  }
  ui.detailsEliminateButton.disabled = false;
  ui.detailsEliminateButton.textContent = "Eliminate";
}

function openDetails(leagueId, playerId) {
  const ctx = ctxForLeague(leagueId);
  const p = state.players.find((x) => x.id === playerId);
  if (!ctx || !p) return;
  const tribe = tribeForId(p.tribe);
  const canManage = !!(ctx.user?.isOwner && state.currentSubview === "survivor");
  state.detailsTargetPlayerId = playerId;
  ui.detailsPhoto.src = p.photoUrl;
  ui.detailsPhoto.alt = p.name;
  ui.detailsName.textContent = p.name;
  ui.detailsAge.textContent = p.age ?? "Unknown";
  ui.detailsTribe.textContent = tribe?.name || "Unknown";
  applyTribeBorder(ui.detailsPhoto, tribe);
  ui.detailsSeasons.innerHTML = "";
  normalizeSeasons(p.seasons).forEach((s) => {
    const li = document.createElement("li");
    li.textContent = typeof s === "number" ? `Season ${s}` : (s.placement ? `${s.season} (${s.placement})` : s.season);
    ui.detailsSeasons.appendChild(li);
  });
  if (!ui.detailsSeasons.children.length) {
    const li = document.createElement("li");
    li.textContent = "No season data available yet.";
    ui.detailsSeasons.appendChild(li);
  }
  ui.tribeAssignSection.classList.toggle("view-hidden", !canManage);
  ui.detailsEliminateButton.classList.toggle("view-hidden", !canManage);
  if (canManage) {
    ui.tribeAssignPanel.classList.add("view-hidden");
    ui.tribeSelect.innerHTML = `<option value="">None</option>`;
    (state.db.tribes || []).forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name}`;
      opt.style.color = t.color || "#111";
      ui.tribeSelect.appendChild(opt);
    });
    ui.tribeSelect.value = tribe?.id || "";
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
  const title = document.createElement("h4");
  title.className = "team-name-text";
  title.textContent = team.name;
  card.appendChild(title);
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
    const canEdit = canUnassignPlayer(ctx.user, ctx.membership, team);
    if (canEdit) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "secondary";
      b.textContent = ctx.membership.role === "admin" ? "Unassign" : "Unclaim";
      b.addEventListener("click", async () => {
        try { await assignPlayer(ctx, p.id, null); render(); }
        catch (err) { msg("league", err.message); render(); }
      });
      li.appendChild(b);
    }
    ul.appendChild(li);
  });
  card.appendChild(ul);
  return card;
}

function playerCard(ctx, p) {
  const tribe = tribeForPlayer(p);
  const card = document.createElement("article");
  card.className = "player-card";
  const wrap = document.createElement("div");
  wrap.className = "photo-wrap";
  const img = document.createElement("img");
  img.className = "player-photo";
  img.src = p.photoUrl;
  img.alt = p.name;
  img.addEventListener("click", () => openDetails(ctx.league.id, p.id));
  applyTribeBorder(img, tribe);
  wrap.appendChild(img);
  const badge = eliminationBadge(p);
  if (badge) wrap.appendChild(badge);
  card.appendChild(wrap);
  const h = document.createElement("h3");
  h.textContent = p.name;
  card.appendChild(h);
  const actions = document.createElement("div");
  actions.className = "card-actions";
  const d = document.createElement("button");
  d.className = "secondary";
  d.textContent = "Details";
  d.addEventListener("click", () => openDetails(ctx.league.id, p.id));
  const a = document.createElement("button");
  if (ctx.membership.role === "admin") {
    a.textContent = "Assign";
    a.addEventListener("click", () => openAssign(ctx.league.id, p.id));
    a.disabled = !ctx.teams.some((t) => canAssignPlayer(ctx.user, ctx.membership, t));
  } else {
    a.textContent = "Claim";
    if (!draft.isDraftActive) {
      a.classList.add("view-hidden");
    } else {
      a.classList.remove("view-hidden");
      a.disabled = !myTeam(ctx) || !myTurn(ctx, draft);
    }
    a.addEventListener("click", async () => {
      try { await claimPlayer(ctx, p.id); render(); }
      catch (err) { msg("league", err.message); render(); }
    });
  }
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
    applyTribeBorder(img, tribeForPlayer(p));
    wrap.appendChild(img);
    const badge = eliminationBadge(p);
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

function playersForTeam(ctx, teamId) {
  const pids = Object.entries(ctx.draft.assignmentByPlayerId)
    .filter(([, t]) => t === teamId)
    .map(([pid]) => pid);
  return pids.map((pid) => state.players.find((x) => x.id === pid)).filter(Boolean);
}

function teamListCard(ctx, team) {
  const card = document.createElement("article");
  card.className = "team-list-card";
  const title = document.createElement("h4");
  title.textContent = team.name;
  card.appendChild(title);

  const names = playersForTeam(ctx, team.id);
  const roster = document.createElement("ul");
  roster.className = "team-list-roster";
  if (!names.length) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = "No players assigned";
    roster.appendChild(li);
  } else {
    names.forEach((player) => {
      const li = document.createElement("li");
      li.className = "team-list-player";
      const eliminationNum = Number(player.eliminated) || 0;
      if (eliminationNum > 0) {
        const place = Math.max(1, state.players.length - eliminationNum + 1);
        const elim = document.createElement("span");
        elim.className = "team-list-badge team-list-badge-elim";
        elim.textContent = String(place);
        elim.title = `${ordinal(place)} place`;
        li.appendChild(elim);
      }
      const nameSpan = document.createElement("span");
      nameSpan.className = "team-list-player-name";
      nameSpan.textContent = player.name;
      li.appendChild(nameSpan);

      const tribe = tribeForPlayer(player);
      if (tribe) {
        const tribeDot = document.createElement("span");
        tribeDot.className = "team-list-badge team-list-badge-tribe team-list-tribe-right";
        tribeDot.style.setProperty("--tribe-color", tribe.color || "#999");
        tribeDot.title = `Tribe: ${tribe.name}`;
        li.appendChild(tribeDot);
      }
      roster.appendChild(li);
    });
  }
  card.appendChild(roster);

  const open = document.createElement("button");
  open.type = "button";
  open.className = "secondary";
  open.textContent = "Open Team";
  open.addEventListener("click", () => {
    state.teamsViewTeamId = team.id;
    render();
  });
  card.appendChild(open);
  return card;
}

function teamDetailCard(ctx, player) {
  const tribe = tribeForPlayer(player);
  const card = document.createElement("article");
  card.className = "player-card";
  const wrap = document.createElement("div");
  wrap.className = "photo-wrap";
  const img = document.createElement("img");
  img.className = "player-photo";
  img.src = player.photoUrl;
  img.alt = player.name;
  img.addEventListener("click", () => openDetails(ctx.league.id, player.id));
  applyTribeBorder(img, tribe);
  wrap.appendChild(img);
  const badge = eliminationBadge(player);
  if (badge) wrap.appendChild(badge);
  card.appendChild(wrap);
  const h = document.createElement("h3");
  h.textContent = player.name;
  card.appendChild(h);
  const actions = document.createElement("div");
  actions.className = "card-actions";
  const d = document.createElement("button");
  d.className = "secondary";
  d.textContent = "Details";
  d.addEventListener("click", () => openDetails(ctx.league.id, player.id));
  actions.appendChild(d);
  card.appendChild(actions);
  return card;
}

function renderTeamsSubview(ctx) {
  ui.teamColumnsContainer.innerHTML = "";
  if (!isMobileLayout()) {
    ctx.teams.forEach((team) => ui.teamColumnsContainer.appendChild(teamColumn(ctx, team)));
    return;
  }

  if (!state.teamsViewTeamId) {
    ctx.teams.forEach((team) => ui.teamColumnsContainer.appendChild(teamListCard(ctx, team)));
    return;
  }

  const team = ctx.teams.find((item) => item.id === state.teamsViewTeamId);
  if (!team) {
    state.teamsViewTeamId = null;
    ctx.teams.forEach((item) => ui.teamColumnsContainer.appendChild(teamListCard(ctx, item)));
    return;
  }

  const header = document.createElement("div");
  header.className = "team-detail-head";
  const back = document.createElement("button");
  back.type = "button";
  back.className = "secondary";
  back.textContent = "Back to Teams";
  back.addEventListener("click", () => {
    state.teamsViewTeamId = null;
    render();
  });
  const title = document.createElement("h4");
  title.textContent = team.name;
  header.appendChild(back);
  header.appendChild(title);
  ui.teamColumnsContainer.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "team-detail-grid";
  const players = playersForTeam(ctx, team.id);
  if (!players.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No players assigned.";
    grid.appendChild(empty);
  } else {
    players.forEach((player) => grid.appendChild(teamDetailCard(ctx, player)));
  }
  ui.teamColumnsContainer.appendChild(grid);
}

function renderYourTeamView(ctx) {
  ui.yourTeamPlayers.innerHTML = "";
  const team = myTeam(ctx);
  if (!team) {
    ui.yourTeamMeta.textContent = "You are not currently assigned to a team.";
    ui.yourTeamNameDisplay.textContent = "No team assigned";
    ui.yourTeamNameInput.value = "";
    ui.yourTeamNameInput.classList.add("view-hidden");
    ui.yourTeamNameDisplay.classList.remove("view-hidden");
    ui.editTeamNameButton.disabled = true;
    ui.editTeamNameButton.classList.remove("view-hidden");
    ui.saveTeamNameButton.classList.add("view-hidden");
    return;
  }

  ui.yourTeamNameDisplay.textContent = team.name || "";
  ui.yourTeamNameInput.value = team.name || "";
  ui.yourTeamNameInput.classList.toggle("view-hidden", !state.isEditingTeamName);
  ui.yourTeamNameDisplay.classList.toggle("view-hidden", state.isEditingTeamName);
  ui.editTeamNameButton.disabled = state.isEditingTeamName;
  ui.editTeamNameButton.classList.toggle("view-hidden", state.isEditingTeamName);
  ui.saveTeamNameButton.classList.toggle("view-hidden", !state.isEditingTeamName);
  ui.yourTeamMeta.textContent = `Team ${team.slotNumber} | Owner: ${
    (state.db.users.find((u) => u.id === team.ownerUserId) || {}).displayName || "Unknown"
  }`;

  const players = playersForTeam(ctx, team.id);
  if (!players.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No players assigned yet.";
    ui.yourTeamPlayers.appendChild(empty);
    return;
  }
  players.forEach((player) => ui.yourTeamPlayers.appendChild(teamDetailCard(ctx, player)));
}

function renderSurvivorManagement(ctx) {
  if (!ctx.user.isOwner) {
    ui.survivorPlayersGrid.innerHTML = "";
    ui.tribeManagementList.innerHTML = "";
    return;
  }

  ui.tribeManagementList.innerHTML = "";
  (state.db.tribes || []).forEach((tribe) => {
    const row = document.createElement("div");
    row.className = "tribe-management-row";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = tribe.name;
    const colorInput = document.createElement("select");
    colorInput.innerHTML = ui.newGlobalTribeColor.innerHTML;
    colorInput.value = tribe.color || "#999999";
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "secondary";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", async () => {
      try {
        await persistSurvivorTribe(ctx, tribe.id, nameInput.value, colorInput.value);
        await syncDb();
        msg("league", "Tribe updated.");
        render();
      } catch (err) {
        msg("league", err.message);
        render();
      }
    });
    row.appendChild(nameInput);
    row.appendChild(colorInput);
    row.appendChild(saveButton);
    ui.tribeManagementList.appendChild(row);
  });

  ui.survivorPlayersGrid.innerHTML = "";
  state.players.forEach((player) => {
    ui.survivorPlayersGrid.appendChild(teamDetailCard(ctx, player));
  });
}

function firstSeasonNumber(player) {
  const seasons = normalizeSeasons(player.seasons);
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

function renderTeamAssignments(ctx) {
  ui.teamAssignmentsTableBody.innerHTML = "";
  ui.teamAssignmentsMessage.textContent = "";
  const leagueMemberships = state.db.memberships.filter((m) => m.leagueId === ctx.league.id);
  const teams = [...ctx.teams].sort((a, b) => a.slotNumber - b.slotNumber);

  teams.forEach((team) => {
    const teamMembership = leagueMemberships.find((m) => m.teamId === team.id) || null;
    const teamUser = teamMembership ? state.db.users.find((user) => user.id === teamMembership.userId) : null;
    const rowKey = team.id;
    const isEditing = state.teamAssignmentEditingTeamId === rowKey;
    const tr = document.createElement("tr");
    const emailTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const teamNameTd = document.createElement("td");
    const teamTd = document.createElement("td");
    const actionsTd = document.createElement("td");

    emailTd.textContent = teamUser?.email || "";

    if (isEditing) {
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.value = teamUser?.displayName || "";
      nameTd.appendChild(nameInput);

      const teamNameInput = document.createElement("input");
      teamNameInput.type = "text";
      teamNameInput.value = team.name || "";
      teamNameTd.appendChild(teamNameInput);

      const select = document.createElement("select");
      teams.forEach((leagueTeam) => {
        const option = document.createElement("option");
        option.value = leagueTeam.id;
        option.textContent = `Team ${leagueTeam.slotNumber} (${leagueTeam.name})`;
        select.appendChild(option);
      });
      select.value = team.id;
      teamTd.appendChild(select);

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", async () => {
        try {
          await persistLeagueManagementUpdate(ctx, {
            targetTeamId: team.id,
            targetUserId: teamMembership?.userId || "",
            displayName: nameInput.value,
            teamName: teamNameInput.value,
            assignTeamId: select.value,
          });
          state.teamAssignmentEditingTeamId = null;
          await syncDb();
          showTeamAssignmentsMessage("Team assignment updated.");
          render();
        } catch (err) {
          showTeamAssignmentsMessage(err.message);
          render();
        }
      });

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "secondary";
      cancelButton.textContent = "Cancel";
      cancelButton.addEventListener("click", () => {
        state.teamAssignmentEditingTeamId = null;
        render();
      });
      actionsTd.appendChild(saveButton);
      actionsTd.appendChild(cancelButton);
    } else {
      nameTd.textContent = teamUser?.displayName || "";
      teamNameTd.textContent = team.name || "";
      if (teamMembership) {
        teamTd.textContent = `Team ${team.slotNumber} (${team.name})`;
      } else {
        teamTd.textContent = `Team ${team.slotNumber} (${team.name})`;
      }

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "secondary";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        state.teamAssignmentEditingTeamId = rowKey;
        render();
      });
      actionsTd.appendChild(editButton);

      if (teamMembership?.userId) {
        const removeUserButton = document.createElement("button");
        removeUserButton.type = "button";
        removeUserButton.className = "danger-button";
        removeUserButton.textContent = "Remove User";
        removeUserButton.addEventListener("click", async () => {
          if (!confirm("Remove this user from the league?")) return;
          try {
            await removeUserFromLeague(ctx, teamMembership.userId);
            await syncDb();
            showTeamAssignmentsMessage("User removed from league.");
            render();
          } catch (err) {
            showTeamAssignmentsMessage(err.message);
            render();
          }
        });
        actionsTd.appendChild(removeUserButton);
      }

      const deleteTeamButton = document.createElement("button");
      deleteTeamButton.type = "button";
      deleteTeamButton.className = "danger-button";
      deleteTeamButton.textContent = "Delete Team";
      deleteTeamButton.disabled = teams.length <= 1;
      deleteTeamButton.addEventListener("click", async () => {
        if (!confirm("Delete this team? If it has a user, that user will be removed from the league.")) return;
        try {
          await deleteTeamFromLeague(ctx, team.id);
          await syncDb();
          showTeamAssignmentsMessage("Team deleted.");
          render();
        } catch (err) {
          showTeamAssignmentsMessage(err.message);
          render();
        }
      });
      actionsTd.appendChild(deleteTeamButton);
    }

    tr.appendChild(emailTd);
    tr.appendChild(nameTd);
    tr.appendChild(teamNameTd);
    tr.appendChild(teamTd);
    tr.appendChild(actionsTd);
    ui.teamAssignmentsTableBody.appendChild(tr);
  });
}

function tribeForPlayer(player) {
  if (!player?.tribe) return null;
  return tribeForId(player.tribe);
}

function applyTribeBorder(imageEl, tribe) {
  if (!imageEl) return;
  if (!tribe) {
    imageEl.classList.remove("tribe-border");
    imageEl.style.removeProperty("--tribe-color");
    return;
  }
  imageEl.classList.add("tribe-border");
  imageEl.style.setProperty("--tribe-color", tribe.color || "#999");
}

function renderTurnBanner(ctx, draft) {
  const turnTeam = teamForPick(ctx, draft);
  if (!draft.isDraftActive || !turnTeam) {
    ui.turnBanner.classList.add("view-hidden");
    ui.turnPreview.classList.add("view-hidden");
    state.showTurnPreview = false;
    return;
  }
  ui.turnBanner.classList.remove("view-hidden");
  ui.turnBanner.classList.add("clickable");
  const mine = myTurn(ctx, draft);
  ui.turnBanner.classList.toggle("not-turn", !mine);
  ui.turnBannerText.textContent = mine
    ? `Your turn - ${turnTeam.name} is drafting (Round ${draft.roundNumber})`
    : `${turnTeam.name} is drafting (Round ${draft.roundNumber})`;

  if (!state.showTurnPreview) {
    ui.turnPreview.classList.add("view-hidden");
    return;
  }

  ui.turnPreviewList.innerHTML = "";
  const picks = nextDraftPositions(ctx, draft, 5);
  picks.forEach((pick) => {
    const li = document.createElement("li");
    li.textContent = `${pick.teamName} (Round ${pick.round})`;
    ui.turnPreviewList.appendChild(li);
  });
  ui.turnPreview.classList.remove("view-hidden");
}

function nextDraftPositions(ctx, draft, count) {
  const order = Array.isArray(draft.draftOrderTeamIds) ? draft.draftOrderTeamIds : [];
  if (!order.length) return [];
  let idx = Math.max(0, Math.min(order.length - 1, Number(draft.currentPickIndex) || 0));
  let direction = draft.direction === -1 ? -1 : 1;
  let round = Number(draft.roundNumber) || 1;
  const out = [];

  for (let i = 0; i < count; i += 1) {
    const teamId = order[idx];
    const team = ctx.teams.find((t) => t.id === teamId);
    out.push({ teamName: team ? team.name : `Team ${idx + 1}`, round });

    if (direction === 1) {
      if (idx >= order.length - 1) {
        direction = -1;
        round += 1;
      } else {
        idx += 1;
      }
    } else if (idx <= 0) {
      direction = 1;
      round += 1;
    } else {
      idx -= 1;
    }
  }

  return out;
}

async function moveDraftOrder(ctx, teamId, direction) {
  await persistDraftConfig(ctx, "move", { teamId, direction });
  await syncDb();
}

async function randomizeDraftOrder(ctx) {
  await persistDraftConfig(ctx, "randomize");
  await syncDb();
}

async function startDraft(ctx) {
  await persistDraftConfig(ctx, "start");
  await syncDb();
}

async function stopDraft(ctx) {
  await persistDraftConfig(ctx, "stop");
  await syncDb();
}

function renderDraftOrderCard(ctx, draft) {
  ui.draftOrderList.innerHTML = "";
  const isAdmin = ctx.membership.role === "admin";
  const turnTeam = teamForPick(ctx, draft);
  ui.draftTurnStatus.textContent = draft.isDraftActive && turnTeam
    ? `Draft Active: ${turnTeam.name} is on the clock (Round ${draft.roundNumber})`
    : "Draft is not active.";

  draft.draftOrderTeamIds.forEach((teamId, index) => {
    const team = ctx.teams.find((t) => t.id === teamId);
    if (!team) return;
    const row = document.createElement("div");
    row.className = "draft-order-item";
    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${team.name}`;
    row.appendChild(label);
    const controls = document.createElement("div");
    controls.className = "draft-order-controls";
    const up = document.createElement("button");
    up.type = "button";
    up.className = "secondary";
    up.textContent = "Up";
    up.disabled = !isAdmin || index === 0 || draft.isDraftActive;
    up.addEventListener("click", async () => {
      try { await moveDraftOrder(ctx, teamId, -1); render(); }
      catch (err) { msg("league", err.message); render(); }
    });
    const down = document.createElement("button");
    down.type = "button";
    down.className = "secondary";
    down.textContent = "Down";
    down.disabled = !isAdmin || index === draft.draftOrderTeamIds.length - 1 || draft.isDraftActive;
    down.addEventListener("click", async () => {
      try { await moveDraftOrder(ctx, teamId, 1); render(); }
      catch (err) { msg("league", err.message); render(); }
    });
    controls.appendChild(up);
    controls.appendChild(down);
    row.appendChild(controls);
    ui.draftOrderList.appendChild(row);
  });

  ui.randomizeDraftOrderButton.disabled = !isAdmin || draft.isDraftActive;
  ui.startDraftButton.disabled = !isAdmin || draft.isDraftActive;
  ui.startDraftButton.classList.toggle("view-hidden", draft.isDraftActive);
  ui.stopDraftButton.classList.toggle("view-hidden", !draft.isDraftActive);
  ui.stopDraftButton.disabled = !isAdmin || !draft.isDraftActive;
}

function renderLeague(leagueId) {
  const ctx = ctxForLeague(leagueId);
  if (!ctx) { msg("leagues", "League not found or access denied."); go("#/leagues"); return; }
  const draft = ensureDraftConfig(ctx);
  toggleView("league");
  ui.leagueTitle.textContent = ctx.league.name;
  const myTeam = ctx.membership.teamId ? ctx.teams.find((t) => t.id === ctx.membership.teamId) : null;
  ui.leagueMeta.textContent = `Role: ${ctx.membership.role} | ${myTeam ? `Team ${myTeam.slotNumber} (${myTeam.name})` : "No team assigned"}`;
  ui.leagueInviteCode.textContent = `Invite Code: ${ctx.league.inviteCode}`;
  ui.resetButton.classList.toggle("view-hidden", !canResetLeague(ctx.user, ctx.membership, ctx.league));

  const isAdmin = ctx.membership.role === "admin";
  const isOwner = !!ctx.user.isOwner;
  const allAssigned = state.players.length > 0 && state.players.every((player) => !!draft.assignmentByPlayerId[player.id]);
  const hideDraftNav = allAssigned && !isAdmin && !isMobileLayout();
  if (!isAdmin && state.currentSubview === "order") state.currentSubview = "draft";
  if (!isOwner && state.currentSubview === "survivor") state.currentSubview = "draft";
  if (hideDraftNav && state.currentSubview === "draft") state.currentSubview = "teams";
  ui.draftViewButton.classList.toggle("view-hidden", hideDraftNav);
  ui.draftOrderNavButton.classList.toggle("view-hidden", !isAdmin);
  ui.survivorMgmtViewButton.classList.toggle("view-hidden", !isOwner);
  renderDraftOrderCard(ctx, draft);
  renderTurnBanner(ctx, draft);
  ui.teamAssignmentsView.classList.toggle("view-hidden", !isAdmin);
  if (isAdmin) renderTeamAssignments(ctx);

  ui.teamsViewButton.textContent = "Teams";
  const teamsTitle = document.getElementById("teamsColumnsTitle");
  if (teamsTitle) {
    teamsTitle.textContent = "Teams";
  }
  ui.teamColumnsContainer.className = isMobileLayout() ? "team-list-grid" : "team-columns-grid";
  if (isMobileLayout()) {
    ui.teamColumnsContainer.style.removeProperty("grid-template-columns");
  } else {
    ui.teamColumnsContainer.style.gridTemplateColumns = `repeat(${Math.max(1, ctx.teams.length)}, minmax(0, 1fr))`;
  }

  updateDraftSubview();
  ui.teamsContainer.innerHTML = "";
  ui.playersContainer.innerHTML = "";
  ui.teamColumnsContainer.innerHTML = "";
  ctx.teams.forEach((t) => ui.teamsContainer.appendChild(teamCard(ctx, t)));
  ui.tribeFilterSelect.innerHTML = `<option value="all">All Tribes</option>`;
  (state.db.tribes || []).forEach((tribe) => {
    const opt = document.createElement("option");
    opt.value = tribe.id;
    opt.textContent = tribe.name;
    ui.tribeFilterSelect.appendChild(opt);
  });
  if (state.tribeFilter !== "all" && !(state.db.tribes || []).some((t) => t.id === state.tribeFilter)) {
    state.tribeFilter = "all";
  }
  ui.tribeFilterSelect.value = state.tribeFilter;

  const playersForPool = draft.isDraftActive
    ? state.players.filter((p) => !draft.assignmentByPlayerId[p.id])
    : state.players;
  const unassignedPlayers = sortDraftPlayers(
    playersForPool.filter((p) => state.tribeFilter === "all" || (p.tribe || "") === state.tribeFilter),
  );
  ui.draftFilterSelect.value = state.draftFilter;
  if (unassignedPlayers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "All players are assigned.";
    ui.playersContainer.appendChild(empty);
  } else {
    unassignedPlayers.forEach((p) => ui.playersContainer.appendChild(playerCard(ctx, p)));
  }
  renderTeamsSubview(ctx);
  renderYourTeamView(ctx);
  renderSurvivorManagement(ctx);
}

function render() {
  renderAuth();
  const r = route();
  const user = currentUser();
  if (!user && r.name !== "login") { clearLiveSync(); state.teamsViewTeamId = null; state.isEditingTeamName = false; go("#/login"); return; }
  if (user && r.name === "login") { clearLiveSync(); state.teamsViewTeamId = null; state.isEditingTeamName = false; go("#/leagues"); return; }
  if (r.name === "login") { clearLiveSync(); state.teamsViewTeamId = null; state.isEditingTeamName = false; toggleView("login"); return; }
  if (r.name === "leagues") { clearLiveSync(); state.teamsViewTeamId = null; state.isEditingTeamName = false; renderLeagues(); return; }
  if (r.name === "league") { renderLeague(r.leagueId); ensureLiveSync(); return; }
  clearLiveSync();
  state.teamsViewTeamId = null;
  state.isEditingTeamName = false;
  toggleView("login");
}

function wire() {
  window.addEventListener("hashchange", () => { msg("", ""); render(); });
  window.addEventListener("resize", () => {
    const r = route();
    if (r.name === "league") render();
  });
  ui.topMenuToggle.addEventListener("click", () => {
    ui.topBarMenu.classList.toggle("open");
  });
  ui.topBarMenu.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.tagName === "BUTTON" && window.innerWidth <= 980) {
      ui.topBarMenu.classList.remove("open");
    }
  });
  ui.authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (state.authMode === "signup") {
        await signUp(ui.authUsername.value, ui.authPassword.value, ui.authDisplayName.value);
      } else {
        await signIn(ui.authUsername.value, ui.authPassword.value);
      }
      msg("", "");
      go("#/leagues");
    }
    catch (err) { msg("login", err.message); render(); }
  });
  ui.landingLoginOption.addEventListener("click", () => {
    setAuthMode("login");
    ui.authUsername.focus();
  });
  ui.landingCreateOption.addEventListener("click", () => {
    setAuthMode("signup");
    ui.authUsername.focus();
    ui.authPassword.focus();
    ui.authDisplayName.focus();
  });
  ui.logoutButton.addEventListener("click", () => { signOut(); msg("", ""); go("#/login"); });

  ui.createLeagueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = currentUser();
    if (!user) { go("#/login"); return; }
    try {
      const l = await createLeague(ui.createLeagueName.value, user.id);
      ui.createLeagueForm.reset();
      msg("leagues", `League created: ${l.name}. Invite code: ${l.inviteCode}`);
      render();
    } catch (err) {
      msg("leagues", err.message);
      render();
    }
  });

  ui.joinLeagueForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = currentUser();
    if (!user) { go("#/login"); return; }
    try {
      const normalizedInput = code(ui.joinLeagueCode.value);
      const result = await joinLeague(normalizedInput, user.id);
      ui.joinLeagueForm.reset();
      msg("leagues", `Joined ${result.leagueName}. You are Team ${result.slotNumber}.`);
      render();
    } catch (err) {
      msg("leagues", err.message);
      render();
    }
  });

  ui.backToLeaguesButton.addEventListener("click", () => go("#/leagues"));
  ui.copyInviteCodeButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    try {
      await navigator.clipboard.writeText(ctx.league.inviteCode);
      msg("league", "Invite code copied!");
    } catch {
      msg("league", "Unable to copy invite code.");
    }
  });
  ui.turnBanner.addEventListener("click", () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    const draft = ensureDraftConfig(ctx);
    if (!draft.isDraftActive) return;
    state.showTurnPreview = !state.showTurnPreview;
    render();
  });
  ui.randomizeDraftOrderButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || ctx.membership.role !== "admin") return;
    try {
      await randomizeDraftOrder(ctx);
      msg("league", "Draft order randomized.");
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });
  ui.startDraftButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || ctx.membership.role !== "admin") return;
    if (!confirm("Start draft and reset all assignments?")) return;
    try {
      await startDraft(ctx);
      msg("league", "Draft started.");
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });
  ui.stopDraftButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || ctx.membership.role !== "admin") return;
    try {
      await stopDraft(ctx);
      msg("league", "Draft stopped. Order is locked as-is.");
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });
  ui.draftViewButton.addEventListener("click", () => {
    state.currentSubview = "draft";
    state.isEditingTeamName = false;
    ui.topBarMenu.classList.remove("open");
    render();
  });
  ui.teamsViewButton.addEventListener("click", () => {
    state.currentSubview = "teams";
    state.teamsViewTeamId = null;
    state.isEditingTeamName = false;
    ui.topBarMenu.classList.remove("open");
    render();
  });
  ui.yourTeamViewButton.addEventListener("click", () => {
    state.currentSubview = "yourteam";
    state.isEditingTeamName = false;
    ui.topBarMenu.classList.remove("open");
    render();
  });
  ui.survivorMgmtViewButton.addEventListener("click", () => {
    state.currentSubview = "survivor";
    state.isEditingTeamName = false;
    ui.topBarMenu.classList.remove("open");
    render();
  });
  ui.draftOrderNavButton.addEventListener("click", () => {
    state.currentSubview = "order";
    state.isEditingTeamName = false;
    ui.topBarMenu.classList.remove("open");
    render();
  });
  ui.editTeamNameButton.addEventListener("click", () => {
    const r = route();
    if (r.name !== "league") return;
    state.isEditingTeamName = true;
    render();
    ui.yourTeamNameInput.focus();
  });
  ui.saveTeamNameButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    const mine = myTeam(ctx);
    if (!mine) return;
    try {
      await renameTeam(ctx, mine.id, ui.yourTeamNameInput.value);
      state.isEditingTeamName = false;
      msg("league", "Team name updated.");
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });
  ui.draftFilterSelect.addEventListener("change", () => {
    state.draftFilter = ui.draftFilterSelect.value === "season" ? "season" : "alpha";
    const r = route();
    if (r.name === "league") render();
  });
  ui.tribeFilterSelect.addEventListener("change", () => {
    state.tribeFilter = ui.tribeFilterSelect.value || "all";
    const r = route();
    if (r.name === "league") render();
  });
  ui.addTeamButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || ctx.membership.role !== "admin") return;
    try {
      await addLeagueTeam(ctx);
      await syncDb();
      showTeamAssignmentsMessage("Team added.");
      render();
    } catch (err) {
      showTeamAssignmentsMessage(err.message);
      render();
    }
  });
  ui.createGlobalTribeButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || !ctx.user.isOwner) return;
    const name = String(ui.newGlobalTribeName.value || "").trim();
    if (!name) {
      msg("league", "Tribe name is required.");
      return;
    }
    try {
      await persistSurvivorTribe(ctx, "", name, ui.newGlobalTribeColor.value || "#999999");
      ui.newGlobalTribeName.value = "";
      await syncDb();
      msg("league", "Tribe created.");
      render();
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });

  ui.resetButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league") return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) return;
    if (!confirm("Reset this league draft?")) return;
    try { await resetLeague(ctx); msg("", ""); render(); }
    catch (err) { msg("league", err.message); render(); }
  });

  ui.assignConfirm.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league" || !state.assignTargetPlayerId) { closeAssign(); return; }
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx) { closeAssign(); return; }
    try { await assignPlayer(ctx, state.assignTargetPlayerId, ui.assignSelect.value || null); closeAssign(); msg("", ""); render(); }
    catch (err) { closeAssign(); msg("league", err.message); render(); }
  });
  ui.assignCancel.addEventListener("click", closeAssign);
  ui.assignModal.addEventListener("click", (e) => { if (e.target === ui.assignModal) closeAssign(); });

  ui.detailsEliminateButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league" || !state.detailsTargetPlayerId) return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || !ctx.user.isOwner || state.currentSubview !== "survivor") return;
    try {
      const player = state.players.find((entry) => entry.id === state.detailsTargetPlayerId);
      if (!player) return;
      const nextElim = Number(player.eliminated) > 0 ? null : nextEliminationNumber();
      await updatePlayerSurvivorState(ctx, state.detailsTargetPlayerId, player.tribe || null, nextElim);
      msg("", "");
      render();
      updateEliminateButton(ctxForLeague(r.leagueId), state.detailsTargetPlayerId);
    }
    catch (err) { msg("league", err.message); render(); }
  });
  ui.detailsCloseTop.addEventListener("click", closeDetails);
  ui.detailsCloseBottom.addEventListener("click", closeDetails);
  ui.detailsModal.addEventListener("click", (e) => { if (e.target === ui.detailsModal) closeDetails(); });
  ui.tribeAssignToggle.addEventListener("click", () => {
    ui.tribeAssignPanel.classList.toggle("view-hidden");
  });
  ui.saveTribeButton.addEventListener("click", async () => {
    const r = route();
    if (r.name !== "league" || !state.detailsTargetPlayerId) return;
    const ctx = ctxForLeague(r.leagueId);
    if (!ctx || !ctx.user.isOwner || state.currentSubview !== "survivor") return;
    const selectedTribeId = ui.tribeSelect.value || "";
    try {
      const player = state.players.find((entry) => entry.id === state.detailsTargetPlayerId);
      const eliminated = Number(player?.eliminated) > 0 ? Number(player.eliminated) : null;
      await updatePlayerSurvivorState(ctx, state.detailsTargetPlayerId, selectedTribeId || null, eliminated);
      ui.tribeAssignPanel.classList.add("view-hidden");
      msg("league", "Tribe assignment saved.");
      render();
      openDetails(r.leagueId, state.detailsTargetPlayerId);
    } catch (err) {
      msg("league", err.message);
      render();
    }
  });
}

async function init() {
  state.players = await loadPlayers();
  state.db = loadDb();
  state.session = loadSession();
  styleTribeColorOptions();
  await syncDb().catch(() => {
    state.db = loadDb();
  });
  wire();
  setAuthMode("login");
  render();
}

if (!window.__SURVIVOR_LEGACY_BOOTED__) {
  window.__SURVIVOR_LEGACY_BOOTED__ = true;
  void init();
}

export {};

