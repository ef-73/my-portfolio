/**
 * FeaturedProjects.tsx
 *
 * Featured projects section with domain filtering
 * Phase 1: Filter by Robotics, CV, ML, Systems
 * Phase 2 TODO: Signal Map visualization
 */

"use client";

import { useState, useMemo } from "react";
import { Project } from "@/data/resume";
import ProjectCard from "./ProjectCard";
import { Reveal } from "./Reveal";

interface FeaturedProjectsProps {
  projects: Project[];
}

type Domain = "All" | "Robotics" | "CV" | "ML" | "Systems";

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [activeDomain, setActiveDomain] = useState<Domain>("All");

  const filteredProjects = useMemo(() => {
    if (activeDomain === "All") {
      return projects;
    }
    return projects.filter((project) =>
      project.domains.includes(activeDomain)
    );
  }, [projects, activeDomain]);

  const domains: Domain[] = ["All", "Robotics", "CV", "ML", "Systems"];

  return (
    <Reveal>
      <section id="projects" className="py-20">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Featured Projects
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Systems that turn noise into structure
            </p>
          </div>

          {/* Domain Filters */}
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeDomain === domain
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
              No projects found in this domain
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}
