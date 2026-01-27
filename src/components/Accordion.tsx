/**
 * Accordion.tsx
 *
 * Reusable collapsible accordion for project depth sections
 * - State: closed/open
 * - Content: bullet lists only (no paragraphs)
 * - Smooth height animation
 * - Keyboard accessible (Enter/Space to toggle)
 */

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}

export default function Accordion({
  title,
  items,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700">
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {items.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
