

## Plan: Enhanced Admin Panel with User Management

### What exists now
- Admin panel at `/RajputAdMin` with 4 tabs: Overview, Users, Traffic, Waitlist
- Edge function `admin-api` handles list-users, delete-user, waitlist, stats
- Users table shows name, email, join date, habits, XP, status, and delete action
- Waitlist tab shows premium waitlist entries
- User subscription tier stored in `user_subscriptions` table

### What needs to change

#### 1. Add "Promote to Premium" action in edge function
Add a new `promote-user` action to `admin-api/index.ts` that updates the user's `user_subscriptions.tier` from `free` to `premium` (and a `demote-user` action to reverse it).

#### 2. Add subscription tier info to user list
In the `list-users` action, also fetch each user's subscription tier from `user_subscriptions` and include it in the response. Update the `AdminUser` interface in `useAdmin.ts` to include `tier`.

#### 3. Add promote/demote functions to useAdmin hook
Add `promoteUser(userId)` and `demoteUser(userId)` functions that call the edge function, then update local state.

#### 4. Update Admin Dashboard UI
- **Users tab**: Add a `tier` column showing Free/Premium badge. Add a Crown button next to the delete button to promote/demote users with a confirmation dialog.
- **Overview tab**: Add a "Waitlist Count" stat card and a "Premium Users" stat card.
- **Waitlist tab**: Add a "Promote" button on each waitlist entry so admin can directly upgrade waitlist users to premium.

#### 5. Ensure new signups appear
The existing `list-users` action already uses `adminClient.auth.admin.listUsers()` which returns all auth users. New signups automatically appear. No changes needed here -- just verify it works end-to-end.

### Files to modify
- `supabase/functions/admin-api/index.ts` -- add `promote-user` and `demote-user` actions, add tier to list-users response, add premium count to stats
- `src/hooks/useAdmin.ts` -- add tier to AdminUser, add promote/demote functions, add premiumUsers to stats
- `src/pages/AdminDashboard.tsx` -- add tier column, promote/demote buttons, premium stat card

### No database changes needed
The `user_subscriptions` table already exists with the `tier` column and admin can update it via the service role in the edge function.

