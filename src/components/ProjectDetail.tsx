/**
 * ProjectDetail.tsx
 *
 * Expanded modal view for project details
 * - Problem statement, approach, constraints
 * - Contextual metrics (IoU, NDCG@10, accuracy, rankings)
 * - Collapsible accordion sections (Architecture, Tradeoffs, Failure Modes, Next Steps)
 * - Links to GitHub, paper, demo
 * - Close on escape or backdrop click
 * - Keyboard accessible
 */

"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Project } from "@/data/resume";
import Accordion from "./Accordion";
import MetricChip from "./MetricChip";

interface ProjectDetailProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetail({
  project,
  isOpen,
  onClose,
}: ProjectDetailProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Content - centered, stops propagation to backdrop */}
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 p-6 flex items-start justify-between gap-4" id="modal-title">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 break-words">
                {project.title}
              </h2>
              {project.status === "in-progress" && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300 rounded flex-shrink-0">
                  In Progress
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              {project.problemStatement}
            </p>
          </div>

          {/* Close Button - Always visible and clickable */}
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            aria-label="Close project details (Esc)"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Domain Tags */}
          <div className="flex flex-wrap gap-2">
            {project.domains.map((domain) => (
              <span
                key={domain}
                className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              >
                {domain}
              </span>
            ))}
          </div>

          {/* Approach & Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Approach
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {project.approach}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Constraints
              </h3>
              <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                {project.constraints.map((constraint, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                      •
                    </span>
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contextual Metrics */}
          {(project.metrics.iou ||
            project.metrics.ndcg ||
            project.metrics.accuracy ||
            project.metrics.ranking) && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Metrics
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.metrics.iou && (
                  <MetricChip label="IoU" value={project.metrics.iou} />
                )}
                {project.metrics.ndcg && (
                  <MetricChip label="NDCG@10" value={project.metrics.ndcg} />
                )}
                {project.metrics.accuracy && (
                  <MetricChip
                    label="Accuracy"
                    value={project.metrics.accuracy}
                  />
                )}
                {project.metrics.ranking &&
                  project.metrics.ranking.map((rank) => (
                    <MetricChip
                      key={`${rank.position}-${rank.year}`}
                      label={`World Rank (${rank.year})`}
                      value={`#${rank.position}`}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Depth Sections */}
          <div className="space-y-3">
            <Accordion
              title="Architecture"
              items={project.depth.architecture}
            />
            <Accordion title="Tradeoffs" items={project.depth.tradeoffs} />
            <Accordion
              title="Failure Modes"
              items={project.depth.failureModes}
            />
            <Accordion title="Next Steps" items={project.depth.nextSteps} />
          </div>

          {/* Links */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                GitHub
              </a>
            )}
            {project.links.paper && (
              <a
                href={project.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Paper
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Demo
              </a>
            )}
            {project.links.writeup && (
              <a
                href={project.links.writeup}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Writeup
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
