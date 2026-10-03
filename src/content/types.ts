export type Table = { head: string[]; rows: string[][] };
export type Section = {
  h2: string;
  answer: string;
  body?: string[];
  bullets?: string[];
  table?: Table;
  subs?: { h3: string; body: string }[];
};
export type QA = { q: string; a: string; more?: string };
export type ContentPageData = {
  path: string;
  title: string; // < 60 chars
  description: string; // 150-155 chars
  crumb: string;
  h1: string;
  intro: string;
  sections: Section[];
  faq?: QA[];
  related?: { to: string; label: string }[];
  article?: { author: string; published: string; updated: string };
  software?: boolean;
};
