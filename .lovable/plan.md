
# Dual-Path Monetization System (Feature Gating, No Payments Yet)

## Overview
Build a free vs. premium tier system with feature gating throughout the app. Users choose "Start Free" or "Get Serious" during onboarding. Premium features are locked behind an upgrade prompt (no actual payment -- just a "coming soon" or waitlist approach for now). This sets the foundation to plug in a payment provider (Razorpay, Stripe, etc.) later.

## Tier Definitions

| Feature | Free | Premium |
|---|---|---|
| Daily habits | Up to 5 | Unlimited |
| Weekly habits | Up to 3 | Unlimited |
| AI Motivation Agent | Limited | Full access |
| Analytics page | Basic stats only | Full deep analytics |
| Focus Timer | Available | Available |
| Streak Protection (Life Happens) | 1/month | 3/month |
| Weekly Email Reports | No | Yes |
| Mood Check-in | Available | Available |
| Daily Journal | Available | Available |
| Priority badge on profile | No | Yes |
| Custom habit emojis | No | Yes |

## Implementation Steps

### 1. Database Migration
Create a `user_subscriptions` table to track each user's tier:

```text
user_subscriptions
  - id (uuid, PK)
  - user_id (uuid, unique, NOT NULL)
  - tier (text, default 'free') -- 'free' or 'premium'
  - started_at (timestamptz, default now())
  - updated_at (timestamptz, default now())
```

- RLS: users can SELECT/UPDATE their own row only
- Update `handle_new_user()` trigger to also insert a default `free` tier row
- Backfill existing users with `free` tier

### 2. React Hook: `useSubscription`
Create `src/hooks/useSubscription.ts`:
- Fetches the user's tier from `user_subscriptions`
- Exposes: `tier`, `isPremium`, `loading`
- Provides a helper `canAccess(feature: string)` that checks feature gates
- Provides `limits` object (e.g., `maxHabits: 5` for free, `Infinity` for premium)

### 3. Upgrade Prompt Component
Create `src/components/premium/UpgradePrompt.tsx`:
- A reusable modal/card that shows when a user tries to access a premium feature
- Shows benefits of upgrading
- "Join Waitlist" / "Coming Soon" button (stores interest in DB or just shows a toast)
- Can be used as a wrapper: `<PremiumGate feature="unlimited_habits">...</PremiumGate>`

### 4. Premium Gate Wrapper
Create `src/components/premium/PremiumGate.tsx`:
- Wraps any component that should be gated
- If user has access, renders children normally
- If not, renders a locked overlay with upgrade prompt

### 5. Onboarding Dual-Path
Modify `OnboardingWizard.tsx` to add a new step (between current step 2 and step 3):
- **"Choose Your Path"** screen with two cards:
  - **Start Free**: "5 habits, basic analytics, 1 streak protection/month"
  - **Get Serious** (Premium): "Unlimited everything, deep analytics, priority support" -- with a "Coming Soon / Join Waitlist" badge
- Free path continues normally
- Premium path shows a "We'll notify you when premium launches" message and continues with free tier

### 6. Apply Feature Gates
- **HabitGrid / useHabits**: Limit adding habits beyond 5 (free) -- show UpgradePrompt
- **WeeklyHabits**: Limit to 3 weekly habits for free users
- **Analytics page**: Show a locked overlay on advanced charts for free users
- **Weekly Email Reports toggle**: Show premium badge, disable for free users
- **Streak Protection**: Cap at 1/month for free (already the case), 3/month for premium
- **Settings page**: Add a "Subscription" section showing current tier and upgrade option

### 7. Settings Subscription Section
Add a new card in Settings showing:
- Current plan (Free / Premium)
- Feature comparison
- Upgrade button (links to waitlist/coming soon)

## Technical Details

### Files to Create
- `src/hooks/useSubscription.ts` -- subscription hook
- `src/components/premium/UpgradePrompt.tsx` -- upgrade modal
- `src/components/premium/PremiumGate.tsx` -- gate wrapper component

### Files to Modify
- `src/components/onboarding/OnboardingWizard.tsx` -- add tier selection step
- `src/pages/Dashboard.tsx` -- pass subscription context
- `src/pages/Settings.tsx` -- add subscription section
- `src/pages/Analytics.tsx` -- gate advanced features
- `src/hooks/useHabits.ts` -- enforce habit limits
- `src/hooks/useGameification.ts` -- adjust streak protection limits

### Database Changes
- New table: `user_subscriptions`
- Updated trigger: `handle_new_user()` to insert default subscription
- Backfill migration for existing users
- RLS policies for the new table
