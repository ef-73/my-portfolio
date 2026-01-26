import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Generic section wrapper for consistent spacing, max-width, and scroll anchors.
 * Provides: max-w-5xl container, consistent padding, and scroll-margin-top for anchor links.
 */
export default function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-16 px-6 ${className}`.trim()}
    >
      <div className="mx-auto max-w-5xl">
        {children}
      </div>
    </section>
  );
}
