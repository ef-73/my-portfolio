"use client";

import Reveal from "./Reveal";
import { experience } from "@/data/experience";

export default function Timeline() {
  return (
    <section id="experience" className="scroll-mt-24 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <Reveal>
          <div className="space-y-2 mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Experience
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              A brief look at my professional journey.
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="space-y-8">
          {experience.map((item, idx) => (
            <Reveal key={idx}>
              <div className="relative pl-8 border-l-2 border-zinc-300 dark:border-zinc-700">
                {/* Timeline dot */}
                <div className="absolute -left-3.5 top-1 w-5 h-5 bg-zinc-900 dark:bg-white rounded-full border-4 border-white dark:border-zinc-950" />

                {/* Content */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
                      {item.role}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {item.org}
                    </p>
                  </div>

                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    {item.dateRange}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {item.bullets.map((bullet, bidx) => (
                      <li
                        key={bidx}
                        className="text-zinc-700 dark:text-zinc-300 text-sm flex gap-2"
                      >
                        <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
