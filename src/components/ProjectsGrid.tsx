"use client";

import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { resume } from "@/data/resume";

export default function ProjectsGrid() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <Reveal>
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Projects
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              A few things I&apos;ve shipped, built, and explored.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {resume.allProjects.map((project) => (
            <Reveal key={project.id}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
