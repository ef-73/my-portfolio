/**
 * ProjectCard.tsx
 *
 * Enhanced project card with:
 * - Title
 * - Problem statement (one-line framing)
 * - Domain tags for filtering
 * - Tech stack badges
 * - Clickable to expand into ProjectDetail modal
 */

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Project } from "@/data/resume";
import ProjectDetail from "./ProjectDetail";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDetailOpen(true)}
        className="group w-full text-left p-6 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600"
      >
        {/* Header with Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex-1">
            {project.title}
          </h3>
          {project.status === "in-progress" && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300 rounded flex-shrink-0">
              In Progress
            </span>
          )}
        </div>

        {/* Problem Statement */}
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
          {project.problemStatement}
        </p>

        {/* Domain Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.domains.map((domain) => (
            <span
              key={domain}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              {domain}
            </span>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:gap-3 transition-all">
          Learn More
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* Detail Modal */}
      <ProjectDetail
        project={project}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
