/**
 * Experience timeline data.
 * Edit these values to add your work history and roles.
 */

export type ExperienceItem = {
  org: string;
  role: string;
  dateRange: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    org: "Company Name",
    role: "Software Engineer Intern",
    dateRange: "May 2024 — August 2024",
    bullets: [
      "Built and deployed feature that improved system performance by X%",
      "Collaborated with team of N engineers on critical infrastructure",
    ],
  },
  {
    org: "Robotics Team",
    role: "Lead Programmer",
    dateRange: "September 2023 — Present",
    bullets: [
      "Architected autonomous navigation system using real-time sensor fusion",
      "Mentored 3 junior programmers on software best practices",
    ],
  },
];
