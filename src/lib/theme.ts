export type Theme = "dark" | "light";
const KEY = "superoutine_theme";
export const getTheme = (): Theme => (localStorage.getItem(KEY) === "light" ? "light" : "dark");
export const applyTheme = (t: Theme) => {
  localStorage.setItem(KEY, t);
  document.documentElement.classList.toggle("light", t === "light");
  document.documentElement.classList.toggle("dark", t === "dark");
};
