import type { ContentPageData, QA } from "./types";

export const FACTS = {
  monthly: "$4.99/month",
  yearly: "$39/year",
  lifetime: "$79 one-time (first 100 buyers)",
  trial: "15-day free trial with every feature",
  platforms: "Web app that works in any modern browser on desktop, iPhone and Android",
};

export const billingFaq: QA[] = [
  { q: "How much does Superoutine cost?", a: "Superoutine Pro costs $4.99 per month, $39 per year, or $79 once for lifetime access (limited to the first 100 buyers). Every new account starts with a 15-day free trial." },
  { q: "Is there a free trial?", a: "Yes. Every new account gets a 15-day free trial with every Pro feature unlocked, including the AI Coach. You do not need a card to start." },
  { q: "What happens when the trial ends?", a: "After 15 days the app is locked until you choose a plan. Your habits, streaks and history stay saved, so you continue exactly where you left off after upgrading." },
  { q: "Can I cancel at any time?", a: "Yes. Monthly and yearly plans can be cancelled from Settings at any time, and you keep Pro until the end of the period you already paid for." },
  { q: "How do I pay?", a: "Payments are processed securely by Razorpay in US dollars. You can pay with major international debit and credit cards." },
  { q: "Do you offer refunds?", a: "Refund requests are handled under our Cancellation and Refunds policy. Contact support with your payment reference and we will review it." },
];

export const generalFaq: QA[] = [
  { q: "What is Superoutine?", a: "Superoutine is an AI habit tracker and routine planner. It helps you build daily routines with XP levels, streaks, an AI coach and progress analytics.", more: "It is sometimes searched as Super Routine. You track daily and weekly habits in a monthly grid, plan your day, and get feedback from an AI coach that knows your progress." },
  { q: "Is Superoutine free?", a: "Superoutine is free for the first 15 days with every feature. After that, Pro costs $4.99 per month, $39 per year or $79 once.", more: "There is no permanent free tier after the trial. Your data stays saved if you upgrade later." },
  { q: "Which devices does Superoutine work on?", a: "Superoutine is a web app that works in any modern browser on Windows, Mac, iPhone, iPad and Android.", more: "There is nothing to install. You can add it to your phone's home screen from the browser menu for app-like access." },
  { q: "What does the AI Coach do?", a: "The AI Coach is a chat assistant that reads your habits, streaks, XP and today's tasks, then gives specific, encouraging advice.", more: "You can ask it why a habit keeps slipping, how to plan a busy day, or how to restart after a break." },
  { q: "How do XP and levels work?", a: "You earn XP every time you complete a habit for today, and XP adds up into levels.", more: "Daily habits and weekly habits both give XP, so steady effort is rewarded more than occasional big pushes." },
  { q: "What happens if I miss a day?", a: "Missing a day does not erase your progress. Pro includes three streak protections a month, and the Comeback Score rewards you for getting back on track.", more: "Superoutine treats missed days as a chance to practice resilience, not as failure." },
  { q: "Can I track weekly habits?", a: "Yes. Weekly habits have their own Weeks 1–5 view, separate from the 31-day daily grid.", more: "Use weekly habits for things like laundry, a long run or a weekly review." },
  { q: "Are there ready-made routines?", a: "Yes. Superoutine includes five routine packs: morning, evening, fitness, study and mindfulness.", more: "Adding a pack creates a step-by-step routine and the related habits in one click. You can also build your own routines." },
  { q: "Does Superoutine have a to-do list?", a: "Yes. The To-Do tab is a simple daily task list with high, medium and low priorities.", more: "Completed tasks count toward today's progress alongside your habits." },
  { q: "Is my data private?", a: "Yes. Each account can only read its own data, enforced at the database level, and passwords are never stored in readable form.", more: "See the Privacy Policy for full details." },
  { q: "Can I earn money by referring friends?", a: "Yes. Refer & Earn pays 10% of every payment your invited friends make, plus 2% and 0.5% from the next two levels of invites.", more: "Earnings become available 30 days after each payment, with a $10 minimum payout." },
  { q: "How do I sign up?", a: "Go to the sign-up page and create an account with email or Google. Your 15-day free trial starts immediately.", more: "Email accounts need a quick verification click before the first sign-in." },
];

export const PAGES: Record<string, ContentPageData> = {
  pricing: {
    path: "/pricing",
    title: "Superoutine Pricing – Plans from $4.99/mo",
    description: "Superoutine pricing: Pro is $4.99/month, $39/year or $79 lifetime. Every new account starts with a 15-day free trial with every feature. Cancel anytime.",
    crumb: "Pricing",
    h1: "Superoutine pricing",
    intro: "Superoutine Pro costs $4.99 per month, $39 per year, or $79 once for lifetime access. Every new account starts with a 15-day free trial that includes every feature, so you can test the whole app before paying.",
    sections: [
      {
        h2: "How much does Superoutine cost?",
        answer: "There are three Pro plans, and all of them unlock the same features. The only difference is how you pay.",
        table: {
          head: ["Plan", "Price", "Effective monthly cost", "Billing"],
          rows: [
            ["Monthly", "$4.99/month", "$4.99", "Renews monthly, cancel anytime"],
            ["Yearly", "$39/year", "$3.25", "Renews yearly, cancel anytime"],
            ["Lifetime", "$79 once", "One payment", "No renewals, first 100 buyers only"],
          ],
        },
        body: ["Prices are in US dollars. The yearly plan saves about 35% compared with paying monthly for twelve months."],
      },
      {
        h2: "What is included in Pro?",
        answer: "Pro includes every feature in Superoutine. Nothing is held back for a higher tier.",
        bullets: [
          "Unlimited daily and weekly habits",
          "AI Coach chat that knows your habits, streaks and tasks",
          "Daily AI lessons on habit building",
          "XP, levels, streaks and three streak protections a month",
          "Routines with five ready-made packs",
          "To-do list, daily planner and focus timer",
          "Full analytics, Momentum Meter and Comeback Score",
        ],
      },
      {
        h2: "How does the 15-day free trial work?",
        answer: "The trial starts the moment you create an account and gives you every Pro feature for 15 days.",
        body: [
          "You do not need to enter a card to start. During the trial the dashboard shows how many days are left and what you have built so far.",
          "When the trial ends, the app is locked until you pick a plan. Your habits, check-ins and history are kept, so nothing is lost if you upgrade a few days later.",
        ],
      },
      {
        h2: "Which plan should I choose?",
        answer: "Choose monthly if you want to try Pro with the smallest commitment, yearly if you already know you will use it, and lifetime if you want to pay once.",
        body: [
          "Most people who keep a habit tracker for more than two months save money with the yearly plan. The lifetime plan is limited to the first 100 buyers and will not be offered again at this price once those spots are gone.",
        ],
      },
    ],
    faq: billingFaq,
    related: [
      { to: "/features", label: "See every feature" },
      { to: "/faq", label: "Read the full FAQ" },
      { to: "/compare/superoutine-vs-habitica", label: "Superoutine vs Habitica" },
    ],
  },

  features: {
    path: "/features",
    title: "Superoutine Features – XP, Streaks & AI Coach",
    description: "Explore Superoutine features: XP levels, streaks, an AI coach, routines, to-do list, analytics, reminders and referrals. Try every feature free for 15 days.",
    crumb: "Features",
    h1: "Superoutine features",
    intro: "Superoutine combines a habit tracker, a routine planner and an AI coach in one web app. You earn XP for every habit you complete, protect your streaks, and see clear analytics on how your routines are going.",
    software: true,
    sections: [
      {
        h2: "How does Superoutine gamify habits?",
        answer: "Every habit you complete earns XP, XP adds up into levels, and consecutive days build streaks.",
        subs: [
          { h3: "XP and levels", body: "Ticking off a habit for today gives you XP. Daily habits and weekly habits both count, so consistent small steps move you up levels faster than occasional big efforts." },
          { h3: "Streaks and streak protection", body: "Your streak grows each day you complete your habits. Pro includes three streak protections a month, so a sick day or a trip does not wipe out weeks of progress." },
          { h3: "Milestones and celebrations", body: "Hitting 100% of your habits for the day triggers a full-screen celebration, and milestone cards mark long streaks." },
        ],
      },
      {
        h2: "What can the AI Coach help with?",
        answer: "The AI Coach is a chat assistant that knows your habits, streaks, XP and today's tasks, and gives specific advice based on them.",
        body: [
          "Ask it how to restart a habit after a break, how to fit exercise into a busy week, or which habit to focus on first. It uses growth framing: missed days are treated as chances to practice resilience, never as failures.",
          "Pro also includes a short AI lesson each day on a habit-building topic.",
        ],
      },
      {
        h2: "What analytics does Superoutine show?",
        answer: "Superoutine shows your daily completion trend, monthly progress, streaks and two resilience scores.",
        bullets: [
          "Daily Completion Trend line graph for the month",
          "Momentum Meter: your trend over the last 7 days",
          "Comeback Score: how quickly you recover after missing a day",
          "Monthly and weekly progress percentages",
          "Heatmap calendar of completed days",
        ],
      },
      {
        h2: "How do routines and the to-do list work?",
        answer: "Routines are step-by-step checklists you tick off each day, and the to-do list holds one-off tasks for today.",
        body: [
          "You can build your own morning, evening or anytime routines, or add one of five ready-made packs: morning, evening, fitness, study and mindfulness. A pack creates the routine and the related habits in one click.",
          "The to-do list supports high, medium and low priorities. Completed tasks count toward today's progress and XP.",
        ],
      },
      {
        h2: "Does Superoutine send reminders?",
        answer: "Yes. Superoutine has an in-app notifications inbox and optional browser notifications for reminders.",
        body: ["You choose which notifications you want in Settings. Payment confirmations, renewal dates and referral earnings also arrive in the inbox."],
      },
      {
        h2: "How does Refer & Earn work?",
        answer: "You earn 10% of every payment made by friends you invite, plus 2% from their invites and 0.5% from the level after that.",
        body: ["Earnings include renewals, become available 30 days after each payment, and can be withdrawn to a bank account once they reach $10."],
      },
    ],
    related: [
      { to: "/ai-coach", label: "Learn about the AI Coach" },
      { to: "/pricing", label: "See pricing" },
      { to: "/use-cases/morning-routine-app", label: "Use Superoutine for your morning routine" },
    ],
  },

  "ai-coach": {
    path: "/ai-coach",
    title: "Superoutine AI Coach – Personal Habit Coaching",
    description: "The Superoutine AI Coach reads your habits, streaks and tasks to give specific, encouraging advice. See example chats and who it helps. Free for 15 days.",
    crumb: "AI Coach",
    h1: "The Superoutine AI Coach",
    intro: "The Superoutine AI Coach is a chat assistant built into your dashboard. It reads your habits, streaks, XP and today's tasks, then gives specific, encouraging advice instead of generic tips.",
    sections: [
      {
        h2: "What does the AI Coach do?",
        answer: "It answers questions about your own routine using your real progress data.",
        bullets: [
          "Explains which habits are slipping and suggests a smaller version to restart",
          "Helps you plan a realistic day around your tasks",
          "Suggests habit stacks that fit the habits you already have",
          "Encourages you after a missed day without guilt or shame",
        ],
        body: ["Because it knows your numbers, it can say things like \"your reading streak dropped on weekends\" rather than \"try to read more\"."],
      },
      {
        h2: "What does a conversation look like?",
        answer: "You type a question in plain English and get a short, practical reply based on your data.",
        subs: [
          { h3: "Example: restarting after a break", body: "You: \"I missed my workout four days in a row. Should I just give up on it?\" Coach: \"Not at all. You completed it 18 times this month before the break, which shows the habit is real. Try a 10-minute version tomorrow to restart the streak, then go back to your full workout on Thursday.\"" },
          { h3: "Example: planning a busy day", body: "You: \"I have six tasks today and feel overwhelmed.\" Coach: \"Start with your two high-priority tasks before lunch. Your meditation habit takes 10 minutes and you usually do it in the morning, so keep it there. Move the low-priority tasks to tomorrow if needed.\"" },
          { h3: "Example: adding a new habit", body: "You: \"I want to start journaling.\" Coach: \"You already drink water every morning with a 22-day streak. Stack journaling right after it: one sentence while you finish your glass.\"" },
        ],
      },
      {
        h2: "Who is the AI Coach for?",
        answer: "It helps anyone who knows what they want to change but struggles to stay consistent.",
        bullets: [
          "People restarting habits after a busy period",
          "Students balancing study habits with exams",
          "People with ADHD who benefit from small, concrete next steps",
          "Anyone building a morning or fitness routine",
        ],
      },
      {
        h2: "Is the AI Coach included in every plan?",
        answer: "Yes. The AI Coach is included in the 15-day free trial and in every Pro plan from $4.99 per month.",
        body: ["The coach is not a medical or mental-health service. For health concerns, please talk to a qualified professional."],
      },
    ],
    related: [
      { to: "/features", label: "All features" },
      { to: "/use-cases/adhd-routine-app", label: "Superoutine for ADHD routines" },
      { to: "/blog/how-to-build-a-habit-that-sticks", label: "How to build a habit that sticks" },
    ],
  },

  about: {
    path: "/about",
    title: "About Superoutine – AI Habit Tracker",
    description: "Superoutine is an AI habit tracker and routine planner built to make consistency feel rewarding. Learn why it was built, how it works and how to reach us.",
    crumb: "About",
    h1: "About Superoutine",
    intro: "Superoutine is an AI habit tracker and routine planner that helps people build daily routines with XP levels, streaks, an AI coach and clear analytics. It is built and run by an independent developer, Jatin Kumar.",
    sections: [
      {
        h2: "What is Superoutine?",
        answer: "Superoutine is a web app for tracking daily and weekly habits, planning your day and getting coaching from an AI that knows your progress.",
        body: [
          "You track habits in a 31-day grid, tick off weekly habits in a Weeks 1–5 view, follow step-by-step routines, and keep a short to-do list for the day. Each completed habit earns XP, and your streaks and trends show how your routines are going.",
          "Superoutine works in any modern browser on desktop and phone. Pro costs $4.99 per month, $39 per year or $79 lifetime, after a 15-day free trial.",
        ],
      },
      {
        h2: "Why was Superoutine built?",
        answer: "It was built because most habit trackers either feel like a spreadsheet or punish you for missing a day.",
        body: [
          "Superoutine uses growth framing: missed days are treated as chances to practice resilience. The Comeback Score rewards you for getting back on track, and streak protection keeps one bad day from erasing weeks of effort.",
          "The goal is to make consistency feel rewarding, so people keep their routines long enough for them to become automatic.",
        ],
      },
      {
        h2: "Who builds Superoutine?",
        answer: "Superoutine is designed and developed by Jatin Kumar, an independent full-stack developer.",
        body: ["Being independent means features are shaped directly by user feedback. If something is missing or confusing, the contact page reaches the person who builds the product."],
      },
      {
        h2: "How can I contact Superoutine?",
        answer: "You can reach the team through the contact page or by email at support@superoutine.pro.",
        body: ["For billing questions, include your payment reference so we can help faster."],
      },
    ],
    related: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/contact", label: "Contact" },
    ],
  },

  faq: {
    path: "/faq",
    title: "Superoutine FAQ – Habit Tracker Questions",
    description: "Answers about Superoutine: pricing, the 15-day free trial, AI Coach, XP and streaks, devices, routines, privacy and referrals. Short answers come first.",
    crumb: "FAQ",
    h1: "Superoutine frequently asked questions",
    intro: "Superoutine is an AI habit tracker that costs $4.99 per month after a 15-day free trial. Below are short, direct answers to the most common questions, with more detail where it helps.",
    sections: [],
    faq: [...generalFaq, ...billingFaq.slice(2)],
    related: [
      { to: "/pricing", label: "Pricing" },
      { to: "/features", label: "Features" },
      { to: "/contact", label: "Still have a question? Contact us" },
    ],
  },
};
