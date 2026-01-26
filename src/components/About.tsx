"use client";

import Reveal from "./Reveal";
import { SITE } from "@/data/site";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <Reveal>
          <div className="space-y-2 mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              About
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              A bit more about me.
            </p>
          </div>
        </Reveal>

        {/* Content */}
        <Reveal>
          <div className="space-y-4 max-w-2xl">
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {SITE.description}
            </p>

            {SITE.currentlyExploring && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Currently exploring
                </p>
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {SITE.currentlyExploring}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
