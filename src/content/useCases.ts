import type { ContentPageData } from "./types";

export const USE_CASES: Record<string, ContentPageData> = {
  "adhd-routine-app": {
    path: "/use-cases/adhd-routine-app",
    title: "Superoutine for ADHD – A Routine App That Helps",
    description: "How Superoutine helps people with ADHD keep routines: small visible steps, quick XP rewards, streak protection and an AI coach. Try it free for 15 days today.",
    crumb: "ADHD routine app",
    h1: "A routine app for ADHD brains",
    intro: "Superoutine helps people with ADHD keep routines by making each step small, visible and instantly rewarding. You tick a box, earn XP right away, and a missed day never wipes out your progress.",
    sections: [
      { h2: "Why do routines feel hard with ADHD?", answer: "Routines rely on remembering, starting and repeating boring steps, which are exactly the areas ADHD makes harder.", body: ["Long-term rewards feel far away, so a habit that pays off in three months competes with anything more interesting right now. A good routine app brings the reward closer and makes the next step obvious."] },
      { h2: "How does Superoutine help?", answer: "It shortens the gap between action and reward, and keeps the next step in front of you.", bullets: ["Instant XP and a satisfying tick for every habit", "Step-by-step routines so you never have to remember the order", "A short to-do list for today instead of an endless backlog", "Three streak protections a month for unpredictable days", "Comeback Score that rewards restarting, not perfection", "Focus timer for single-task sessions"] },
      { h2: "How can the AI Coach help with ADHD?", answer: "The AI Coach breaks goals into tiny next steps based on what you actually completed.", body: ["Ask it \"what's the smallest thing I can do right now?\" and it answers using your real habits and tasks. It never shames you for missed days."] },
      { h2: "How should I set up Superoutine for ADHD?", answer: "Start with three habits or fewer and one routine pack.", bullets: ["Pick two or three daily habits you can do in under five minutes", "Add the morning or evening routine pack", "Keep only today's tasks in the to-do list", "Check in once a day, ideally at the same time"], body: ["Superoutine is not a medical treatment. It works best alongside the support you already have."] },
    ],
    related: [{ to: "/ai-coach", label: "The AI Coach" }, { to: "/blog/habit-stacking-beginners-guide", label: "Habit stacking guide" }, { to: "/pricing", label: "Pricing" }],
  },
  "morning-routine-app": {
    path: "/use-cases/morning-routine-app",
    title: "Morning Routine App – Build Your Morning",
    description: "Use Superoutine as a morning routine app: a ready-made morning pack, step-by-step checklists, XP for every step and streaks that keep you going. Free 15 days.",
    crumb: "Morning routine app",
    h1: "A morning routine app that keeps you consistent",
    intro: "Superoutine works as a morning routine app with a ready-made morning pack, step-by-step checklists and XP for every step. You can start a routine in one click and tick it off each morning.",
    sections: [
      { h2: "What makes a good morning routine?", answer: "A good morning routine is short, done in the same order every day, and starts with an easy win.", body: ["Four or five steps that take 20–30 minutes are easier to keep than an ambitious two-hour plan. The order matters because each step becomes the cue for the next one."] },
      { h2: "What is in the Superoutine morning pack?", answer: "The Energised Morning pack has four steps and adds two related habits.", bullets: ["Drink a glass of water", "Make the bed", "5 minutes of stretching", "Plan your top 3 tasks"], body: ["Adding the pack also creates the habits \"Drink 2L of water\" and \"Stretching\" in your daily grid. You can edit steps or build your own routine from scratch."] },
      { h2: "How does Superoutine keep me consistent?", answer: "Every completed step and habit earns XP, and your streak grows each day you finish.", body: ["The Momentum Meter shows your seven-day trend, so you notice a slipping routine early. If you miss a morning, a streak protection keeps your streak intact."] },
      { h2: "Can I pair it with an evening routine?", answer: "Yes. The Calm Evening pack covers screens off, gratitude notes, preparing tomorrow and reading.", body: ["A good evening routine makes the next morning easier, so many people use both packs together."] },
    ],
    related: [{ to: "/blog/how-to-build-a-habit-that-sticks", label: "How to build a habit that sticks" }, { to: "/features", label: "All features" }, { to: "/use-cases/fitness-habit-tracker", label: "Fitness habit tracker" }],
  },
  "habit-tracker-for-students": {
    path: "/use-cases/habit-tracker-for-students",
    title: "Habit Tracker for Students – Superoutine",
    description: "Superoutine is a habit tracker for students: a study routine pack, focus timer, to-do list with priorities and an AI coach for exam weeks. Try it free for 15 days.",
    crumb: "Habit tracker for students",
    h1: "A habit tracker for students",
    intro: "Superoutine helps students build study habits with a ready-made study pack, a focus timer, a prioritized to-do list and an AI coach that helps plan busy exam weeks.",
    sections: [
      { h2: "Which habits matter most for students?", answer: "Consistent study blocks, enough sleep and regular review matter more than long cramming sessions.", bullets: ["Study for a fixed block each day", "Review notes within 24 hours of class", "Sleep at a regular time", "Move your body daily"] },
      { h2: "What does the study pack include?", answer: "The Study pack has four steps and adds three habits.", bullets: ["Clear the desk", "Phone in another room", "Two 25-minute focus blocks", "Review notes for 10 minutes"], body: ["It adds the habits \"Study 1 hour\", \"Review notes\" and \"Read 20 pages\" to your grid."] },
      { h2: "How does Superoutine help in exam weeks?", answer: "Use the to-do list for each day's topics and ask the AI Coach to help balance them with your habits.", body: ["The focus timer helps you work in short sessions, and streak protection covers days when exams take over."] },
      { h2: "How much does it cost for students?", answer: "Superoutine is free for 15 days, then $4.99 per month or $39 per year, which works out to about $3.25 a month.", body: ["There is no separate student plan. The yearly plan is the lowest monthly cost."] },
    ],
    related: [{ to: "/pricing", label: "Pricing" }, { to: "/blog/habit-stacking-beginners-guide", label: "Habit stacking guide" }, { to: "/use-cases/adhd-routine-app", label: "ADHD routine app" }],
  },
  "fitness-habit-tracker": {
    path: "/use-cases/fitness-habit-tracker",
    title: "Fitness Habit Tracker – Superoutine",
    description: "Track workouts, steps and healthy eating with Superoutine, a fitness habit tracker with a fitness routine pack, weekly habits, streaks and XP. Free for 15 days.",
    crumb: "Fitness habit tracker",
    h1: "A fitness habit tracker that rewards consistency",
    intro: "Superoutine works as a fitness habit tracker: log workouts, steps and healthy meals as daily or weekly habits, follow the fitness routine pack, and earn XP for every session.",
    sections: [
      { h2: "What should a fitness habit tracker track?", answer: "Track the behaviors you control, such as workouts, steps and meals, rather than only results like weight.", body: ["Behaviors are what you repeat every day. Results follow them, but they change slowly and can be discouraging to watch daily."] },
      { h2: "What is in the fitness pack?", answer: "The Fitness pack has a four-step routine and three habits.", bullets: ["Warm up for 5 minutes", "Work out for 30 minutes", "Cool down and stretch", "Log protein intake"], body: ["It adds \"Workout\", \"10,000 steps\" and \"Eat healthy\" to your daily grid."] },
      { h2: "Can I track weekly workouts?", answer: "Yes. Use weekly habits for goals like \"3 gym sessions\" or \"one long run\" in the Weeks 1–5 view.", body: ["Daily habits fit things like steps or water; weekly habits fit training plans with rest days."] },
      { h2: "Does Superoutine sync with fitness devices?", answer: "No. Superoutine does not connect to wearables or health apps; you tick habits yourself.", body: ["Many people find a manual tick more motivating, because it is a conscious moment of commitment each day."] },
    ],
    related: [{ to: "/compare/superoutine-vs-streaks", label: "Superoutine vs Streaks" }, { to: "/use-cases/morning-routine-app", label: "Morning routine app" }, { to: "/features", label: "Features" }],
  },
};
