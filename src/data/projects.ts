/**
 * Projects portfolio data.
 * Edit title, desc, tech stack, and links to showcase your work.
 */

export type Project = {
  title: string;
  desc: string;
  impactLine?: string; // e.g., "Used by 500+ students"
  tech: string[];
  links: { demo?: string; code?: string; writeup?: string };
};

export const projects: Project[] = [
  {
    title: "Project One",
    desc: "One sentence on what it does and why it matters.",
    impactLine: "Deployed to production",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    links: { demo: "#", code: "#" },
  },
  {
    title: "Project Two",
    desc: "Another clean description. Keep it short.",
    impactLine: "Used by X teams",
    tech: ["Python", "Unity", "Robotics"],
    links: { demo: "#", code: "#" },
  },
];
