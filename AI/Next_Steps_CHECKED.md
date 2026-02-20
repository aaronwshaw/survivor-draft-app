# Survivor Fantasy Draft - Feature Implementation Checklist

## 1. Admin Auto-Team Assignment Logic
- [x] When a league is created, automatically assign the admin to Team 1.
- [x] When a new user joins via invite code, automatically assign them to the next available team slot.
- [x] Ensure only one user per team.
- [x] Allow admin to manually reassign users to different teams if needed.
- [x] Prevent non-admin users from changing other users' team assignments.

## 2. Admin Team Management View
- [x] Add "Team Assignments" button in admin navbar.
- [x] Create admin-only page displaying a table with: Name | Email | Assigned Team.
- [x] Add dropdown or selector to change a user's team.
- [x] Persist team changes to database.
- [x] Add backend route with admin authorization check.

## 3. Landing Page Redesign
- [x] Add logo image to top of landing page (from /public folder).
- [x] Add banner: "Welcome to the Survivor Fantasy Draft".
- [x] Create two centered options: Login and Create Account.
- [x] Add cast image to bottom of landing page (from /public folder).
- [x] Ensure layout is responsive and centered.

## 4. Authentication Forms
- [x] Login form requires: Username and Password.
- [x] Create Account form requires: Username, Password, Display Name.
- [x] Store hashed password in database.
- [x] Validate unique username on registration.
- [x] Redirect to leagues dashboard after login.

## 5. Players Data Migration to Database
- [x] Create Player model in Prisma schema including stats fields.
- [x] Create migration and apply to Neon database.
- [x] Write seed script to insert players.json into database.
- [x] Update app to fetch players from database instead of JSON file.
- [x] Remove local players.json dependency in production.

## 6. Draft Page UI Improvements
- [x] Make teams sidebar fixed on left side (sticky positioning).
- [x] Ensure navbar has higher z-index so it always stays on top.
- [x] Prevent player cards from overlapping navbar while scrolling.
- [x] Remove "Team: Unassigned" label from player cards.
- [x] Only show unassigned players in available player list.

## 7. Claim / Unclaim Logic (User View)
- [x] Admin retains Assign / Unassign buttons.
- [x] Non-admin users see Claim / Unclaim buttons.
- [x] Claim automatically assigns player to user's team.
- [x] Prevent users from claiming players assigned to other teams.
- [x] Update UI immediately after claim/unclaim action.

## 8. Authorization & Role Enforcement
- [x] Add middleware or helper to verify admin role.
- [x] Protect admin-only routes.
- [x] Ensure users can only modify their own team's players.
