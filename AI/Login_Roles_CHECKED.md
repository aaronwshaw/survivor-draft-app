# Survivor Draft App - Login, Roles, Leagues (Checked)

## 1) Requirements (Source of Truth)
- [x] Admin (league owner): can change anything (team names, assignments, reset, league settings, invite code).
- [x] Member (team user): view everything; can assign/unassign ONLY for their own team; can rename ONLY their own team; cannot reset; cannot change other teams.
- [x] Users can belong to multiple leagues.
- [x] Join by invite code. On join, user is assigned to the first unused team slot (1-8).
- [x] If all 8 teams are taken, joining fails with a clear message.
- [x] `/login` view.
- [x] `/leagues` view.
- [x] `/league/:leagueId` view (hash route `#/league/:leagueId`), requires login.

## 2) Data Model (Implement Before UI)
- [x] `users: { id, email, displayName }`
- [x] `leagues: { id, name, ownerUserId, inviteCode, createdAt, updatedAt }`
- [x] `teams: { id, leagueId, slotNumber(1-8), name, ownerUserId|null }`
- [x] `memberships: { id, leagueId, userId, role('admin'|'member'), teamId|null, createdAt }`
- [x] `players`: global reference data.
- [x] `league_draft_state: { leagueId, assignmentByPlayerId, eliminationByPlayerId, updatedAt }`

## 3) Authorization Rules (Enforce in One Place)
- [x] `canRenameTeam(user, team)`
- [x] `canAssignPlayer(user, teamTarget)`
- [x] `canUnassignPlayer(user, teamTarget)`
- [x] `canResetLeague(user, league)`
- [x] Enforced in service layer (`renameTeam`, `assignPlayer`, `resetLeague`, `markEliminated`), not UI-only.

## 4) Step-by-Step Build Checklist
### Phase 1 - Auth Skeleton
- [x] Added local auth (sign in/sign up).
- [x] Auth/session store with `currentUser`, `signIn`, `signOut`, `signUp`.
- [x] Protected routes: unauth -> login, auth -> leagues.
- [x] Acceptance: login works, logout returns to login.

### Phase 2 - Leagues Home Page (`/leagues`)
- [x] Leagues list (name, role, team assignment, open button).
- [x] Create league form.
- [x] Join league by code form.
- [x] Query memberships for current user and show league/team.
- [x] Acceptance: leagues show, create works, join works.

### Phase 3 - Create League Flow (Admin)
- [x] Unique invite code (6 chars uppercase+digits).
- [x] League record with owner.
- [x] 8 team records (Team 1..Team 8).
- [x] Admin membership created.
- [x] League draft state initialized.
- [x] Acceptance: invite code visible, 8 teams exist, admin can edit all.

### Phase 4 - Join League Flow (Member)
- [x] Find league by invite code.
- [x] Already joined message.
- [x] First open team slot assignment.
- [x] Full league rejection.
- [x] Membership + team ownership assignment.
- [x] Conditional claim check to avoid duplicate team claims.
- [x] Acceptance: unique team slots, 9th user blocked.

### Phase 5 - Draft Page Permissions (`/league/:leagueId`)
- [x] Load league + membership and derive role/team.
- [x] Gate UI controls by role/ownership.
- [x] Enforce permissions in service methods.
- [x] Acceptance: members can only edit own team; admin can edit all.

### Phase 6 - Admin Controls
- [x] Admin-only reset with confirm dialog.
- [x] Reset clears assignments and elimination markers.

## 5) Required UI Messages
- [x] Join success: `Joined {league}. You are Team {slotNumber}.`
- [x] League full: `This league is full (8/8 teams taken).`
- [x] Already joined: `You're already in this league.`
- [x] Unauthorized: `You can only edit your own team.`

## 6) Test Scenarios (Must Pass)
- [x] Admin creates league -> invite code exists -> 8 teams exist.
- [x] User A joins -> gets Team 1 (or first open).
- [x] User B joins -> gets Team 2.
- [x] Up to 8 users join -> Team 8 taken.
- [x] 9th join fails with league full.
- [x] Member cannot rename other teams.
- [x] Member cannot assign players to other teams.
- [x] Admin can override any assignment.
- [x] Everyone can view all teams and player details.

## 7) Open Decisions (Chosen)
- [x] Admin also takes a team slot: **No**
- [x] Reset keeps team names: **Yes**
- [x] Invite code visible to members: **View-only for all**
- [x] Auth approach: **Local-only prototype (LocalStorage)**
