import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group rounded-xl border border-zinc-200 bg-white/50 backdrop-blur hover:bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70 p-6 transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600">
      {/* Title */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {project.title}
      </h3>

      {/* Impact line if present */}
      {project.impactLine && (
        <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {project.impactLine}
        </p>
      )}

      {/* Description */}
      <p className="mt-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {project.desc}
      </p>

      {/* Tech badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="inline-block rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="mt-5 flex flex-wrap gap-3">
        {project.links.demo && (
          <a
            href={project.links.demo}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition underline underline-offset-2"
          >
            Demo
          </a>
        )}
        {project.links.code && (
          <a
            href={project.links.code}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition underline underline-offset-2"
          >
            Code
          </a>
        )}
        {project.links.writeup && (
          <a
            href={project.links.writeup}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition underline underline-offset-2"
          >
            Write-up
          </a>
        )}
      </div>
    </div>
  );
}
