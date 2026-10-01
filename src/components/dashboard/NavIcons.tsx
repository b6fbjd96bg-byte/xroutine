type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const DashIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="3" width="8" height="10" rx="2.5" />
    <rect x="13" y="3" width="8" height="6" rx="2.5" />
    <rect x="13" y="11" width="8" height="10" rx="2.5" />
    <rect x="3" y="15" width="8" height="6" rx="2.5" />
  </svg>
);

export const CalIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 10h18" />
    <circle cx="8" cy="15" r="1.2" fill="currentColor" />
    <path d="M12 15.5l1.5 1.5 3-3" />
  </svg>
);

export const StatsIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 20h18" />
    <path d="M4 15l5-5 4 3 7-7" />
    <circle cx="20" cy="6" r="1.6" fill="currentColor" />
    <path d="M6 20v-2M11 20v-4M16 20v-6" />
  </svg>
);

export const GearIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2.2" />
    <circle cx="8" cy="17" r="2.2" />
    <path d="M4 12h16" strokeDasharray="1.5 3" />
  </svg>
);
