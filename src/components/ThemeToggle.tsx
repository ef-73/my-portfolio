"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(next ?? "light")}
      className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-sm backdrop-blur
                 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
      aria-label="Toggle theme"
    >
      {current === "dark" ? "☾ Dark" : "☀ Light"}
    </button>
  );
}
