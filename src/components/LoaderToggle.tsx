"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface LoaderToggleProps {
  onReplayLoader?: () => void;
}

export default function LoaderToggle({ onReplayLoader }: LoaderToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // Clear the localStorage flag to show loader again
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_loader_seen");
      window.location.href = "/";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Replay loader animation"
        title="Replay signal animation"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded whitespace-nowrap">
          Replay animation
        </div>
      )}
    </div>
  );
}
