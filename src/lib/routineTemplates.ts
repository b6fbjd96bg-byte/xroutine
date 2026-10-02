export type RoutineStep = { id: string; text: string };
export type Template = { key: string; name: string; time: "morning" | "evening" | "anytime"; steps: string[]; habits: string[] };

export const TEMPLATES: Template[] = [
  { key: "morning", name: "Energised morning", time: "morning", steps: ["Drink a glass of water", "Make the bed", "5 minutes of stretching", "Plan top 3 tasks"], habits: ["Drink 2L of water", "Stretching"] },
  { key: "evening", name: "Calm evening", time: "evening", steps: ["No screens 30 min before bed", "Write 3 good things", "Prepare tomorrow's clothes", "Read 10 pages"], habits: ["Journaling", "Reading", "Sleep by 11 PM"] },
  { key: "fitness", name: "Fitness pack", time: "anytime", steps: ["Warm up 5 min", "Workout 30 min", "Cool down & stretch", "Log protein intake"], habits: ["Workout", "10,000 steps", "Eat healthy"] },
  { key: "study", name: "Study pack", time: "anytime", steps: ["Clear the desk", "Phone in another room", "2 × 25 min focus blocks", "Review notes 10 min"], habits: ["Study 1 hour", "Review notes", "Read 20 pages"] },
  { key: "mind", name: "Mindfulness pack", time: "morning", steps: ["3 deep breaths", "10 min meditation", "Set one intention"], habits: ["Meditation", "Gratitude note"] },
];

export const newStep = (text: string): RoutineStep => ({ id: crypto.randomUUID(), text });
