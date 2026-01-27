"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LoaderToggle from "./LoaderToggle";
import { resume } from "@/data/resume";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo / Name */}
        <Link
          href="#top"
          className="font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 transition"
        >
          {resume.name}
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="#projects"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            Projects
          </a>
          <a
            href="#experience"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            Experience
          </a>
          <a
            href="#education"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            Education
          </a>
          <a
            href="#contact"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          >
            Contact
          </a>
        </div>

        {/* Right: LoaderToggle + ThemeToggle + Resume */}
        <div className="flex items-center gap-3">
          <LoaderToggle />
          <ThemeToggle />
          <a
            href="/ResumeW26.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
