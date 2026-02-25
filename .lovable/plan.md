

# User Retention System: Never Lose a User

## The Problem
Users who see payment options early bounce immediately. The goal is to make the app so sticky that users never want to leave, and only introduce payment when they're deeply invested.

## Strategy: 7 Retention Features (Zero Payment Mentions)

Instead of building a payment system now, we'll add **7 powerful retention hooks** that keep users coming back daily. No payment screens, no "Pro" badges, no upgrade prompts. Pure value.

---

### 1. Daily Login Reward System
A "daily check-in bonus" that gives users bonus XP just for opening the app each day. Consecutive daily logins multiply the reward (Day 1: +5 XP, Day 2: +10 XP, ... Day 7: +50 XP). Missing a day resets the multiplier. This creates a strong psychological pull to return daily.

- A small animated card at the top of the dashboard: "Day 4 Login Streak! +20 XP claimed"
- Store login streak data in a new `daily_logins` database table

### 2. Weekly Progress Email/Report Card
An in-app "Weekly Report Card" that appears every Monday showing:
- Habits completed vs missed
- XP earned this week
- Streak status
- A personalized grade (A+, B, C...) with encouraging message
- "Share your grade" button (social proof + virality)

This gives users a reason to come back on Mondays and creates a sense of accountability.

### 3. Social Accountability: Public Commitment Wall
A "My Commitment" feature where users can write a one-line public pledge (e.g., "I will meditate every day for 30 days"). This is stored and displayed to the user as a reminder. Creates psychological commitment bias -- once you publicly state a goal, you're far less likely to quit.

- Simple card on the dashboard with their commitment
- Option to share commitment via link

### 4. Milestone Celebrations with Shareable Cards
When users hit milestones (7-day streak, 30-day streak, 100 habits completed, Level 5, etc.), generate a beautiful shareable achievement card they can post on social media. This serves dual purpose:
- Keeps users engaged by giving them goals to chase
- Free marketing when they share

### 5. "Don't Break the Chain" Visual Calendar
A prominent visual calendar (like GitHub's contribution graph) on the main dashboard showing green squares for active days and gray for missed days. The longer the chain of green, the more painful it feels to break. This is one of the most effective retention mechanics known.

- Already have HabitStreaksCalendar but it's hidden in the collapsible section
- Move it to be prominently visible on the main dashboard

### 6. Push Notification / Browser Reminder Opt-in
Add a gentle prompt (after 3 days of usage) to enable browser push notifications. These bring users back even when they forget. Notifications would be:
- "You haven't checked in today -- your 5-day streak is at risk!"
- "Your habits miss you! Come back and earn today's XP"

Uses the existing service worker (`public/sw.js`) for browser notifications.

### 7. Personalized "Come Back" Messages
When a user returns after being away (1+ days without login), show a warm, personalized welcome-back screen instead of just the dashboard:
- "Welcome back! You were away for 3 days. Your streak is waiting to be rebuilt."
- Show what they missed (potential XP they could have earned)
- One-tap "Jump back in" button
- Uses the existing growth-framing philosophy (opportunity, not failure)

---

## Technical Details

### Database Changes
```text
daily_logins table:
  - id (uuid, PK)
  - user_id (uuid, not null)
  - login_date (date, not null)
  - streak_count (integer, default 1)
  - xp_claimed (integer, default 0)
  - created_at (timestamptz)
  - UNIQUE(user_id, login_date)

user_commitments table:
  - id (uuid, PK)
  - user_id (uuid, not null)
  - commitment_text (text, not null)
  - created_at (timestamptz)
  - is_active (boolean, default true)

RLS: Users can only read/write their own rows.
```

### New Files
- `src/hooks/useDailyLogin.ts` -- tracks daily login streaks, claims XP bonus
- `src/components/dashboard/DailyLoginReward.tsx` -- animated login streak card
- `src/components/dashboard/WeeklyReportCard.tsx` -- weekly grade/summary card
- `src/components/dashboard/CommitmentCard.tsx` -- public pledge card
- `src/components/dashboard/MilestoneShare.tsx` -- shareable milestone achievement cards
- `src/components/dashboard/WelcomeBack.tsx` -- personalized return screen for inactive users
- `src/hooks/usePushNotifications.ts` -- browser push notification logic

### Modified Files
- `src/pages/Dashboard.tsx` -- add DailyLoginReward, move HabitStreaksCalendar up, add WelcomeBack screen, add WeeklyReportCard, add CommitmentCard
- `src/hooks/useGameification.ts` -- integrate daily login XP into total XP system
- `public/sw.js` -- add push notification handling

### Implementation Order
1. Create database tables (daily_logins, user_commitments) with RLS
2. Build daily login reward system (hook + UI card)
3. Move streak calendar to prominent dashboard position
4. Build weekly report card component
5. Build commitment card feature
6. Build milestone shareable cards
7. Build welcome-back screen for returning users
8. Add browser push notification opt-in
