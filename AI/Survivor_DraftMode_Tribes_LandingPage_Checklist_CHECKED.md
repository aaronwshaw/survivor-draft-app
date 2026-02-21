# Survivor Fantasy Draft - Draft Mode + UI Enhancements Checklist

## 1. Draft Order Management (Admin)
- [x] Add draft order UI for all 8 teams (up/down controls).
- [x] Persist draft order to league draft state.
- [x] Add "Randomize Order" button that shuffles teams and saves order.
- [x] Ensure only admin can modify draft order.

## 2. Start Draft + Snake Draft Logic
- [x] Add "Start Draft" button (admin only).
- [x] On Start Draft: reset assignments/eliminations and reset draft state.
- [x] Initialize snake draft order based on admin-specified team order.
- [x] Implement turn tracking: currentPickIndex, roundNumber, direction.
- [x] Advance turns in snake pattern until all players are drafted.
- [x] Persist draft state so refreshes keep the correct turn.

## 3. Turn UI + Claim Restrictions
- [x] Show a turn banner at the top when draft is active.
- [x] When not user's turn, disable claim buttons (admin uses assign override).
- [x] Admin can assign at any time (override).
- [x] Display whose turn it is globally.

## 4. Leagues Page Reordering
- [x] On /leagues page, move "Join League" above "Create League".
- [x] Ensure forms still validate.

## 5. Professional Landing Page Upgrade
- [x] Landing page includes hero + CTA layout.
- [x] Includes Survivor 50 logo near top.
- [x] Includes cast photo placement.
- [x] Includes descriptive app text.
- [x] Includes Login / Create Account primary CTAs.
- [x] Responsive on mobile/desktop.

## 6. Copy Invite Code Button
- [x] Added copy-to-clipboard button beside invite code.
- [x] Uses navigator.clipboard.writeText(...).
- [x] Shows success/error feedback message.
- [x] Handles browser copy failures gracefully.

## 7. Admin Tribe Assignment + Tribe Colors
- [x] League draft state stores tribes (name + color) and player->tribe assignments.
- [x] Admin can select existing tribe or create new tribe in player details modal.
- [x] Fixed color list provided for tribe creation.
- [x] Player photos render colored outlines for tribe membership.
- [x] Tribe assignment persists in league draft state.
- [x] Non-admins can view tribe indicators but cannot edit.

## 8. Draft View Filter by Tribe
- [x] Added tribe dropdown filter in draft view.
- [x] Includes default "All Tribes" option.
- [x] Applied filter to available player pool.
- [x] Filtering does not alter turn progression logic.

## 9. Testing & Validation
- [ ] Manual end-to-end validation across all draft/tribe/copy flows.
