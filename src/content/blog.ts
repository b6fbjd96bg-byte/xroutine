import type { ContentPageData } from "./types";

const AUTHOR = "Jatin Kumar, founder of Superoutine";
const PUB = "2026-10-03";

export const POSTS: Record<string, ContentPageData> = {
  "how-to-build-a-habit-that-sticks": {
    path: "/blog/how-to-build-a-habit-that-sticks",
    title: "How to Build a Habit That Sticks",
    description: "A practical guide to building a habit that sticks: start tiny, attach it to a cue, track it daily and plan for missed days. Steps you can use from today onward.",
    crumb: "How to build a habit that sticks",
    h1: "How to build a habit that sticks",
    intro: "To build a habit that sticks, make it tiny, attach it to something you already do, track it every day and plan in advance for the days you miss. Consistency matters far more than intensity.",
    article: { author: AUTHOR, published: PUB, updated: PUB },
    sections: [
      { h2: "Why do most new habits fail?", answer: "Most habits fail because they start too big and depend on motivation, which rises and falls.", body: ["A plan to run 5 km every morning works on a good week and collapses on a bad one. When the habit is small enough to do on your worst day, motivation stops being the bottleneck."] },
      { h2: "How small should a new habit be?", answer: "Small enough that it takes under two minutes and feels almost too easy.", bullets: ["Read one page instead of one chapter", "Put on running shoes instead of running 5 km", "Write one sentence instead of a journal entry"], body: ["Once the habit is automatic, you can grow it. Starting is the hard part; continuing is easier."] },
      { h2: "What is a habit cue?", answer: "A cue is the trigger that reminds you to act, such as a time, a place or a previous action.", body: ["The most reliable cue is an existing habit: \"after I pour my coffee, I will write one sentence.\" This is called habit stacking, and we cover it in our habit stacking guide."] },
      { h2: "Why should I track my habits?", answer: "Tracking makes progress visible, and visible progress is motivating.", body: ["A row of ticks is a small reward every day and a clear signal when something slips. A habit tracker like Superoutine adds XP and streaks so each tick feels like progress."] },
      { h2: "What should I do when I miss a day?", answer: "Never miss twice. One missed day is normal; restart the next day with the smallest version of the habit.", body: ["Missing a day is a chance to practice resilience, not proof that you failed. What predicts long-term success is how quickly you come back."] },
      { h2: "How long does it take to form a habit?", answer: "It varies widely by person and habit, from a few weeks to several months.", body: ["The often-quoted 21 days is a myth. Focus on showing up daily rather than counting down to a finish line."] },
    ],
    related: [{ to: "/blog/habit-stacking-beginners-guide", label: "Habit stacking: a beginner's guide" }, { to: "/features", label: "Superoutine features" }, { to: "/use-cases/morning-routine-app", label: "Build a morning routine" }],
  },
  "habit-stacking-beginners-guide": {
    path: "/blog/habit-stacking-beginners-guide",
    title: "Habit Stacking: A Beginner's Guide",
    description: "Habit stacking means linking a new habit to one you already do. Learn the formula, see 10 example stacks and avoid the common mistakes beginners make with it.",
    crumb: "Habit stacking guide",
    h1: "Habit stacking: a beginner's guide",
    intro: "Habit stacking means attaching a new habit to one you already do every day, using the formula \"After I [current habit], I will [new habit].\" The existing habit becomes a reliable reminder.",
    article: { author: AUTHOR, published: PUB, updated: PUB },
    sections: [
      { h2: "Why does habit stacking work?", answer: "It works because your existing habits already happen automatically, so they make dependable cues.", body: ["You don't need to remember a new time or set another alarm. The end of one action naturally prompts the next."] },
      { h2: "What is the habit stacking formula?", answer: "\"After I [current habit], I will [new habit].\"", body: ["Be specific. \"After I brush my teeth at night, I will put my phone on the charger in the kitchen\" works better than \"I'll use my phone less.\""] },
      { h2: "What are some example habit stacks?", answer: "Here are ten stacks you can copy today.", bullets: ["After I pour my coffee, I will write my top three tasks", "After I sit down at my desk, I will drink a glass of water", "After I close my laptop, I will stretch for two minutes", "After I get into bed, I will read one page", "After I brush my teeth, I will floss one tooth", "After I park the car, I will take three deep breaths", "After lunch, I will walk for five minutes", "After I take off my shoes, I will change into workout clothes", "After dinner, I will prepare tomorrow's clothes", "After I wake up, I will make the bed"] },
      { h2: "What mistakes should beginners avoid?", answer: "The most common mistakes are stacking too many habits at once and choosing an unreliable anchor.", bullets: ["Add one new habit per stack at a time", "Pick an anchor you do every single day", "Keep the new habit under two minutes at first"] },
      { h2: "How do I habit stack in Superoutine?", answer: "When you add a habit, link it to an existing one so the grid shows \"After: [habit]\" under its name.", body: ["Routine packs are pre-built stacks: each step cues the next. The AI Coach can also suggest stacks based on your strongest current habits."] },
    ],
    related: [{ to: "/blog/how-to-build-a-habit-that-sticks", label: "How to build a habit that sticks" }, { to: "/ai-coach", label: "The AI Coach" }, { to: "/use-cases/adhd-routine-app", label: "ADHD routine app" }],
  },
  "best-habit-trackers-2026": {
    path: "/blog/best-habit-trackers-2026",
    title: "Best Habit Trackers in 2026 (Compared)",
    description: "We compare five popular habit trackers in 2026 – Superoutine, Habitica, Streaks, Habitify and Fabulous – on features, platforms and price, so you can pick one.",
    crumb: "Best habit trackers in 2026",
    h1: "Best habit trackers in 2026 (compared)",
    intro: "The best habit tracker depends on what motivates you: Habitica suits gamers, Streaks suits Apple-only users, Habitify suits data lovers, Fabulous suits guided self-care, and Superoutine suits people who want gamification plus an AI coach. We make Superoutine, so weigh our view accordingly.",
    article: { author: AUTHOR, published: PUB, updated: PUB },
    sections: [
      { h2: "How do the top habit trackers compare?", answer: "Here is a side-by-side overview based on each app's public information as of October 2026.", table: { head: ["App", "Best for", "Platforms", "Pricing model"], rows: [["Superoutine", "Gamification + AI coach", "Web (any browser)", "15-day trial, then $4.99/mo"], ["Habitica", "RPG-style gamification", "Web, iOS, Android", "Free with optional subscription"], ["Streaks", "Minimal tracking on Apple", "iOS, watchOS, macOS", "One-time purchase"], ["Habitify", "Clean stats and integrations", "iOS, Android, Mac, web", "Free plan + premium"], ["Fabulous", "Guided self-care journeys", "iOS, Android", "Subscription"]] }, body: ["Prices and features change often, so check each vendor's site before you decide."] },
      { h2: "Which habit tracker is best for gamification?", answer: "Habitica has the deepest game mechanics; Superoutine offers lighter XP, levels and streaks.", body: ["If you want quests and avatars, Habitica is hard to beat. If you want game rewards without managing a character, Superoutine is simpler."] },
      { h2: "Which habit tracker works on every device?", answer: "Superoutine and Habitify both work across platforms, with Superoutine running in any browser.", body: ["Streaks is Apple-only, and Fabulous is mobile-only."] },
      { h2: "Which habit tracker has an AI coach?", answer: "Superoutine includes an AI Coach that reads your own habits, streaks and tasks.", body: ["Other apps offer coaching content or statistics, but check their sites for current AI features."] },
      { h2: "How should I choose?", answer: "Pick the app that matches what keeps you going, then commit to it for at least a month.", bullets: ["Motivated by games: Habitica or Superoutine", "Apple-only and minimal: Streaks", "Want stats and integrations: Habitify", "Want guided routines: Fabulous", "Want AI advice on your real data: Superoutine"] },
    ],
    related: [{ to: "/compare/superoutine-vs-habitica", label: "Superoutine vs Habitica" }, { to: "/compare/superoutine-vs-streaks", label: "Superoutine vs Streaks" }, { to: "/compare/superoutine-vs-habitify", label: "Superoutine vs Habitify" }, { to: "/compare/superoutine-vs-fabulous", label: "Superoutine vs Fabulous" }],
  },
};
