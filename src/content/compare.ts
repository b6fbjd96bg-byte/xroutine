import type { ContentPageData } from "./types";

type Comp = { slug: string; name: string; summary: string; platforms: string; price: string; strengths: string[]; choose: string; rows: string[][] };

const BASE_ROWS = (c: Comp): string[][] => [
  ["Price", "$4.99/mo, $39/yr or $79 lifetime", c.price],
  ["Free trial", "15 days, every feature", "See vendor site"],
  ["Platforms", "Web (desktop, iPhone, Android browsers)", c.platforms],
  ...c.rows,
];

const comps: Comp[] = [
  {
    slug: "habitica", name: "Habitica",
    summary: "Habitica turns habits into a role-playing game with avatars, quests and parties. Superoutine uses lighter gamification (XP, levels, streaks) and adds an AI coach that reads your progress.",
    platforms: "Web, iOS, Android", price: "Free core app; optional paid subscription",
    strengths: ["Deep RPG mechanics with avatars, gear and quests", "Party and guild features for group accountability", "Large, long-running community"],
    rows: [["Gamification", "XP, levels, streaks, milestones", "Full RPG: avatars, gear, quests, pets"], ["AI coach", "Yes, reads your habits and tasks", "No built-in AI coach"], ["Routines", "Step-by-step routines + 5 packs", "Dailies and checklists"], ["To-do list", "Yes, with priorities", "Yes"], ["Social features", "Referral program", "Parties, guilds, challenges"]],
    choose: "Choose Habitica if you love role-playing games and want group quests. Choose Superoutine if you want a cleaner tracker with an AI coach and analytics, without managing an avatar.",
  },
  {
    slug: "streaks", name: "Streaks",
    summary: "Streaks is a minimalist habit tracker for Apple devices, focused on a small number of habits. Superoutine runs in any browser and adds XP, routines, a to-do list and an AI coach.",
    platforms: "iPhone, iPad, Apple Watch, Mac", price: "One-time App Store purchase",
    strengths: ["Native Apple app with Apple Watch and Health integration", "Very simple, focused design", "One-time purchase"],
    rows: [["Gamification", "XP, levels, streaks", "Streak counts"], ["AI coach", "Yes", "No"], ["Android / Windows", "Yes, in the browser", "No"], ["Apple Health sync", "No", "Yes"], ["Routines and to-dos", "Yes", "Habits only"]],
    choose: "Choose Streaks if you only use Apple devices and want Apple Health and Watch integration. Choose Superoutine if you use Android or Windows, or want an AI coach, routines and a to-do list in one place.",
  },
  {
    slug: "habitify", name: "Habitify",
    summary: "Habitify is a clean, data-focused habit tracker with native apps on many platforms. Superoutine adds gamification with XP and levels, routine packs and an AI coach.",
    platforms: "iOS, Android, Mac, web", price: "Free plan with limits; paid premium plan",
    strengths: ["Native apps on many platforms", "Polished statistics", "Integrations with health and calendar apps"],
    rows: [["Gamification", "XP, levels, streaks, celebrations", "Streaks and stats"], ["AI coach", "Yes", "Check vendor site for current AI features"], ["Routine packs", "5 ready-made packs", "Habit groups by time of day"], ["To-do list", "Yes", "Habits focus"], ["Referral earnings", "Yes, 3 levels", "No"]],
    choose: "Choose Habitify if you want native apps and integrations with other tools. Choose Superoutine if you want gamification and an AI coach that reacts to your progress.",
  },
  {
    slug: "fabulous", name: "Fabulous",
    summary: "Fabulous is a guided self-care and routine app built around coaching journeys. Superoutine is a habit tracker first, with a 31-day grid, XP, analytics and an AI coach that uses your own data.",
    platforms: "iOS, Android", price: "Subscription with free trial",
    strengths: ["Guided journeys and audio coaching", "Strong focus on morning routines and self-care", "Polished native mobile apps"],
    rows: [["Tracking style", "31-day grid + weekly view", "Guided journeys and rituals"], ["AI coach", "Yes, uses your own data", "Scripted coaching content"], ["Gamification", "XP, levels, streaks", "Journey progress"], ["Desktop use", "Yes, in the browser", "Mobile apps"], ["To-do list", "Yes", "No"]],
    choose: "Choose Fabulous if you want guided, step-by-step self-care journeys. Choose Superoutine if you want to track your own habits in detail, see analytics and get AI advice on your real progress.",
  },
];

export const COMPARE: Record<string, ContentPageData> = Object.fromEntries(
  comps.map((c) => [
    `superoutine-vs-${c.slug}`,
    {
      path: `/compare/superoutine-vs-${c.slug}`,
      title: `Superoutine vs ${c.name}: Habit Tracker Comparison`.slice(0, 60),
      description: `Superoutine vs ${c.name}: an honest comparison of features, price and platforms, plus who should choose which habit tracker. Updated October 2026.`,
      crumb: `Superoutine vs ${c.name}`,
      h1: `Superoutine vs ${c.name}`,
      intro: c.summary,
      sections: [
        {
          h2: `How do Superoutine and ${c.name} compare?`,
          answer: `Both help you build habits, but they take different approaches. Here are the key differences in features, price and platforms.`,
          table: { head: ["", "Superoutine", c.name], rows: BASE_ROWS(c) },
          body: [`${c.name} details are based on its public information as of October 2026. Prices and features change, so check the ${c.name} website for the latest details.`],
        },
        {
          h2: `What does ${c.name} do well?`,
          answer: `${c.name} is a good app with real strengths.`,
          bullets: c.strengths,
        },
        {
          h2: "What does Superoutine do well?",
          answer: "Superoutine focuses on consistency through light gamification and personal AI coaching.",
          bullets: [
            "AI Coach that reads your habits, streaks, XP and tasks",
            "XP, levels and three streak protections a month",
            "Daily 31-day grid plus a separate weekly habits view",
            "Routines with five ready-made packs and a to-do list",
            "Momentum Meter and Comeback Score analytics",
            "Works in any browser, including Android and Windows",
          ],
        },
        { h2: "Who should choose which app?", answer: c.choose },
      ],
      related: [
        ...comps.filter((x) => x.slug !== c.slug).map((x) => ({ to: `/compare/superoutine-vs-${x.slug}`, label: `Superoutine vs ${x.name}` })),
        { to: "/blog/best-habit-trackers-2026", label: "Best habit trackers in 2026 (compared)" },
      ],
    } satisfies ContentPageData,
  ]),
);
