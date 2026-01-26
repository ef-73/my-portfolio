"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { SITE } from "@/data/site";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SITE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <Reveal>
          <div className="space-y-2 mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Get in Touch
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Let&apos;s talk about your next project or collaboration.
            </p>
          </div>
        </Reveal>

        {/* Contact options */}
        <Reveal>
          <div className="flex flex-wrap gap-3 max-w-md">
            {/* Email copy button */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              {copied ? "Copied!" : "Copy Email"}
            </button>

            {/* Email link */}
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Email
            </a>

            {/* GitHub */}
            {SITE.socials.github && (
              <a
                href={SITE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                GitHub
              </a>
            )}

            {/* LinkedIn */}
            {SITE.socials.linkedin && (
              <a
                href={SITE.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                LinkedIn
              </a>
            )}

            {/* Resume */}
            <a
              href={SITE.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Resume
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
